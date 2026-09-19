import { resumeSchema } from './schema';
import type { Resume } from './schema';
import { createId, defaultSections } from './defaults';

/**
 * Realistic content used to preview templates in the gallery and to seed the
 * "start with an example" path. Kept deliberately generic so it reads as a
 * demonstration rather than as a real person's record.
 */
export function createSampleResume(templateId = 'classic'): Resume {
  return resumeSchema.parse({
    id: createId(),
    title: 'Sample Resume',
    templateId,
    sections: defaultSections(),
    theme: {
      accent: '#1F3A5F',
      fontFamily: 'sans',
      fontSize: 10.5,
      density: 'normal',
      pageFormat: 'A4',
    },
    profile: {
      fullName: 'Alex Morgan',
      headline: 'Senior Product Engineer',
      email: 'alex.morgan@example.com',
      phone: '+1 (415) 555-0148',
      location: 'San Francisco, CA',
      website: 'alexmorgan.dev',
      summary:
        'Product-minded engineer with eight years building customer-facing web platforms. Leads small teams from discovery through launch, with a track record of cutting page-load times, raising conversion, and leaving codebases easier to work in than they were found.',
      links: [
        { id: createId(), label: 'LinkedIn', url: 'linkedin.com/in/example' },
        { id: createId(), label: 'GitHub', url: 'github.com/example' },
      ],
    },
    experience: [
      {
        id: createId(),
        role: 'Senior Product Engineer',
        company: 'Northwind Labs',
        location: 'San Francisco, CA',
        startDate: 'Mar 2021',
        endDate: '',
        current: true,
        highlights: [
          'Led the rebuild of the customer dashboard, cutting median load time from 4.1s to 0.9s and lifting weekly active use by 34%.',
          'Designed the component library now used by four product teams, reducing new-feature build time by roughly a third.',
          'Mentored five engineers; three were promoted within eighteen months.',
        ],
      },
      {
        id: createId(),
        role: 'Product Engineer',
        company: 'Halcyon Software',
        location: 'Remote',
        startDate: 'Jun 2018',
        endDate: 'Feb 2021',
        current: false,
        highlights: [
          'Shipped the self-serve onboarding flow that grew trial-to-paid conversion from 11% to 19%.',
          'Introduced end-to-end testing, taking production regressions from weekly to roughly one per quarter.',
        ],
      },
      {
        id: createId(),
        role: 'Frontend Developer',
        company: 'Brightpath Digital',
        location: 'Austin, TX',
        startDate: 'Aug 2016',
        endDate: 'May 2018',
        current: false,
        highlights: [
          'Built responsive marketing sites for twelve clients, all scoring above 95 on Lighthouse.',
          'Automated the release pipeline, reducing deploys from two hours to under ten minutes.',
        ],
      },
    ],
    education: [
      {
        id: createId(),
        degree: 'B.S. Computer Science',
        institution: 'University of Texas at Austin',
        location: 'Austin, TX',
        startDate: '2012',
        endDate: '2016',
        grade: '3.8 GPA',
        details: 'Coursework in distributed systems, human-computer interaction, and algorithms.',
      },
    ],
    projects: [
      {
        id: createId(),
        name: 'Ledgerline',
        role: 'Creator',
        url: 'github.com/example/ledgerline',
        startDate: '2023',
        endDate: '',
        description:
          'Open-source double-entry accounting engine with a typed query layer. Used by 900+ repositories.',
        technologies: ['TypeScript', 'PostgreSQL', 'Prisma'],
      },
      {
        id: createId(),
        name: 'Atlas Charts',
        role: 'Maintainer',
        url: 'atlascharts.dev',
        startDate: '2021',
        endDate: '2023',
        description:
          'Accessible charting library with first-class keyboard navigation and screen-reader support.',
        technologies: ['React', 'D3', 'ARIA'],
      },
    ],
    skills: [
      { id: createId(), category: 'Languages', items: ['TypeScript', 'Python', 'Go', 'SQL'] },
      { id: createId(), category: 'Frameworks', items: ['React', 'Next.js', 'Node.js', 'FastAPI'] },
      {
        id: createId(),
        category: 'Infrastructure',
        items: ['Docker', 'Terraform', 'AWS', 'GitHub Actions'],
      },
      {
        id: createId(),
        category: 'Practices',
        items: ['Accessibility', 'Test-driven development', 'Design systems'],
      },
    ],
    certifications: [
      {
        id: createId(),
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        date: '2023',
        credentialUrl: '',
      },
    ],
    languages: [
      { id: createId(), name: 'English', proficiency: 'Native' },
      { id: createId(), name: 'Spanish', proficiency: 'Professional working' },
    ],
    awards: [
      {
        id: createId(),
        title: 'Engineering Excellence Award',
        issuer: 'Northwind Labs',
        date: '2023',
        description: 'Recognised for the dashboard performance programme.',
      },
    ],
  });
}
