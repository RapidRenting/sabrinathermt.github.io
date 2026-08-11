import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sabrinathermt.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
