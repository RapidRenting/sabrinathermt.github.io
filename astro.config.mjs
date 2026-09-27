import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { routePairs } from './src/data/site.ts';

const origin = 'https://sabrinathermt.com';
const localeOf = (path) => (path.startsWith('/fr/') ? 'fr-CA' : 'en-CA');

export default defineConfig({
  site: origin,
  output: 'static',
  trailingSlash: 'always',
  build: {
    // The stylesheet is small; inlining it removes a render-blocking request.
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      serialize(item) {
        const path = new URL(item.url).pathname;
        const alternate = routePairs[path];
        if (alternate) {
          item.links = [path, alternate].map((pagePath) => ({
            url: new URL(pagePath, origin).href,
            lang: localeOf(pagePath),
          }));
        }
        return item;
      },
    }),
  ],
});
