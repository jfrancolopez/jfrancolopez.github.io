import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const root = resolve('dist');
const contentTypes = {
  '.css': 'text/css',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
};

const server = createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  let filePath = resolve(root, `.${pathname}`);

  if (filePath !== root && !filePath.startsWith(`${root}${sep}`)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  if (pathname.endsWith('/')) filePath = join(filePath, 'index.html');

  try {
    response.setHeader('content-type', contentTypes[extname(filePath)] || 'application/octet-stream');
    response.end(readFileSync(filePath));
  } catch {
    response.writeHead(404).end('Not found');
  }
});

await new Promise((done) => server.listen(0, '127.0.0.1', done));
const address = server.address();
assert.ok(address && typeof address !== 'string');
const origin = `http://127.0.0.1:${address.port}`;
let browser;

try {
  browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto(`${origin}/`);
  assert.equal(await page.title(), 'Franco Lopez | Personal Technology Notebook');
  assert.equal(await page.locator('a[href="/projects/"]').first().textContent(), 'Projects');

  await page.locator('[data-theme-toggle]').click();
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  assert.equal(await page.locator('[data-theme-toggle]').getAttribute('aria-label'), 'Switch to light mode');

  await page.goto(`${origin}/blog/?group=All&tag=All`);
  assert.equal(await page.locator('[data-all-post-list]').isVisible(), true);
  assert.equal(await page.locator('[data-post-list]').isHidden(), true);
  assert.ok(await page.locator('[data-all-post-list] .post-card:visible').count() > 0);
  assert.ok(await page.locator('[data-all-post-list] h2').count() > 0);
  assert.ok(Number.parseFloat(await page.locator('.post-card time').first().evaluate((node) => getComputedStyle(node).fontSize)) < 14);

  await page.locator('.tag-filter-details summary').click();
  await page.locator('[data-tag-filter]').filter({ hasText: /^linux$/i }).click();
  assert.ok(await page.locator('[data-all-post-list] .post-card:visible').count() > 0);
  await page.locator('[data-tag-filter="all"]').click();

  await page.locator('[data-group-filter="linux"]').click();
  assert.equal(await page.locator('[data-all-post-list]').isHidden(), true);
  assert.equal(await page.locator('[data-note-group="linux"]').isVisible(), true);
  assert.ok(await page.locator('[data-note-group="linux"] [data-grouped-card]:visible').count() > 0);

  await page.locator('[data-notes-search]').fill('no-note-can-match-this-query');
  assert.equal(await page.locator('[data-empty-state]').isVisible(), true);
  await page.locator('[data-notes-search]').fill('');
  assert.equal(await page.locator('[data-empty-state]').isHidden(), true);

  await page.goto(`${origin}/blog/es/dev/cheatsheet-sql/`);
  assert.equal(await page.locator('html').getAttribute('lang'), 'es');
  assert.equal(await page.locator('.site-header').getAttribute('lang'), 'en');
  assert.equal(await page.locator('.site-footer').getAttribute('lang'), 'en');
  assert.equal(await page.locator('.article-tags').getAttribute('aria-label'), 'Etiquetas');
  assert.ok(await page.locator('pre.language-sql .token').count() > 0);

  await page.goto(`${origin}/resume/`);
  assert.ok((await page.locator('h1').textContent()).includes('Platform & DevOps Engineer'));
  assert.equal(await page.evaluate(() => fetch('/FrancoLopez-Resume.pdf').then((response) => response.status)), 200);
  assert.deepEqual(errors, []);

  const mobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
  for (const route of ['/', '/blog/', '/projects/', '/resume/']) {
    const response = await mobile.goto(`${origin}${route}`);
    assert.ok(response?.ok(), `Failed to load ${route}`);
    assert.ok(
      await mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      `Horizontal overflow on ${route}`,
    );
  }

  const cspPage = await browser.newPage();
  await cspPage.goto(`${origin}/`);
  try {
    await cspPage.addScriptTag({ content: 'window.__cspProbe = true' });
  } catch {
    // A rejected addScriptTag call is expected when CSP blocks the probe.
  }
  assert.equal(await cspPage.evaluate(() => window.__cspProbe), undefined);

  console.log('Site verification passed: CSP, filters, theme, Prism, language, PDF, and mobile layout.');
} finally {
  await browser?.close();
  await new Promise((done) => server.close(done));
}
