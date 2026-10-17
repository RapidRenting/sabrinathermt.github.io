import { readFile, readdir } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';

const root = resolve('dist');
const required = [
  'index.html',
  'fr/index.html',
  'meet-sabrina/index.html',
  'fr/rencontrez-sabrina/index.html',
  'services/index.html',
  'fr/services/index.html',
  'faq/index.html',
  'fr/faq/index.html',
  'privacy/index.html',
  'fr/confidentialite/index.html',
  'locations/centretown-gladstone/index.html',
  'locations/glebe-fourth/index.html',
  'fr/lieux/centre-ville-gladstone/index.html',
  'fr/lieux/glebe-fourth/index.html',
  'robots.txt',
  'sitemap-index.xml',
  'admin/index.html',
  'admin/config.yml',
  '404.html',
  'apple-touch-icon.png',
];

const files = new Map();
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) await walk(full);
    else files.set(relative(root, full).replaceAll('\\', '/'), full);
  }
}
await walk(root);

for (const path of required) {
  if (!files.has(path)) throw new Error(`Missing required build output: ${path}`);
}

const adminHtml = await readFile(files.get('admin/index.html'), 'utf8');
if (!adminHtml.includes('id="nc-root"')) {
  throw new Error('The FAQ editor must mount inside #nc-root so its loading message is replaced.');
}

const knownPaths = new Set(
  [...files.keys()]
    .filter((path) => path.endsWith('index.html'))
    .map((path) => `/${path.replace(/index\.html$/, '')}`),
);

const pages = new Map();
for (const [path, full] of files) {
  if (extname(full) !== '.html') continue;
  pages.set(path, await readFile(full, 'utf8'));
}

const pagePath = (path) => `/${path.replace(/index\.html$/, '')}`;
const idsOf = new Map(
  [...pages].map(([path, html]) => [
    pagePath(path),
    new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])),
  ]),
);

function requireAsset(path, url) {
  if (!url.startsWith('/') || url.startsWith('//')) return;
  if (!files.has(url.split(/[?#]/)[0].slice(1))) {
    throw new Error(`Missing asset referenced in ${path}: ${url}`);
  }
}

for (const [path, html] of pages) {
  if (!path.startsWith('admin/') && path !== '404.html' && html.includes('noindex')) {
    throw new Error(`Public page must be indexable: ${path}`);
  }
  for (const match of html.matchAll(/href="(\/[^"#?]*)(?:#([^"?]*))?/g)) {
    const [, href, fragment] = match;
    if (href.startsWith('/assets/') || href.startsWith('/admin/')) continue;
    if (files.has(href.slice(1))) continue;
    const normalized = href.endsWith('/') ? href : `${href}/`;
    if (!knownPaths.has(normalized)) {
      throw new Error(`Broken internal link in ${path}: ${href}`);
    }
    if (fragment && !idsOf.get(normalized)?.has(fragment)) {
      throw new Error(`Broken anchor in ${path}: ${href}#${fragment}`);
    }
  }
  // Same-page anchors, such as the skip link and the schedule's location links.
  for (const match of html.matchAll(/href="#([^"]+)"/g)) {
    if (!idsOf.get(pagePath(path)).has(match[1])) {
      throw new Error(`Broken anchor in ${path}: #${match[1]}`);
    }
  }
  // Every image, source set and absolute asset URL (Open Graph, JSON-LD) must exist in the build.
  for (const match of html.matchAll(/\s(?:src|srcset)="([^"]+)"/g)) {
    for (const candidate of match[1].split(',')) {
      requireAsset(path, candidate.trim().split(/\s+/)[0]);
    }
  }
  for (const match of html.matchAll(/https:\/\/sabrinathermt\.com(\/assets\/[^"'\s<)]+)/g)) {
    requireAsset(path, match[1]);
  }
}

const robots = await readFile(files.get('robots.txt'), 'utf8');
if (robots.includes('Disallow: /\n') || robots.includes('Disallow: /\r\n')) {
  throw new Error('robots.txt must not block the public site root.');
}

for (const location of ['gladstone-entrance', 'fourth-entrance']) {
  for (const width of [640, 960, 1400]) {
    for (const extension of ['avif', 'webp']) {
      const path = `assets/locations/${location}-${width}.${extension}`;
      if (!files.has(path)) throw new Error(`Missing responsive location image: ${path}`);
    }
  }
}

console.log(`Validated ${files.size} build outputs and internal links.`);
