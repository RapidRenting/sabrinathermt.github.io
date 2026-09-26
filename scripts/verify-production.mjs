import { resolve4, resolve6, resolveCname, resolveMx, resolveTxt } from 'node:dns/promises';

const origin = 'https://sabrinathermt.com';
const expectedA = ['185.199.108.153', '185.199.109.153', '185.199.110.153', '185.199.111.153'];
const expectedAAAA = [
  '2606:50c0:8000::153',
  '2606:50c0:8001::153',
  '2606:50c0:8002::153',
  '2606:50c0:8003::153',
];
const expectedMx = [
  'alt1.aspmx.l.google.com',
  'alt2.aspmx.l.google.com',
  'alt3.aspmx.l.google.com',
  'alt4.aspmx.l.google.com',
  'aspmx.l.google.com',
];
const routePairs = [
  ['/', '/fr/'],
  ['/meet-sabrina/', '/fr/rencontrez-sabrina/'],
  ['/services/', '/fr/services/'],
  ['/faq/', '/fr/faq/'],
  ['/privacy/', '/fr/confidentialite/'],
  ['/locations/centretown-gladstone/', '/fr/lieux/centre-ville-gladstone/'],
  ['/locations/glebe-fourth/', '/fr/lieux/glebe-fourth/'],
];
const bookingUrls = [
  'https://sabrinathermt.janeapp.com/',
  'https://sabrinathermt.janeapp.com/locations/centretown-481-gladstone-ave/book',
  'https://sabrinathermt.janeapp.com/locations/glebe-101-fourth-avenue/book',
];

function normalize(values) {
  return [...new Set(values.map((value) => value.toLowerCase().replace(/\.$/, '')))].sort();
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertSet(actual, expected, label) {
  const normalizedActual = normalize(actual);
  const normalizedExpected = normalize(expected);
  assert(
    JSON.stringify(normalizedActual) === JSON.stringify(normalizedExpected),
    `${label} mismatch. Expected ${normalizedExpected.join(', ')}; received ${normalizedActual.join(', ') || 'none'}.`,
  );
}

async function resolveOrEmpty(resolver, name) {
  try {
    return await resolver(name);
  } catch (error) {
    if (error?.code === 'ENODATA' || error?.code === 'ENOTFOUND') return [];
    throw error;
  }
}

async function followRedirects(startUrl) {
  let url = startUrl;
  for (let count = 0; count < 6; count += 1) {
    const response = await fetch(url, { redirect: 'manual' });
    if (response.status < 300 || response.status >= 400) return { response, url };
    const location = response.headers.get('location');
    assert(location, `${url} returned a redirect without a Location header.`);
    url = new URL(location, url).href;
  }
  throw new Error(`${startUrl} exceeded the redirect limit.`);
}

async function requireOk(url) {
  const response = await fetch(url, { redirect: 'follow' });
  assert(response.ok, `${url} returned HTTP ${response.status}.`);
  return response;
}

const ipv4 = await resolve4('sabrinathermt.com');
assertSet(ipv4, expectedA, 'A records');

const ipv6 = await resolveOrEmpty(resolve6, 'sabrinathermt.com');
assertSet(ipv6, expectedAAAA, 'AAAA records');

const www = await resolveCname('www.sabrinathermt.com');
assertSet(www, ['rapidrenting.github.io'], 'www CNAME');

const mx = await resolveMx('sabrinathermt.com');
assertSet(
  mx.map((record) => record.exchange),
  expectedMx,
  'Google Workspace MX records',
);

const txt = (await resolveTxt('sabrinathermt.com')).map((parts) => parts.join(''));
assert(
  txt.includes('v=spf1 include:_spf.google.com -all'),
  'Google Workspace SPF record is missing.',
);
assert(
  txt.some((value) => value.startsWith('google-site-verification=')),
  'Google site-verification TXT record is missing.',
);

const challenge = await resolveOrEmpty(
  resolveTxt,
  '_github-pages-challenge-RapidRenting.sabrinathermt.com',
);
assert(challenge.length > 0, 'GitHub Pages domain-verification TXT record is missing.');

for (const startUrl of ['http://sabrinathermt.com/', 'https://www.sabrinathermt.com/']) {
  const result = await followRedirects(startUrl);
  assert(result.response.ok, `${startUrl} ended with HTTP ${result.response.status}.`);
  assert(result.url === `${origin}/`, `${startUrl} ended at ${result.url} instead of ${origin}/.`);
}

for (const [englishPath, frenchPath] of routePairs) {
  for (const [path, alternatePath, locale, alternateLocale] of [
    [englishPath, frenchPath, 'en-CA', 'fr-CA'],
    [frenchPath, englishPath, 'fr-CA', 'en-CA'],
  ]) {
    const url = `${origin}${path}`;
    const html = await (await requireOk(url)).text();
    assert(html.includes(`<html lang="${locale}"`), `${url} is missing lang="${locale}".`);
    assert(!html.includes('noindex'), `${url} is unexpectedly blocked from indexing.`);
    assert(
      html.includes(`<link rel="canonical" href="${url}"`),
      `${url} has an incorrect canonical URL.`,
    );
    assert(
      html.includes(`hreflang="${alternateLocale}" href="${origin}${alternatePath}"`),
      `${url} is missing its ${alternateLocale} alternate.`,
    );
  }
}

const robots = await (await requireOk(`${origin}/robots.txt`)).text();
assert(!/^Disallow:\s*\/$/m.test(robots), 'robots.txt blocks the public site root.');
assert(
  robots.includes(`Sitemap: ${origin}/sitemap-index.xml`),
  'robots.txt has an incorrect sitemap URL.',
);

const sitemapIndex = await (await requireOk(`${origin}/sitemap-index.xml`)).text();
assert(
  sitemapIndex.includes(`${origin}/sitemap-0.xml`),
  'Sitemap index does not include sitemap-0.xml.',
);
await requireOk(`${origin}/sitemap-0.xml`);

for (const bookingUrl of bookingUrls) await requireOk(bookingUrl);

console.log(
  'Production verification passed: DNS, email records, HTTPS redirects, bilingual metadata, sitemap, and booking links.',
);
