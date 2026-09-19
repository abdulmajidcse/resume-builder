import { SECTION_IDS, resumeSchema } from './schema';
import type {
  Award,
  Certification,
  CustomEntry,
  CustomSection,
  Education,
  Experience,
  Language,
  Project,
  Resume,
  SectionId,
  SectionMeta,
  SkillGroup,
} from './schema';

/** Collision-resistant id that works identically on the server and in the browser. */
export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `id-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
}

export const SECTION_LABELS: Record<SectionId, string> = {
  summary: 'Professional Summary',
  experience: 'Experience',
  education: 'Education',
  projects: 'Projects',
  skills: 'Skills',
  certifications: 'Certifications',
  languages: 'Languages',
  awards: 'Awards',
};

export function defaultSections(): SectionMeta[] {
  return SECTION_IDS.map((id) => ({ id, title: '', visible: true }));
}

export const emptyExperience = (): Experience => ({
  id: createId(),
  role: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  highlights: [''],
});

export const emptyEducation = (): Education => ({
  id: createId(),
  degree: '',
  institution: '',
  location: '',
  startDate: '',
  endDate: '',
  grade: '',
  details: '',
});

export const emptyProject = (): Project => ({
  id: createId(),
  name: '',
  role: '',
  url: '',
  startDate: '',
  endDate: '',
  description: '',
  technologies: [],
});

export const emptySkillGroup = (): SkillGroup => ({ id: createId(), category: '', items: [] });

export const emptyCertification = (): Certification => ({
  id: createId(),
  name: '',
  issuer: '',
  date: '',
  credentialUrl: '',
});

export const emptyLanguage = (): Language => ({ id: createId(), name: '', proficiency: '' });

export const emptyAward = (): Award => ({
  id: createId(),
  title: '',
  issuer: '',
  date: '',
  description: '',
});

export const emptyCustomEntry = (): CustomEntry => ({
  id: createId(),
  title: '',
  subtitle: '',
  date: '',
  description: '',
});

export const emptyCustomSection = (): CustomSection => ({
  id: createId(),
  title: 'Custom Section',
  entries: [emptyCustomEntry()],
});

/**
 * A blank but structurally valid resume. Starting from scratch and starting
 * from a sample share this code path, so empty-state bugs cannot hide.
 */
export function createEmptyResume(templateId = 'classic'): Resume {
  return resumeSchema.parse({
    id: createId(),
    title: 'Untitled Resume',
    templateId,
    sections: defaultSections(),
    experience: [emptyExperience()],
    education: [emptyEducation()],
    skills: [emptySkillGroup()],
  });
}
