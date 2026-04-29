export const resume = {
  name: 'Franco Lopez',
  headline: 'Platform & DevOps Engineer · Kubernetes · Azure · Infrastructure',
  pdfHeadline: 'Platform & DevOps Engineer · Kubernetes · Azure · Infrastructure · CKA in progress',
  location: 'Raleigh-Durham, NC',
  availability: 'Open to remote or hybrid roles',
  languages: ['English', 'Spanish'],
  contact: {
    email: 'hello@jfrancolopez.com',
    linkedin: 'linkedin.com/in/jfranco-lopez',
    github: 'github.com/jfrancolopez ',
  },
  intro:
    'I’ve spent 15+ years building and running real systems across software, cloud, infrastructure, networking, security, automation, and IT leadership. I’m currently focused on platform and DevOps work: Kubernetes, cloud infrastructure, CI/CD, and practical automation.',
  summary:
    'Platform and DevOps-focused engineer based in Raleigh, NC, open to remote or hybrid Platform, DevOps, SRE, and Cloud Infrastructure roles. My background spans building a warehouse management system from scratch, running 24/7 manufacturing infrastructure, modernizing identity and cloud environments, and shipping Kubernetes-hosted platforms used by dealer networks across the US and Canada.',
  pdfSummary:
    'Platform and DevOps-focused engineer with 15+ years across software engineering, cloud infrastructure, Linux, networking, security, automation, and IT leadership. Experienced building a warehouse management system from scratch, running 24/7 manufacturing infrastructure, modernizing identity and cloud environments, and shipping Kubernetes-hosted platforms used by dealer networks across the US and Canada.',
  skills: [
    {
      label: 'Platform / DevOps',
      items: ['Kubernetes', 'Docker', 'Linux', 'Bash', 'Python', 'CI/CD', 'deployment workflows', 'automation'],
    },
    {
      label: 'Cloud / Infrastructure',
      items: ['Azure', 'AWS', 'hybrid infrastructure', 'cloud-hosted workloads', 'backup', 'disaster recovery'],
    },
    {
      label: 'Applications / Data',
      items: ['React', 'PostgreSQL', 'REST APIs', 'SQL', 'internal tooling', 'business workflow systems'],
    },
    {
      label: 'Security / Identity',
      items: ['Azure AD / Entra ID', 'Active Directory', 'MFA', 'Conditional Access', 'Microsoft 365'],
    },
    {
      label: 'Networking / Operations',
      items: ['Fortinet', 'Cisco Meraki', 'Cloudflare', 'WireGuard', 'VMware', 'HPE SimpliVity'],
    },
  ],
  selectedWork: [
    'Architected and shipped Start Blue, a Kubernetes-based quote platform serving 350+ dealers across the US and Canada.',
    'Currently building LS Academy, a Kubernetes-hosted learning platform for 500+ users.',
    'Led full migration from on-prem Active Directory to Azure AD / Entra ID for 200+ users.',
    'Designed greenfield IT and network infrastructure for new manufacturing sites in Texas and North Carolina.',
    'Built a custom warehouse management system serving 20+ international clients across four distribution facilities.',
  ],
  experience: [
    {
      company: 'LS Tractor USA',
      role: 'Information Technology Manager',
      location: 'Raleigh, NC',
      dates: 'Oct 2022-Present',
      bullets: [
        'Lead IT and platform engineering for North American operations across infrastructure, applications, security, and cloud strategy.',
        'Architected and shipped Start Blue, a Kubernetes-based quote platform serving 350+ dealers; built the React + PostgreSQL application and AWS-hosted infrastructure, including container orchestration, secure data storage, and disaster recovery.',
        'Currently building LS Academy, a Kubernetes-hosted learning platform for 500+ users, owning architecture, deployment, and CI/CD.',
        'Led migration from on-prem Active Directory to Azure AD / Entra ID for 200+ users, including Azure AD Connect, Conditional Access, MFA, GPO modernization, and NAS-to-OneDrive transition.',
        'Designed end-to-end IT and network infrastructure for two new manufacturing sites in Texas and North Carolina.',
        'Build and mentor a cross-functional team across infrastructure, applications, and security while managing vendor relationships and technical procurement.',
      ],
    },
    {
      company: 'Interamerican Foods Corp. / La Moderna USA',
      role: 'Information Technology Manager',
      location: 'Cleburne, TX',
      dates: 'Jun 2017-Oct 2022',
      bullets: [
        'Led IT and infrastructure engineering for the company’s first US-based manufacturing facility, a 24/7 automated pasta plant.',
        'Stood up the IT and infrastructure stack from greenfield: networking, security, cloud infrastructure, IT integration, and business continuity.',
        'Designed and deployed Azure infrastructure, including the US-facing web platform on Azure IaaS.',
        'Led FreshService ITSM rollout across 27 sites in the US, Mexico, and Guatemala, supporting 2,500+ users with SLAs and automation workflows.',
        'Implemented a three-layer cloud backup and disaster recovery strategy with regular DR drills.',
        'Hardened perimeter security with next-gen firewalls, IDS, Cloudflare DNS/WAF, and WireGuard VPN for remote work.',
        'Migrated 100+ users to Microsoft 365 and led Cisco Meraki rollout across US locations with zero downtime.',
      ],
    },
    {
      company: 'SR Traffic Service Inc.',
      role: 'Software / Systems Engineer',
      location: 'Laredo, TX',
      dates: 'Jan 2010-Jun 2017',
      bullets: [
        'Built a Warehouse Management System from scratch for cross-border logistics operations across four distribution facilities in the US and Mexico.',
        'Delivered barcode generation, handheld scanner integration, mobile and desktop clients, real-time inventory, customs documentation, and client-facing reporting for 20+ international clients.',
        'Designed and deployed the company website with real-time inventory APIs and customs document workflows.',
        'Automated build, test, and deployment pipelines and migrated workloads to cloud infrastructure for scalability and cost control.',
        'Ran regular security audits and led remediation work.',
      ],
    },
  ],
  projects: [
    {
      name: 'LS Academy',
      description:
        'Kubernetes-hosted learning platform for 500+ users; application architecture, environment setup, infrastructure configuration, deployment workflows, CI/CD, networking, and access control.',
    },
    {
      name: 'Start Blue',
      description:
        'Production quote platform used by 350+ dealers; Kubernetes, Docker, PostgreSQL, React, cloud storage, release workflows, backup, disaster recovery, troubleshooting, stability, performance, analytics, and distributed user support.',
    },
    {
      name: 'Azure AD Migration',
      description:
        'Migrated 200+ users from on-prem Active Directory to Azure AD / Entra ID with Azure AD Connect, MFA, Conditional Access, and NAS-to-OneDrive transition.',
    },
    {
      name: 'Macaroni Web Platform',
      description:
        'Private cloud-based platform for freight scheduling, document management, logistics coordination, APIs, SQL-backed workflows, and multi-user access.',
    },
    {
      name: 'Warehouse Management System',
      description:
        'Custom platform for logistics operations across four facilities; SQL, APIs, backend systems, web development, FileMaker Claris, PHP, and Bash.',
    },
  ],
  educationAndCertifications: [
    'B.S. Computer Systems Engineering, Universidad del Valle de Mexico, 2005-2010',
    'Certified Kubernetes Administrator, in progress',
    'Implementing and Administering Cisco Solutions CCNA, Cisco, issued Jul 2022, Credential ID 219743',
    'Microsoft Azure Fundamentals, Microsoft, issued Mar 2022, Credential ID l169-8499',
    'Engineering Cisco Meraki Solutions, Cisco Meraki, issued Sep 2021',
    'HPE SimpliVity 380 System Administration (VMware), Hewlett Packard Enterprise, issued Apr 2019',
  ],
};
