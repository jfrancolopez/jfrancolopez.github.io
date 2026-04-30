// Set includeInPdf: false on any item to exclude it from the PDF.
// Items default to included if the flag is omitted.
// Set sections.<name> to false to skip an entire section in the PDF.

export const resume = {
  name: 'Franco Lopez',
  headline: 'Platform & DevOps Engineer · Kubernetes · GitOps · Cloud Infrastructure',
  pdfHeadline: 'Platform & DevOps Engineer',  // shorter, used only in PDF
  location: 'Raleigh-Durham, NC',
  availability: 'Open to remote and hybrid Platform, DevOps, SRE, and Cloud Infrastructure roles',
  languages: ['English', 'Spanish'],
  contact: {
    email: 'hello@jfrancolopez.com',
    linkedin: 'linkedin.com/in/jfranco-lopez',
    github: 'github.com/jfrancolopez',
  },

  // PDF section toggles — set to false to omit a whole section from the PDF.
  pdfSections: {
    summary: true,
    skills: true,
    experience: true,
    projects: true,
    educationAndCertifications: true,
    currentlyLearning: false,
    languages: false,
    companyContext: false,
    stackLines: false,
  },

  // Long version — used on the website.
  summary:
    'Platform and infrastructure engineer with 15+ years building and operating production systems. I design Kubernetes-hosted platforms, modernize cloud and identity infrastructure, and ship internal tooling that real users depend on. My current production work runs on a 3-node Kubernetes cluster serving 350+ dealers across North America. I started as a software engineer, spent the last decade building and leading the systems behind manufacturing and operations, and I am now focused full-time on hands-on platform and DevOps work. Currently completing the Certified Kubernetes Administrator exam (expected Aug 2026).',

  // Short version — used only in the PDF. Falls back to summary if omitted.
  pdfSummary:
    'Platform and infrastructure engineer with over 15 years across software, cloud, and operations. I design and run Kubernetes-hosted platforms, modernize identity and cloud infrastructure, and build internal tools used by hundreds of users. Bilingual in English/Spanish.',

  skills: [
    {
      label: 'Platform & Infrastructure',
      items: ['Kubernetes', 'Docker', 'Talos Linux', 'Linux', 'VMware', 'Hyper-V', 'Networking', 'Cisco', 'Fortinet' ],
    },
    {
      label: 'Cloud & Identity',
      items: ['Microsoft Azure', 'Linode', 'Cloudflare', 'Azure IaaS', 'Azure AD / Entra ID', 'MFA', 'Conditional Access'],
    },
    {
      label: 'DevOps & Automation',
      items: ['GitOps', 'Flux CD', 'GitHub Actions', 'CI/CD', 'Helm', 'Bash', 'Python', 'Automation'],
    },
    {
      label: 'Applications & Data',
      items: ['PostgreSQL', 'REST APIs', 'SQL', 'React', 'Microsoft 365'],
    },
  ],

  experience: [
    {
      company: 'LS Tractor USA',
      companyContext: 'North American operations of LS Mtron — a global tractor manufacturer (LS Group, Korea) sold in the US under both LS and New Holland Agriculture Tractors.',
      role: 'IT Manager — Platform & Infrastructure',
      location: 'Raleigh, NC',
      dates: 'Oct 2022 – Present',
      bullets: [
        { text: 'Designed, built, and operate Start Blue (startblue.lstractorusa.com) — a Kubernetes-hosted quote platform serving 350+ dealers across the US and Canada. 3-node cluster with two years in production with no major incidents; 2,000+ quotes processed.' },
        { text: 'Built the platform end-to-end: React + PostgreSQL application, container images, deployment workflows, backups, disaster recovery, and analytics on dealer engagement, regional demand, and product mix.' },
        { text: 'Building LS Academy — a Kubernetes-hosted learning platform projected for 500+ dealer users. Architecting on a GitOps pipeline with Argo CD and GitHub Actions, applying patterns proven in personal homelab work on Talos Linux and Flux CD.' },
        { text: 'Built and shipped recruitment.lstractorusa.com — the corporate dealer recruitment site. Owned design, build, deployment, and DNS/TLS configuration on a corporate subdomain.' },
        { text: 'Led full migration from on-prem Active Directory to Azure AD / Entra ID for 200+ users: hybrid identity via Azure AD Connect, MFA, Conditional Access policies, GPO modernization, and corporate NAS-to-OneDrive transition.' },
        { text: 'Designed and deployed end-to-end infrastructure for two new manufacturing sites in Texas and North Carolina from ground up — networking, compute, security, identity, and secure remote access.' },
        { text: 'Build and mentor a cross-functional engineering team across infrastructure, applications, and security.', includeInPdf: false },
      ],
      stack: ['Kubernetes', 'Linode', 'Azure', 'Docker', 'GitHub Actions', 'React', 'PostgreSQL', 'Fortinet', 'Cloudflare'],
    },
    {
      company: 'Interamerican Foods Corp. / La Moderna USA',
      companyContext: 'US arm of Grupo La Moderna — the leading pasta brand in Mexico and one of the largest pasta manufacturers in Latin America. Flagship US plant produces private-label pasta for Walmart (Great Value), Campbell\'s, and Goya.',
      role: 'IT Manager — Infrastructure & Cloud',
      location: 'Cleburne, TX',
      dates: 'Jun 2017 – Oct 2022',
      bullets: [
        { text: 'Stood up the entire IT and infrastructure stack for a 24/7 automated manufacturing facility from greenfield — networking, compute, storage, identity, and OT/IT integration.' },
        { text: 'Designed and deployed the company\'s US web platform (lamodernausa.com) on Azure IaaS, including DNS, TLS, and supporting infrastructure.' },
        { text: 'Built and implemented a multi-tier cloud backup and disaster recovery system to protect multiple 24/7 production and packaging line servers, with automated validation and failover testing, reducing recovery time from over 1 hour to under 10 minutes.' },
        { text: 'Hardened the perimeter with next-gen firewalls, Cloudflare DNS/WAF, WireGuard VPN, and network segmentation across distributed sites.' },
        { text: 'Led Cisco Meraki rollout (networking, wireless, security cameras) across all US locations with zero production downtime.' },
        { text: 'Rolled out FreshService ITSM across 27 sites in the US, Mexico, and Guatemala — 2,500+ users, with SLA tracking and automated workflows.', includeInPdf: false },
      ],
      stack: ['Azure', 'VMware', 'HPE SimpliVity', 'Cisco Meraki', 'Fortinet', 'Cloudflare', 'WireGuard', 'Microsoft 365', 'FreshService'],
    },
    {
      company: 'SR Traffic Service Inc.',
      companyContext: 'Cross-border logistics operator running four distribution facilities between the US and Mexico.',
      role: 'Software Engineer',
      location: 'Laredo, TX',
      dates: 'Jan 2010 – Jun 2017',
      bullets: [
        { text: 'Built a Warehouse Management System from scratch — barcode generation, handheld scanner integration, mobile and desktop clients, real-time inventory, customs documentation, and client-facing reporting. Served 20+ international clients across 4 facilities.' },
        { text: 'Designed REST APIs and SQL-backed workflows powering inventory, dispatch, customs paperwork, and customer portals.' },
        { text: 'Automated build, test, and deployment processes; migrated workloads to cloud infrastructure for scalability and cost control.' },
        { text: 'Ran regular security audits and led remediation work across business-critical systems.', includeInPdf: false },
      ],
      stack: ['JavaScript', 'PHP', 'SQL', 'REST APIs', 'BASH', 'Filemaker Claris', 'Cloud Infrastructure', 'CI/CD Foundations'],
    },
  ],

  projects: [
    {
      name: 'Start Blue — Production Quote Platform',
      url: 'startblue.lstractorusa.com',
      description:
        '3-node Kubernetes cluster serving 350+ dealers across the US and Canada. Built the React + PostgreSQL application end-to-end and operate the cluster, deployment workflows, backups, and DR. Two years in production with no major incidents; 2,000+ quotes processed; ~$216/month operating cost — a deliberate cost-vs-managed-services tradeoff for the workload size.',
      stack: ['Kubernetes', 'Linode', 'React', 'PostgreSQL', 'Docker', 'GitHub Actions'],
    },
    {
      name: 'LS Academy — Learning Platform (in progress)',
      description:
        'Kubernetes-hosted learning platform for 500+ users. Architecting on a GitOps pipeline with Argo CD and GitHub Actions, applying patterns proven in personal homelab work on Talos Linux and Flux CD.',
      stack: ['Kubernetes', 'Argo CD', 'GitHub Actions', 'GitOps'],
    },
    {
      name: 'Domum — GitOps Homelab',
      url: 'github.com/jfrancolopez/Domum',
      description:
        'GitOps-driven Kubernetes homelab on Talos Linux with Flux CD. Demonstrates declarative service deployment, automated reconciliation, and modern DevOps patterns end-to-end. The reference architecture I am applying to LS Academy.',
      stack: ['Kubernetes', 'Talos Linux', 'Flux CD', 'GitOps', 'Helm'],
    },
    {
      name: 'Domum-core — Self-Updating Home Services Platform',
      url: 'github.com/jfrancolopez/domum-core',
      description:
        'One-command, self-managing services platform for Raspberry Pi or any Debian/Ubuntu host. Curl-installs Docker, clones the repo, initializes the host, and applies desired state. GitOps philosophy applied to single-host environments.',
      stack: ['Docker', 'Bash', 'GitOps', 'Linux'],
      includeInPdf: false,

    },
    {
      name: 'LibrAIry — AI-Powered File Organization',
      url: 'github.com/jfrancolopez/LibrAIry',
      description:
        'Bash pipeline combining local AI model analysis, metadata fingerprinting, and structured move-planning to automate large-scale file reorganization. Practical experiment in integrating local AI models into infrastructure tooling, running from a docker container.',
      stack: ['Bash', 'Local AI Models', 'Linux'],
      includeInPdf: false,
    },
    {
      name: 'LS Tractor Dealer Recruitment Site',
      url: 'recruitment.lstractorusa.com',
      description:
        'Corporate recruitment funnel for prospective LS Tractor dealers. Owned design, frontend build, deployment, DNS, and TLS on a corporate subdomain.',
      stack: ['HTML/CSS/JS', 'DNS/TLS', 'Subdomain Provisioning'],
      includeInPdf: false,
    },
    {
      name: 'Azure AD / Entra ID Migration',
      description:
        'Migrated 200+ users from on-prem Active Directory to Entra ID. Hybrid identity via Azure AD Connect, MFA, Conditional Access, GPO modernization, and NAS-to-OneDrive transition.',
      stack: ['Azure AD / Entra ID', 'Azure AD Connect', 'Microsoft 365', 'PowerShell'],
      includeInPdf: false,
    },
  ],

  educationAndCertifications: [
    {
      title: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'The Linux Foundation',
      status: 'In progress · expected Aug 2026',
    },
    {
      title: 'B.S. Computer Systems Engineering',
      issuer: 'Universidad del Valle de México',
      status: '2005 – 2010',
    },
    {
      title: 'Microsoft Azure Fundamentals (AZ-900)',
      issuer: 'Microsoft',
      status: 'Mar 2022',
    },
    {
      title: 'Engineering Cisco Meraki Solutions',
      issuer: 'Cisco Meraki',
      status: 'Sep 2021',

    },
    {
      title: 'HPE SimpliVity 380 System Administration (VMware)',
      issuer: 'HPE',
      status: 'Apr 2019',

    },
  ],

  currentlyLearning: [
    'Certified Kubernetes Administrator (CKA) — exam Aug 2026',
    'Argo CD and advanced GitOps patterns (deploying with LS Academy)',
    'Terraform and Infrastructure as Code (next, post-CKA)',
    'Go Programming Language (for building Kubernetes tooling and automation) (on the roadmap)',
    'Building with AI developer tools (Claude Code, MCP, agentic workflows) for infrastructure automation and documentation',
  ],
};
