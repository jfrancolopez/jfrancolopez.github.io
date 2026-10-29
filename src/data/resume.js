// Single source of truth for the general resume.
// The web page (src/pages/resume/index.astro) and the downloadable PDF
// (npm run resume:pdf → public/FrancoLopez-Resume.pdf) both render from this file,
// so the site and the PDF always say the same thing.
//
// Wording follows the October 2026 resume package (IT Infrastructure & Operations,
// DevOps & Platform, Solutions Engineer, SRE), merged into one general version.
//
// Set includeInPdf: false on a project or bullet to keep it on the website only.
// Set pdfSections.<name> to false to leave a whole section out of the PDF.

export const resume = {
  name: 'Franco Lopez',
  headline: 'Platform & DevOps Engineer | IT Infrastructure & Operations Leader',
  tagline:
    'Kubernetes · CI/CD · Azure · Networking · Manufacturing & Plant IT · Solutions Engineering · Bilingual EN/ES',
  location: 'Raleigh–Durham, NC',
  availability:
    'Open to Platform, DevOps, SRE, Solutions Engineering, and IT Infrastructure & Operations roles · remote or hybrid',
  languages: 'English and Spanish, fully bilingual',
  contact: {
    email: 'hello@jfrancolopez.com',
    linkedin: 'linkedin.com/in/jfranco-lopez',
    github: 'github.com/jfrancolopez',
    website: 'jfrancolopez.com',
  },

  pdfSections: {
    projects: false, // projects are covered in the experience bullets; website only
    currentlyLearning: true,
    languages: false, // already in the tagline and summary; the website shows it
  },

  summary:
    "Platform engineer and IT leader with 15+ years across software development, infrastructure, and 24/7 production operations. As Head of IT for LS Tractor's U.S. and Canada division, designed, built, and operate the company's official tractor quoting platform on Kubernetes, in production for over two years without a major incident. Built IT for three new manufacturing plants, including an $80M automated facility, and cut production-line recovery time from over 60 minutes to under 10. Bilingual in English and Spanish, pursuing the CKA, and recipient of the 2025 CEO Award for Employee of the Year.",

  skills: [
    { label: 'Containers', items: ['Kubernetes (Linode LKE, Talos Linux)', 'Docker', 'Helm', 'Traefik', 'cert-manager'] },
    { label: 'CI/CD & GitOps', items: ['GitHub Actions', 'Flux CD', 'Argo CD', 'Ansible', 'SOPS secrets management', 'infrastructure as code (Helm, Kubernetes manifests)'] },
    { label: 'Cloud & identity', items: ['Microsoft Azure (IaaS, Entra ID, Conditional Access, MFA)', 'Active Directory', 'Microsoft 365', 'Google Cloud', 'Linode/Akamai', 'Cloudflare'] },
    { label: 'Infrastructure & OT', items: ['Linux', 'Windows Server', 'VMware vSphere', 'HPE SimpliVity', 'Hyper-V', 'Proxmox', 'IT/OT integration', 'production-line systems', 'video surveillance'] },
    { label: 'Network & security', items: ['Fortinet firewalls', 'Cisco', 'Cisco Meraki', 'site-to-site VPN', 'WireGuard', 'IDS', 'VLAN segmentation', 'Cloudflare DNS/WAF', 'TCP/IP', 'DNS', 'TLS'] },
    { label: 'Reliability (SRE)', items: ['Backup and disaster recovery (restic)', 'failover testing', 'DR drills', 'incident response', 'on-call', '24/7 production support'] },
    { label: 'Programming & automation', items: ['Python', 'Django', 'Bash', 'PowerShell', 'JavaScript', 'React', 'SQL', 'PostgreSQL', 'PHP', 'REST APIs', 'Power Automate', 'local LLMs', 'Claude Code'] },
    { label: 'Delivery & leadership', items: ['Solution design', 'technical presentations', 'Freshservice ITSM', 'SLA design', 'vendor management', 'IT roadmaps', 'team leadership'] },
  ],

  experience: [
    {
      company: 'LS Tractor USA',
      companyContext:
        'North American division of LS Mtron (LS Group, South Korea), with 6 U.S. sites, 200+ employees, and 350+ dealerships across the U.S. and Canada.',
      role: 'IT Manager',
      scope: 'Head of IT, U.S. & Canada',
      location: 'Raleigh, NC',
      dates: 'Oct 2022 – Present',
      bullets: [
        "Designed, built, and operate Start Blue, LS Tractor's official tractor quoting platform for the U.S. and Canada. Anyone can configure a tractor and get a quote in a few clicks, and 350+ dealerships use secure accounts to save quotes and apply their own pricing; 3,000+ quotes generated.",
        'Run the platform on a three-node Kubernetes cluster (React, Django, PostgreSQL) delivered through GitOps: GitHub Actions builds images, Flux CD reconciles the cluster from Git, SOPS encrypts secrets, and Traefik and cert-manager handle ingress and automated TLS. In production for over two years without a major incident.',
        'Presented Start Blue at LS Mtron headquarters in South Korea, including to the Global CEO; now adapting it with engineering teams there for multiple languages and global markets.',
        'Designed backup and disaster recovery for production platforms and company data, with automated restic backups of application data and cluster configuration and tested recovery procedures.',
        'Led IT for two new manufacturing facilities in 2025, in Palestine, TX and Battleboro, NC, from planning through go-live, delivering networking, site-to-site VPN, compute, security, and identity without disrupting existing sites.',
        'Led the migration of 200+ users from on-premises Active Directory to Microsoft Entra ID, implementing Azure AD Connect, MFA, and Conditional Access, modernizing Group Policy, and moving file shares to OneDrive.',
        'Manage networking and security across all sites (Fortinet firewalls, site-to-site VPN, secure remote access), deployed 130+ security cameras, and custom-built a 200 TB storage server for 6-month video retention.',
        'Developed and support LS Academy, a Moodle learning management system (LMS) on Kubernetes for 500+ dealers, employees, and U.S. LS Group affiliates, deployed through Argo CD and GitHub Actions.',
        'Automated business processes with Microsoft 365, Power Apps, and Power Automate, including an internal ticketing system, and built an AI-assisted file organization tool that uses local language models to classify a shared, multi-department file server and flag duplicates, with human review before any change.',
        'Lead a team of 4 IT professionals, serve as the escalation point for production incidents, and present IT roadmaps, project status, and risks to division leadership. Received the 2025 CEO Award for Employee of the Year.',
      ],
      stack: ['Kubernetes', 'Flux CD', 'Argo CD', 'GitHub Actions', 'SOPS', 'Traefik', 'React', 'Django', 'PostgreSQL', 'Linode/Akamai', 'Azure / Entra ID', 'Fortinet', 'Microsoft 365', 'Power Platform'],
    },
    {
      company: 'Interamerican Foods Corp. / La Moderna USA',
      companyContext:
        "U.S. subsidiary of Grupo La Moderna, one of Latin America's largest pasta manufacturers. Its first U.S. plant produces private-label pasta for Walmart (Great Value), Campbell's, and Goya.",
      role: 'IT Manager',
      location: 'Cleburne, TX',
      dates: 'Jun 2017 – Oct 2022',
      bullets: [
        'Owned all technology for a new $80M automated manufacturing plant, from greenfield buildout through 24/7 production, covering network and wireless, cybersecurity, video surveillance, servers and storage (VMware on HPE SimpliVity), identity, and OT/IT integration for production and packaging lines.',
        'Led a team of 3 IT staff with on-call coverage for 24/7 production, and presented technology plans and launch readiness to executive and plant leadership.',
        'Automated multi-tier backup and disaster recovery for production and packaging-line servers, with failover testing and regular DR drills, reducing recovery time from over 60 minutes to under 10.',
        'Led the selection and implementation of Freshservice ITSM for 27 sites and 2,500+ users across the U.S., Mexico, and Guatemala, configuring SLAs, policies, automated workflows, and reporting.',
        'Rolled out Cisco Meraki switching, wireless, and cameras across all U.S. sites with zero production downtime.',
        'Secured all sites with site-to-site VPN, next-generation firewalls, intrusion detection (IDS), Cloudflare DNS and WAF, WireGuard remote access, and network segmentation; delivered regular security awareness training.',
        "Built a cloud-hosted web platform for freight scheduling, document management, and logistics coordination; ran the company's official U.S. website on Azure IaaS; and migrated 100+ users to Microsoft 365.",
      ],
      stack: ['VMware vSphere', 'HPE SimpliVity', 'Azure', 'Cisco Meraki', 'Fortinet', 'Cloudflare', 'WireGuard', 'Microsoft 365', 'Freshservice'],
    },
    {
      company: 'SR Traffic Service Inc.',
      companyContext: 'Cross-border logistics company operating 4 distribution facilities between the U.S. and Mexico.',
      role: 'Software Engineer',
      location: 'Laredo, TX',
      dates: 'Jan 2010 – Jun 2017',
      bullets: [
        'Designed and built a warehouse management system (WMS) from the ground up, with barcode generation, handheld scanner integration, mobile and desktop clients, real-time inventory, customs documentation, and client reporting for 20+ international clients across 4 facilities.',
        'Developed REST APIs, SQL-backed workflows, and customer portals that automated inventory, dispatch, and customs paperwork.',
        'Automated build, test, and deployment and migrated workloads to the cloud; implemented database backup and recovery for WMS and client data, and led regular security audits and remediation.',
      ],
      stack: ['JavaScript', 'PHP', 'SQL', 'REST APIs', 'Bash', 'CI/CD'],
    },
  ],

  // Website only (pdfSections.projects is false).
  projects: [
    {
      name: 'Start Blue — Official Tractor Quoting Platform',
      url: 'startblue.lstractorusa.com',
      page: '/projects/start-blue/',
      description:
        "LS Tractor's official tractor quoting tool for the U.S. and Canada, open to the public, with secure accounts for 350+ dealerships. React, Django, and PostgreSQL on a three-node Kubernetes cluster, delivered through GitHub Actions and Flux CD, with automated restic backups. In production for over two years without a major incident; 3,000+ quotes generated.",
      stack: ['Kubernetes', 'Flux CD', 'GitHub Actions', 'React', 'Django', 'PostgreSQL', 'Linode/Akamai'],
    },
    {
      name: 'LS Academy — Learning Platform',
      page: '/projects/ls-academy/',
      description:
        'Moodle learning management system on Kubernetes for 500+ dealers, employees, and U.S. LS Group affiliates, deployed through Argo CD and GitHub Actions.',
      stack: ['Kubernetes', 'Moodle', 'Argo CD', 'GitHub Actions', 'GitOps'],
    },
    {
      name: 'LS Tractor Dealer Recruitment Site',
      url: 'recruitment.lstractorusa.com',
      description:
        'Recruitment site for prospective LS Tractor dealers. Owned design, frontend build, deployment, DNS, and TLS on a corporate subdomain.',
      stack: ['HTML/CSS/JS', 'DNS', 'TLS'],
    },
    {
      name: 'AI-Assisted File Organization Tool',
      url: 'github.com/jfrancolopez/LibrAIry',
      description:
        'Bash tool that uses local language models and metadata fingerprinting to classify a shared, multi-department file server and flag duplicates, keeping company data on-premises with human review before any change.',
      stack: ['Bash', 'Local LLMs', 'Linux'],
    },
    {
      name: 'Personal Developer Platform',
      url: 'github.com/jfrancolopez/Domum',
      page: '/projects/homelab-gitops/',
      description:
        'Self-hosted platform on Talos Kubernetes, Proxmox, Docker, and Debian, using GitOps to automate service deployment, secrets management, backups, DNS, and platform operations.',
      stack: ['Proxmox', 'Kubernetes', 'Talos', 'Flux CD', 'Helm', 'Traefik', 'Docker'],
    },
  ],

  certifications: [
    { title: 'Certified Kubernetes Administrator (CKA)', issuer: 'The Linux Foundation', date: 'in progress' },
    { title: 'Microsoft Certified: Azure Fundamentals (AZ-900)', issuer: 'Microsoft', date: '2022' },
    { title: 'Engineering Cisco Meraki Solutions', issuer: 'Cisco Meraki', date: '2021' },
    { title: 'HPE SimpliVity 380 System Administration (VMware)', issuer: 'HPE', date: '2019' },
  ],

  education: [
    { title: 'B.S. Computer Systems Engineering', issuer: 'Universidad del Valle de México', date: '2010' },
  ],

  // Short form for the PDF; the website shows the longer list below.
  pdfLearning: 'Terraform, Go',
  currentlyLearning: [
    'Certified Kubernetes Administrator (CKA), in progress',
    'Terraform and infrastructure as code',
    'Go, for Kubernetes tooling and automation',
    'AI developer tools (Claude Code, MCP, agentic workflows) for infrastructure automation and documentation',
  ],
};
