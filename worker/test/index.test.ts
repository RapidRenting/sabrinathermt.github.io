import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleRequest } from '../src/index';

const env = {
  GITHUB_OAUTH_ID: 'client-id',
  GITHUB_OAUTH_SECRET: 'client-secret',
  SITE_ORIGIN: 'https://sabrinathermt.com',
  ALLOWED_GITHUB_USERS: 'rapidrenting,sabrina-future',
};

afterEach(() => vi.restoreAllMocks());

describe('CMS OAuth worker', () => {
  it('creates a short-lived secure CSRF cookie and GitHub redirect', async () => {
    const response = await handleRequest(
      new Request(
        'https://cms-auth.sabrinathermt.com/auth?provider=github&site_id=sabrinathermt.com',
      ),
      env,
    );
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toContain('https://github.com/login/oauth/authorize');
    expect(response.headers.get('set-cookie')).toContain('__Host-decap_oauth_state=');
    expect(response.headers.get('set-cookie')).toContain('Max-Age=600');
    expect(response.headers.get('set-cookie')).toContain('HttpOnly');
  });

  it('rejects a callback without matching CSRF state', async () => {
    const response = await handleRequest(
      new Request(
        'https://cms-auth.sabrinathermt.com/callback?provider=github&code=test&state=wrong',
      ),
      env,
    );
    expect(response.status).toBe(200);
    expect(await response.text()).toContain('sign-in request expired');
  });

  it('permits an allowlisted GitHub login', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ access_token: 'token-value' }), { status: 200 }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ login: 'RapidRenting' }), { status: 200 }),
        ),
    );
    const response = await handleRequest(
      new Request(
        'https://cms-auth.sabrinathermt.com/callback?provider=github&code=test&state=abc',
        {
          headers: { Cookie: '__Host-decap_oauth_state=abc' },
        },
      ),
      env,
    );
    expect(await response.text()).toContain('authorization:github:success');
    expect(response.headers.get('set-cookie')).toContain('Max-Age=0');
  });

  it('rejects a GitHub login that is not allowlisted', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ access_token: 'token-value' }), { status: 200 }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ login: 'someone-else' }), { status: 200 }),
        ),
    );
    const response = await handleRequest(
      new Request(
        'https://cms-auth.sabrinathermt.com/callback?provider=github&code=test&state=abc',
        {
          headers: { Cookie: '__Host-decap_oauth_state=abc' },
        },
      ),
      env,
    );
    expect(await response.text()).toContain('not authorized');
  });
});
