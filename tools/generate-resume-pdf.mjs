// Builds the downloadable general resume from src/data/resume.js.
//
//   npm run resume:pdf
//
// Writes tools/FrancoLopez-Resume.html (generated; don't edit by hand) and
// public/FrancoLopez-Resume.pdf, rendered with Chromium through Playwright.
// First run on a new machine: npx playwright install chromium
//
// Layout and typography follow the October 2026 resume package: Inter, navy accent,
// grouped skills, company context lines, two pages.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { resume } from '../src/data/resume.js';

const htmlPath = fileURLToPath(new URL('./FrancoLopez-Resume.html', import.meta.url));
const pdfPath = fileURLToPath(new URL('../public/FrancoLopez-Resume.pdf', import.meta.url));
const MAX_PAGES = 2;

// ---------- Helpers ----------

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

// Applicant tracking systems can read a hyphenated word split across two lines as one
// word ("go-live" → "golive"), so hyphenated and slashed terms never wrap.
const KEEP_TOGETHER = ['Palestine, TX', 'Battleboro, NC', 'Power Apps', 'Power Automate', 'Entra ID', 'Flux CD', 'Argo CD', 'GitHub Actions'];
const text = (value) => {
  let out = escapeHtml(value).replace(/[\w.+$]+(?:[-/][\w.+$]+)+/g, (m) => `<span class="nw">${m}</span>`);
  for (const phrase of KEEP_TOGETHER) {
    out = out.replaceAll(escapeHtml(phrase), `<span class="nw">${escapeHtml(phrase)}</span>`);
  }
  return out;
};

const sections = resume.pdfSections || {};
const include = (key, fallback = true) => (sections[key] === undefined ? fallback : sections[key] !== false);
const isIncluded = (item) => typeof item === 'string' || item?.includeInPdf !== false;
const bulletText = (b) => (typeof b === 'string' ? b : b.text);

// Static Inter weights (not the variable font): Chromium embeds static fonts as real
// TrueType text, which applicant tracking systems parse more reliably than Type 3 glyphs.
const fontFaces = [
  [400, 'normal'],
  [600, 'normal'],
  [700, 'normal'],
  [400, 'italic'],
]
  .map(
    ([weight, style]) =>
      `  @font-face { font-family: "Inter"; font-style: ${style}; font-weight: ${weight}; font-display: block;
    src: url("../node_modules/@fontsource/inter/files/inter-latin-${weight}-${style}.woff2") format("woff2"),
         url("../node_modules/@fontsource/inter/files/inter-latin-ext-${weight}-${style}.woff2") format("woff2"); }`
  )
  .join('\n');

// ---------- HTML ----------

