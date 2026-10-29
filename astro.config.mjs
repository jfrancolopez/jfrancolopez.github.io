// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jfrancolopez.com',
  integrations: [sitemap()],
  security: {
    // GitHub Pages can't send security headers, so Astro writes a Content-Security-Policy
    // <meta> tag into every page, with hashes for the scripts and styles it renders.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        'upgrade-insecure-requests',
      ],
      styleDirective: {
        // Blog code blocks (Shiki) color syntax with inline style="" attributes. Allow those
        // attributes only; <style> elements and all scripts stay hash-restricted.
        resources: ["'self'", { resource: "'unsafe-inline'", kind: 'attribute' }],
      },
    },
  },
});
