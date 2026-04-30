import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resume } from '../src/data/resume.js';

const htmlPath = 'tools/FrancoLopez-Resume.html';
const pdfPath = 'public/FrancoLopez-Resume.pdf';

// ---------- Helpers ----------

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const sections = resume.pdfSections || {};
const include = (key, fallback = true) =>
  sections[key] === undefined ? fallback : sections[key] !== false;

const isIncluded = (item) => item?.includeInPdf !== false;
const bulletText = (b) => (typeof b === 'string' ? b : b.text);
const pdfText = (value, fallback = '') => value || fallback;

const getPdfBullets = (job) =>
  (job.pdfBullets || job.bullets || [])
    .filter(isIncluded)
    .map(bulletText);

const getPdfResume = () => ({
  ...resume,
  pdfSummary: resume.pdfSummary || resume.summary,
  skills: resume.skills.filter(isIncluded),
  experience: resume.experience.filter(isIncluded).map((job) => ({
    ...job,
    bullets: getPdfBullets(job),
  })),
  projects: resume.projects.filter(isIncluded).map((project) => ({
    ...project,
    description: pdfText(project.pdfDescription, project.description),
  })),
  educationAndCertifications: resume.educationAndCertifications.filter(isIncluded),
});

const getPdfPageCount = () => {
  const output = execFileSync('pdfinfo', [pdfPath], { encoding: 'utf8' });
  const match = output.match(/^Pages:\s+(\d+)/m);
  return match ? Number(match[1]) : Number.NaN;
};

