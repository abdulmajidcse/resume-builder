import { describe, expect, it } from 'vitest';
import {
  createEmptyResume,
  createSampleResume,
  defaultSections,
  resumeSchema,
  SECTION_IDS,
} from '@/entities/resume';

describe('resume schema', () => {
  it('accepts an empty document, because a resume under construction is valid', () => {
    const resume = createEmptyResume();
    expect(resumeSchema.safeParse(resume).success).toBe(true);
  });

  it('fills every field from defaults when given only an id', () => {
    const parsed = resumeSchema.parse({ id: 'x' });
    expect(parsed.theme.pageFormat).toBe('A4');
    expect(parsed.profile.links).toEqual([]);
    expect(parsed.experience).toEqual([]);
  });

  it('rejects an accent that is not a six-digit hex colour', () => {
    const result = resumeSchema.safeParse({ id: 'x', theme: { accent: 'red' } });
    expect(result.success).toBe(false);
  });

  it('round-trips through JSON without loss', () => {
    const resume = createSampleResume('modern');
    const restored = resumeSchema.parse(JSON.parse(JSON.stringify(resume)));
    expect(restored).toEqual(resume);
  });

  it('exposes one section entry per known section id', () => {
    expect(defaultSections().map((section) => section.id)).toEqual([...SECTION_IDS]);
  });

  it('trims incoming whitespace so blank-looking fields are genuinely blank', () => {
    const parsed = resumeSchema.parse({ id: 'x', profile: { fullName: '   ' } });
    expect(parsed.profile.fullName).toBe('');
  });
});
