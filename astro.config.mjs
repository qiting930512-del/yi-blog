import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://yi-blog-qiting930512-dels-projects.vercel.app',
  integrations: [sitemap()],
});