const renderHtml = (r) => {
  const contact = [r.location, r.contact.email, r.contact.linkedin, r.contact.github, r.contact.website];

  const skills = r.skills
    .filter(isIncluded)
    .map((s) => `<dt>${text(s.label)}</dt><dd>${text(s.items.join(', '))}</dd>`)
    .join('\n');

  const jobs = r.experience
    .filter(isIncluded)
    .map((job) => {
      const bullets = job.bullets.filter(isIncluded).map((b) => `<li>${text(bulletText(b))}</li>`).join('\n');
      const role = text(job.role) + (job.scope ? ` (${text(job.scope)})` : '');
      return `
<section class="job">
  <div class="job-head"><span class="company">${text(job.company)}</span><span class="dates">${text(job.dates)}</span></div>
  <div class="role"><span>${role}</span><span class="loc">${text(job.location)}</span></div>
  ${job.companyContext ? `<div class="context">${text(job.companyContext)}</div>` : ''}
  <ul>${bullets}</ul>
</section>`;
    })
    .join('');

  const projects = include('projects', false)
    ? `<h2>Projects</h2><ul class="edu">${r.projects
        .filter(isIncluded)
        .map((p) => `<li><strong>${text(p.name)}</strong> — ${text(p.description)}</li>`)
        .join('')}</ul>`
    : '';

  const certs = r.certifications
    .filter(isIncluded)
    .map((c) => `<li>${text(c.title)} — ${text(c.issuer)}, ${text(c.date)}</li>`)
    .join('\n');

  const education = r.education
    .map((e) => `<p class="line"><span class="lbl">${text(e.title)}</span> — ${text(e.issuer)}, ${text(e.date)}</p>`)
    .join('');

  // Off by default: the tagline and summary already say bilingual English/Spanish.
  const languages = include('languages', false)
    ? `<p class="line"><span class="lbl">Languages:</span> ${text(r.languages)}</p>`
    : '';

  const learning =
    include('currentlyLearning') && r.pdfLearning
      ? `<p class="line"><span class="lbl">Currently learning:</span> ${text(r.pdfLearning)}</p>`
      : '';

  return `<!doctype html>
<!-- Generated from src/data/resume.js by tools/generate-resume-pdf.mjs. Do not edit by hand. -->
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(r.name)} — Resume</title>
<meta name="author" content="${escapeHtml(r.name)}">
<meta name="description" content="${escapeHtml(r.headline)}">
<style>
${fontFaces}

  @page { size: Letter; }
  :root { --ink: #1b1f24; --muted: #5b6573; --accent: #1f3a5f; --rule: #c9d1db; }
  * { box-sizing: border-box; }
  html { font-family: "Inter", "Helvetica Neue", Arial, sans-serif; color: var(--ink); font-size: 9.5pt; line-height: 1.36; }
  body { margin: 0; }

  header { padding-bottom: 8pt; border-bottom: 2pt solid var(--accent); margin-bottom: 9pt; }
  h1 { font-weight: 700; font-size: 25pt; letter-spacing: 0.5pt; margin: 0; line-height: 1.05; color: var(--ink); }
  .headline { font-weight: 600; font-size: 11.5pt; color: var(--accent); margin-top: 4pt; }
  .tagline { font-size: 9pt; color: var(--muted); margin-top: 2pt; }
  .contact { font-size: 8.5pt; color: var(--ink); margin-top: 6pt; }
  .contact span { white-space: nowrap; }
  .contact span + span::before { content: "·"; color: var(--rule); margin: 0 4.5pt; }

  h2 { font-size: 8.6pt; font-weight: 700; letter-spacing: 0.6pt; text-transform: uppercase; color: var(--accent);
       margin: 11pt 0 5pt; padding-bottom: 2.5pt; border-bottom: 0.75pt solid var(--rule); break-after: avoid; }

  .summary { margin: 0; }

  dl.skills { display: grid; grid-template-columns: 1.45in 1fr; column-gap: 10pt; row-gap: 2pt; margin: 0; }
  dl.skills dt { font-weight: 600; color: var(--ink); }
  dl.skills dd { margin: 0; color: #2b313a; }

  .job { margin-top: 8pt; }
  .job:first-of-type { margin-top: 2pt; }
  .job-head { display: flex; justify-content: space-between; align-items: baseline; break-after: avoid; }
  .company { font-weight: 700; font-size: 10.4pt; }
  .dates { font-size: 8.8pt; color: var(--muted); white-space: nowrap; }
  .role { display: flex; justify-content: space-between; align-items: baseline; font-weight: 600; color: var(--accent); font-size: 9.6pt; break-after: avoid; }
  .role .loc { font-weight: 400; color: var(--muted); font-size: 8.8pt; }
  .context { font-style: italic; color: var(--muted); font-size: 9pt; margin: 2pt 0 4pt; break-after: avoid; }

  ul { margin: 0; padding-left: 12pt; }
  li { margin: 0 0 2.2pt; padding-left: 1pt; break-inside: avoid; }
  li::marker { color: var(--accent); }
  .edu li { margin-bottom: 1.5pt; }
  .certs { margin: 3pt 0; }
  .line { margin: 0; }
  .line + .line { margin-top: 2pt; }
  .lbl { font-weight: 600; }
  .nw { white-space: nowrap; }
</style>
</head>
<body>
<header>
  <h1>${text(r.name.toUpperCase())}</h1>
  <div class="headline">${text(r.headline)}</div>
  <div class="tagline">${text(r.tagline)}</div>
  <div class="contact">${contact.map((c) => `<span>${escapeHtml(c)}</span>`).join('')}</div>
</header>

<h2>Summary</h2>
<p class="summary">${text(r.summary)}</p>

<h2>Skills</h2>
<dl class="skills">${skills}</dl>

<h2>Experience</h2>
${jobs}

${projects}

<h2>Education &amp; Certifications</h2>
${education}
<ul class="edu certs">${certs}</ul>
${learning}
${languages}
</body>
</html>
`;
};

// ---------- Render ----------

writeFileSync(htmlPath, renderHtml(resume));

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const missingFont = await page.evaluate(() => !document.fonts.check('9.6pt Inter'));
  if (missingFont) throw new Error('Inter did not load. Run npm install, then try again.');

  await page.pdf({
    path: pdfPath,
    format: 'Letter',
    printBackground: true,
    margin: { top: '0.5in', right: '0.55in', bottom: '0.55in', left: '0.55in' },
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: `<div style="width:100%; padding: 0 0.55in; text-align:right; font-family: Helvetica, Arial, sans-serif; font-size:7.5pt; color:#8a94a3;">${escapeHtml(resume.name)} &nbsp;·&nbsp; <span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
  });
} finally {
  await browser.close();
}

// Count pages without extra dependencies: each page object in the PDF has /Type /Page.
const pages = (readFileSync(pdfPath, 'latin1').match(/\/Type\s*\/Page(?!s)/g) || []).length;
if (pages > MAX_PAGES) {
  throw new Error(`Resume PDF must fit on ${MAX_PAGES} pages, but generated ${pages}. Trim src/data/resume.js.`);
}
console.log(`PDF written to public/FrancoLopez-Resume.pdf (${pages} pages).`);
