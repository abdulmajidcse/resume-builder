import { z } from 'zod';

/**
 * The resume domain model.
 *
 * This schema is the application's only source of truth. Templates render it,
 * the editor mutates it, storage persists it, and import validates against it.
 * Nothing else in the app defines what a resume *is*.
 *
 * Design note: every field is optional-or-defaulted rather than required. A
 * resume under construction is always a partially-filled resume, so "valid"
 * must include "empty". Required-field validation is a concern of the UI
 * (completeness hints), not of the data model.
 */

const trimmed = () => z.string().trim();

export const linkSchema = z.object({
  id: z.string(),
  label: trimmed().default(''),
  url: trimmed().default(''),
});

export const profileSchema = z.object({
  fullName: trimmed().default(''),
  headline: trimmed().default(''),
  email: trimmed().default(''),
  phone: trimmed().default(''),
  location: trimmed().default(''),
  website: trimmed().default(''),
  summary: trimmed().default(''),
  links: z.array(linkSchema).default([]),
});

export const experienceSchema = z.object({
  id: z.string(),
  role: trimmed().default(''),
  company: trimmed().default(''),
  location: trimmed().default(''),
  startDate: trimmed().default(''),
  endDate: trimmed().default(''),
  current: z.boolean().default(false),
  /** One achievement per line. Stored as an array so templates control bullet rendering. */
  highlights: z.array(z.string()).default([]),
});

export const educationSchema = z.object({
  id: z.string(),
  degree: trimmed().default(''),
  institution: trimmed().default(''),
  location: trimmed().default(''),
  startDate: trimmed().default(''),
  endDate: trimmed().default(''),
  grade: trimmed().default(''),
  details: trimmed().default(''),
});

export const projectSchema = z.object({
  id: z.string(),
  name: trimmed().default(''),
  role: trimmed().default(''),
  url: trimmed().default(''),
  startDate: trimmed().default(''),
  endDate: trimmed().default(''),
  description: trimmed().default(''),
  technologies: z.array(z.string()).default([]),
});

export const skillGroupSchema = z.object({
  id: z.string(),
  category: trimmed().default(''),
  items: z.array(z.string()).default([]),
});

export const certificationSchema = z.object({
  id: z.string(),
  name: trimmed().default(''),
  issuer: trimmed().default(''),
  date: trimmed().default(''),
  credentialUrl: trimmed().default(''),
});

export const languageSchema = z.object({
  id: z.string(),
  name: trimmed().default(''),
  proficiency: trimmed().default(''),
});

export const awardSchema = z.object({
  id: z.string(),
  title: trimmed().default(''),
  issuer: trimmed().default(''),
  date: trimmed().default(''),
  description: trimmed().default(''),
});

export const customEntrySchema = z.object({
  id: z.string(),
  title: trimmed().default(''),
  subtitle: trimmed().default(''),
  date: trimmed().default(''),
  description: trimmed().default(''),
});

export const customSectionSchema = z.object({
  id: z.string(),
  title: trimmed().default('Custom Section'),
  entries: z.array(customEntrySchema).default([]),
});

/** Section identifiers that can be reordered and toggled. */
export const SECTION_IDS = [
  'summary',
  'experience',
  'education',
  'projects',
  'skills',
  'certifications',
  'languages',
  'awards',
] as const;

export const sectionIdSchema = z.enum(SECTION_IDS);

export const sectionMetaSchema = z.object({
  id: sectionIdSchema,
  /** Per-resume heading override, e.g. "Work History" instead of "Experience". */
  title: trimmed().default(''),
  visible: z.boolean().default(true),
});

export const PAGE_FORMATS = ['A4', 'Letter'] as const;
export const pageFormatSchema = z.enum(PAGE_FORMATS);

export const FONT_FAMILIES = ['sans', 'serif', 'mono'] as const;
export const fontFamilySchema = z.enum(FONT_FAMILIES);

export const DENSITIES = ['compact', 'normal', 'relaxed'] as const;
export const densitySchema = z.enum(DENSITIES);

export const themeSchema = z.object({
  /** Hex accent colour applied by every template. */
  accent: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Accent must be a 6-digit hex colour')
    .default('#1F3A5F'),
  fontFamily: fontFamilySchema.default('sans'),
  /** Base body size in points, as printed. */
  fontSize: z.number().min(8).max(13).default(10.5),
  density: densitySchema.default('normal'),
  pageFormat: pageFormatSchema.default('A4'),
  showPhoto: z.boolean().default(false),
  /** Data URL of a cropped avatar. Kept in-document so export/import stays lossless. */
  photo: z.string().default(''),
});

export const resumeSchema = z.object({
  /** Schema version, used to migrate persisted documents. */
  version: z.literal(1).default(1),
  id: z.string(),
  title: trimmed().default('Untitled Resume'),
  templateId: trimmed().default('classic'),
  updatedAt: z.string().default(() => new Date().toISOString()),
  theme: themeSchema.default({}),
  profile: profileSchema.default({}),
  sections: z.array(sectionMetaSchema).default([]),
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  projects: z.array(projectSchema).default([]),
  skills: z.array(skillGroupSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  languages: z.array(languageSchema).default([]),
  awards: z.array(awardSchema).default([]),
  customSections: z.array(customSectionSchema).default([]),
});

export type Link = z.infer<typeof linkSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Project = z.infer<typeof projectSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Certification = z.infer<typeof certificationSchema>;
export type Language = z.infer<typeof languageSchema>;
export type Award = z.infer<typeof awardSchema>;
export type CustomEntry = z.infer<typeof customEntrySchema>;
export type CustomSection = z.infer<typeof customSectionSchema>;
export type SectionId = z.infer<typeof sectionIdSchema>;
export type SectionMeta = z.infer<typeof sectionMetaSchema>;
export type Theme = z.infer<typeof themeSchema>;
export type Resume = z.infer<typeof resumeSchema>;
export type PageFormat = z.infer<typeof pageFormatSchema>;
export type FontFamily = z.infer<typeof fontFamilySchema>;
export type Density = z.infer<typeof densitySchema>;

/** Collections the editor can add to, reorder, and delete from generically. */
export type ListSectionId = Extract<
  SectionId,
  'experience' | 'education' | 'projects' | 'skills' | 'certifications' | 'languages' | 'awards'
>;
