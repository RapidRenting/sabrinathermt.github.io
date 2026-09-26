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

for (const [path, full] of files) {
  if (extname(full) !== '.html') continue;
  const html = await readFile(full, 'utf8');
  if (!path.startsWith('admin/') && html.includes('noindex')) {
    throw new Error(`Public page must be indexable: ${path}`);
  }
  for (const match of html.matchAll(/href="(\/[^"#?]*)/g)) {
    const href = match[1];
    if (href.startsWith('/assets/') || href.startsWith('/admin/')) continue;
    if (files.has(href.slice(1))) continue;
    const normalized = href.endsWith('/') ? href : `${href}/`;
    if (!knownPaths.has(normalized)) {
      throw new Error(`Broken internal link in ${path}: ${href}`);
    }
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
