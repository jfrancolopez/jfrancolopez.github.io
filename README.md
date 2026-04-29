# jfrancolopez.com

Personal site for Franco Lopez, built with Astro and deployed to GitHub Pages.

## Local Development

Install dependencies once:

```sh
npm install
```

Start the dev server:

```sh
npm run dev
```

Build the production site:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

## Site Structure

- `src/pages/index.astro`: homepage
- `src/pages/projects/`: project index and project detail pages
- `src/pages/blog/`: writing index and blog post route
- `src/content/blog/`: Markdown blog posts
- `src/data/resume.js`: single source of truth for resume content
- `src/pages/resume/index.astro`: web resume rendered from resume data
- `tools/generate-resume-pdf.mjs`: generates resume HTML and PDF from resume data
- `tools/FrancoLopez-Resume.html`: generated resume HTML artifact
- `public/FrancoLopez-Resume.pdf`: downloadable resume

## Updating The Blog

Create a Markdown file under `src/content/blog/`. Use folders for categories:

```text
src/content/blog/kubernetes/my-new-post.md
src/content/blog/linux/my-linux-note.md
```

Use this frontmatter:

```md
---
title: "My Post Title"
date: "2026-04-29"
description: "One sentence summary for the writing page."
tags: ["Kubernetes", "Automation"]
draft: false
---
```

Write the post below the frontmatter. Set `draft: true` to hide it from the site.

## Updating Projects

Project pages are regular Astro files in `src/pages/projects/`.

To add a new project:

1. Create `src/pages/projects/project-name.astro`.
2. Add the project card to `src/pages/projects/index.astro`.
3. Add it to the homepage project list in `src/pages/index.astro` if it is important enough for recruiters.

Keep project pages structured around:

- Problem
- What I built
- Architecture
- Operational concerns
- Impact
- What I would improve next

## Updating The Resume

Edit:

```text
src/data/resume.js
```

The web resume reads from that file automatically. Regenerate the downloadable PDF with:

```sh
npm run resume:pdf
```

Do not edit `tools/FrancoLopez-Resume.html` by hand; it is generated from `src/data/resume.js`.

Run `npm run build` before pushing.
