interface Env {
  GITHUB_OAUTH_ID: string;
  GITHUB_OAUTH_SECRET: string;
  SITE_ORIGIN: string;
  ALLOWED_GITHUB_USERS: string;
}

const stateCookieName = '__Host-decap_oauth_state';
const cookieLifetimeSeconds = 600;
const githubApiVersion = '2022-11-28';

function secureHeaders(contentType = 'text/plain; charset=utf-8'): HeadersInit {
  return {
    'Cache-Control': 'no-store',
    'Content-Type': contentType,
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };
}

function randomState(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function getCookie(request: Request, name: string): string | null {
  const cookie = request.headers.get('Cookie');
  if (!cookie) return null;
  for (const part of cookie.split(';')) {
    const [key, ...value] = part.trim().split('=');
    if (key === name) return decodeURIComponent(value.join('='));
  }
  return null;
}

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return result === 0;
}

function callbackUrl(url: URL): string {
  return `${url.origin}/callback?provider=github`;
}

function validateSiteId(url: URL, env: Env): boolean {
  const siteId = url.searchParams.get('site_id');
  if (!siteId) return true;
  try {
    return new URL(env.SITE_ORIGIN).hostname === siteId;
  } catch {
    return false;
  }
}

function handleAuth(request: Request, url: URL, env: Env): Response {
  if (request.method !== 'GET')
    return new Response('Method not allowed', { status: 405, headers: secureHeaders() });
  if (url.searchParams.get('provider') !== 'github' || !validateSiteId(url, env)) {
    return new Response('Invalid authentication request', {
      status: 400,
      headers: secureHeaders(),
    });
  }

  const state = randomState();
  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', env.GITHUB_OAUTH_ID);
  authorize.searchParams.set('redirect_uri', callbackUrl(url));
  authorize.searchParams.set('scope', 'public_repo');
  authorize.searchParams.set('state', state);

  const headers = new Headers(secureHeaders());
  headers.set('Location', authorize.href);
  headers.set(
    'Set-Cookie',
    `${stateCookieName}=${state}; Max-Age=${cookieLifetimeSeconds}; Path=/; Secure; HttpOnly; SameSite=Lax`,
  );
  return new Response(null, { status: 302, headers });
}

async function readSmallJson<T>(response: Response): Promise<T> {
  const declaredLength = Number(response.headers.get('Content-Length') ?? '0');
  if (declaredLength > 16_384) throw new Error('OAuth provider response was unexpectedly large.');
  const body = await response.text();
  if (body.length > 16_384) throw new Error('OAuth provider response was unexpectedly large.');
  return JSON.parse(body) as T;
}

async function exchangeCode(code: string, redirectUri: string, env: Env): Promise<string | null> {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'sabrina-rmt-cms-auth',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_OAUTH_ID,
      client_secret: env.GITHUB_OAUTH_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  });
  if (!response.ok) return null;
  const payload = await readSmallJson<{ access_token?: string }>(response);
  return payload.access_token ?? null;
}

async function githubLogin(token: string): Promise<string | null> {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'sabrina-rmt-cms-auth',
      'X-GitHub-Api-Version': githubApiVersion,
    },
  });
  if (!response.ok) return null;
  const payload = await readSmallJson<{ login?: string }>(response);
  return payload.login?.toLowerCase() ?? null;
}

function callbackPage(
  status: 'success' | 'error',
  payload: { token?: string; message?: string },
  origin: string,
): Response {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  const safeMessage = JSON.stringify(message).replaceAll('<', '\\u003c');
  const safeOrigin = JSON.stringify(origin).replaceAll('<', '\\u003c');
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>FAQ editor authorization</title></head><body><p id="status">Completing authorization…</p>
<script>
const targetOrigin=${safeOrigin};const result=${safeMessage};
function send(){if(!window.opener){document.getElementById('status').textContent='Return to the FAQ editor and try again.';return;}window.opener.postMessage(result,targetOrigin);window.close();}
window.addEventListener('message',(event)=>{if(event.origin===targetOrigin&&event.data==='authorizing:github')send()});
window.opener?.postMessage('authorizing:github',targetOrigin);setTimeout(send,700);
</script></body></html>`;

  return new Response(html, {
    headers: {
      ...secureHeaders('text/html; charset=utf-8'),
      'Content-Security-Policy':
        "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
    },
  });
}

function expireStateCookie(response: Response): Response {
  response.headers.append(
    'Set-Cookie',
    `${stateCookieName}=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Lax`,
  );
  return response;
}

async function handleCallback(request: Request, url: URL, env: Env): Promise<Response> {
  if (request.method !== 'GET')
    return new Response('Method not allowed', { status: 405, headers: secureHeaders() });
  if (url.searchParams.get('provider') !== 'github') {
    return new Response('Invalid provider', { status: 400, headers: secureHeaders() });
  }

  const state = url.searchParams.get('state') ?? '';
  const cookieState = getCookie(request, stateCookieName) ?? '';
  if (!state || !cookieState || !constantTimeEqual(state, cookieState)) {
    return expireStateCookie(
      callbackPage(
        'error',
        { message: 'The sign-in request expired. Please try again.' },
        env.SITE_ORIGIN,
      ),
    );
  }

  const code = url.searchParams.get('code');
  if (!code) {
    return expireStateCookie(
      callbackPage(
        'error',
        { message: 'GitHub did not return an authorization code.' },
        env.SITE_ORIGIN,
      ),
    );
  }

  const token = await exchangeCode(code, callbackUrl(url), env);
  if (!token) {
    return expireStateCookie(
      callbackPage('error', { message: 'GitHub authorization failed.' }, env.SITE_ORIGIN),
    );
  }

  const login = await githubLogin(token);
  const allowed = new Set(
    env.ALLOWED_GITHUB_USERS.split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );
  if (!login || !allowed.has(login)) {
    return expireStateCookie(
      callbackPage(
        'error',
        { message: 'This GitHub account is not authorized for the FAQ editor.' },
        env.SITE_ORIGIN,
      ),
    );
  }

  return expireStateCookie(callbackPage('success', { token }, env.SITE_ORIGIN));
}

export async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname === '/auth') return handleAuth(request, url, env);
  if (url.pathname === '/callback') return handleCallback(request, url, env);
  if (url.pathname === '/health')
    return Response.json(
      { ok: true },
      { headers: secureHeaders('application/json; charset=utf-8') },
    );
  return new Response('Not found', { status: 404, headers: secureHeaders() });
}

export default {
  fetch(request: Request, env: Env): Promise<Response> {
    return handleRequest(request, env);
  },
};