const renderHtml = (data) => {
  // ---------- Build content blocks ----------

  const skillsBlock = include('skills')
    ? `<div class="skills-grid">${data.skills
      .map(
        (skill) =>
          `<div class="skill-cell"><span class="skill-label">${escapeHtml(skill.label)}</span><span class="skill-items">${escapeHtml(skill.items.join(' · '))}</span></div>`
      )
      .join('')}</div>`
    : '';

  const experienceBlock = include('experience')
    ? data.experience
      .map((job) => {
        const bullets = job.bullets
          .map((b) => `<li>${escapeHtml(b)}</li>`)
          .join('');
        const contextLine =
          include('companyContext', false) && job.companyContext
            ? `<p class="company-context">${escapeHtml(job.companyContext)}</p>`
            : '';
        const stackLine =
          include('stackLines', false) && job.stack
            ? `<p class="stack-line"><span class="meta-label">Stack:</span> ${escapeHtml(job.stack.join(' · '))}</p>`
            : '';
        return `
    <div class="job">
      <div class="job-header">
        <div class="job-title-line">
          <span class="job-company">${escapeHtml(job.company)}</span>
          <span class="job-sep"> — </span>
          <span class="job-role">${escapeHtml(job.role)}</span>
          <span class="job-loc"> · ${escapeHtml(job.location)}</span>
        </div>
        <span class="job-dates">${escapeHtml(job.dates)}</span>
      </div>
      ${contextLine}
      <ul>${bullets}</ul>
      ${stackLine}
    </div>`;
      })
      .join('<hr class="job-divider" />')
    : '';

  const projectsBlock = include('projects')
    ? data.projects
      .map(
        (p) => `
    <div class="project">
      <p class="project-title"><span class="project-name">${escapeHtml(p.name)}</span>${p.url ? ` <span class="project-url">${escapeHtml(p.url)}</span>` : ''
          }</p>
      <p class="project-desc">${escapeHtml(p.description)}</p>
    </div>`
      )
      .join('')
    : '';

  const certsBlock = include('educationAndCertifications')
    ? data.educationAndCertifications
      .map(
        (c) =>
          `<li><span class="cert-title">${escapeHtml(c.title)}</span> — ${escapeHtml(c.issuer)} <span class="cert-status">(${escapeHtml(c.status)})</span></li>`
      )
      .join('')
    : '';

  const learningBlock = include('currentlyLearning', false)
    ? data.currentlyLearning
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join('')
    : '';

  const summaryText = data.pdfSummary || data.summary;
  const summaryBlock = include('summary')
    ? `<p class="summary">${escapeHtml(summaryText)}</p>`
    : '';

  const headlineText = data.pdfHeadline || data.headline;

  const contactPieces = [
    data.location,
    data.contact.email,
    data.contact.linkedin,
    data.contact.github,
  ];
  if (include('languages', false)) {
    contactPieces.push(data.languages.join(' / '));
  }
  const contactLine = contactPieces.join('  ·  ');

  // ---------- HTML ----------

  return `<!doctype html>
<!-- Generated from src/data/resume.js. Do not edit by hand. -->
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(data.name)} — Resume</title>
    <style>
      @page { size: Letter; margin: 0.34in 0.45in; }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        color: #1a1a1a;
        font-family: "Calibri", "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 8.63pt;
        line-height: 1.18;
      }

      h1, h2, h3, p, ul { margin: 0; padding: 0; }
      ul { list-style: disc; padding-left: 12.5pt; }
      li { margin-bottom: 0.35pt; }

      /* ===== HEADER ===== */
      .header {
        padding-bottom: 4pt;
        border-bottom: 1.2pt solid #1a1a1a;
        margin-bottom: 6pt;
      }
      .name {
        font-size: 20pt;
        font-weight: 700;
        letter-spacing: -0.4px;
        line-height: 1.05;
      }
      .headline {
        margin-top: 1pt;
        font-size: 9pt;
        font-weight: 500;
        color: #444;
      }
      .contact-line {
        margin-top: 3pt;
        color: #555;
        font-size: 8.2pt;
      }

      /* ===== SECTIONS ===== */
      h2 {
        
        margin-top: 4pt;
        margin-bottom: 3pt;
        padding-top: 3pt;
        border-bottom: 1pt solid #d8d8d8;
        color: #1a1a1a;
        font-size: 9pt;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.75px;
      }

      .summary + h2 {
        margin-top: 4pt;
      }

      /* ===== SKILLS GRID ===== */
      .skills-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 18pt;
        row-gap: 3pt;
        margin-top: 2pt;
      }

      .skill-cell {
        min-width: 0;
      }

      .skill-label {
        display: block;
        font-weight: 700;
        font-size: 8.6pt;
        margin-bottom: 0.5pt;

      }

      .skill-items {
        display: block;
        color: #333;
        padding-left: 6pt;
        font-size: 8.3pt;
        line-height: 1.18;
        margin-bottom: 2pt;
      }

      /* ===== EXPERIENCE ===== */
      .job {
        margin-top: 2.8pt;
      }
      .job:first-of-type { margin-top: 1pt; }

      .job-divider {
        display: none;
      }

      .job-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 12pt;
      }
      .job-title-line {
        font-size: 9.2pt;
      }
      .job-company {
        font-weight: 700;
        color: #1a1a1a;
      }
      .job-sep {
        color: #1a1a1a;
        font-weight: 700;
      }
      .job-role {
        font-weight: 600;
        color: #333;
      }
      .job-loc {
        color: #666;
        font-style: italic;
        font-weight: 400;
        font-size: 8.2pt;
      }
      .job-dates {
        white-space: nowrap;
        color: #555;
        font-size: 8.2pt;
        font-variant-numeric: tabular-nums;
      }
      .company-context {
        margin-top: 1pt;
        color: #555;
        font-size: 8.8pt;
      }
      .job ul { margin-top: 1pt; }

      /* ===== PROJECTS ===== */
      .project {
        margin-top: 2.2pt;
        padding-top: 2.2pt;
        border-top: 0.35pt solid #e1e1e1;
      }
      .project:first-of-type {
        margin-top: 2pt;
        padding-top: 0;
        border-top: none;
      }
      .project-title { font-size: 9.8pt; }
      .project-desc { font-size: 8.7pt; }
      .project-name { font-weight: 700; }
      .project-url {
        color: #666;
        font-size: 8.5pt;
        font-weight: 400;
      }
      .project-desc {
        margin-top: 1pt;
        padding-left: 6pt;
        color: #1a1a1a;
      }

      /* ===== CERTS ===== */
      .cert-title { font-weight: 400; }
      .cert-status {
        color: #555;
        font-size: 7pt;
      }

      /* ===== OPTIONAL ===== */
      .stack-line {
        margin-top: 2pt;
        color: #555;
        font-size: 9pt;
      }
      .meta-label { font-weight: 700; color: #333; }

      /* ===== PAGE BREAKS ===== */
      .job, .project { break-inside: avoid; }
      .generation-note { display: none; }
    </style>
  </head>
  <body>
    <div class="header">
      <p class="name">${escapeHtml(data.name)}</p>
      <p class="headline">${escapeHtml(headlineText)}</p>
      <p class="contact-line">${escapeHtml(contactLine)}</p>
      
    </div>

    ${summaryBlock}

    ${skillsBlock
      ? `<h2>Core Stack</h2>
    ${skillsBlock}`
      : ''
    }

    ${experienceBlock
      ? `<h2>Experience</h2>
    ${experienceBlock}`
      : ''
    }

    ${projectsBlock
      ? `<h2>Projects</h2>
    ${projectsBlock}`
      : ''
    }

    ${certsBlock
      ? `<h2>Education &amp; Certifications</h2>
    <ul>${certsBlock}</ul>`
      : ''
    }

    ${learningBlock
      ? `<h2>Currently Learning</h2>
    <ul>${learningBlock}</ul>`
      : ''
    }
  </body>
</html>
`;
};


const pdfResume = getPdfResume();

writeFileSync(htmlPath, renderHtml(pdfResume));

execFileSync(
  'wkhtmltopdf',
  [
    '--enable-local-file-access',
    '--page-size', 'Letter',
    '--margin-top', '7.6mm',
    '--margin-bottom', '7.6mm',
    '--margin-left', '11.5mm',
    '--margin-right', '11.5mm',
    '--print-media-type',
    '--disable-smart-shrinking',
    htmlPath,
    pdfPath,
  ],
  { stdio: 'inherit' }
);

const finalPages = getPdfPageCount();
if (finalPages !== 1) {
  throw new Error(`Resume PDF must fit on one page, but generated ${finalPages} pages.`);
}

console.log(`PDF written to ${pdfPath}.`);