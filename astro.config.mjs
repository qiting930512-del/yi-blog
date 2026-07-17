import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://yi-blog.vercel.app',
  integrations: [sitemap()],
});
