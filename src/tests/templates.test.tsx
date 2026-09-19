import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createEmptyResume, createSampleResume } from '@/entities/resume';
import type { Resume } from '@/entities/resume';
import { TEMPLATES, getTemplate, templateIds } from '@/features/templates/registry';

/**
 * The registry contract.
 *
 * Every template must render both a full document and a blank one. The blank
 * case is the one that matters: "start from scratch" is the default path, and
 * an unguarded `.map` over empty data is the classic way it breaks.
 */
describe('template registry', () => {
  it('ships ten templates with unique ids', () => {
    expect(TEMPLATES.length).toBe(10);
    expect(new Set(templateIds()).size).toBe(10);
  });

  it('falls back to a renderable template for an unknown id', () => {
    expect(getTemplate('does-not-exist').id).toBe('classic');
  });

  it.each(TEMPLATES.map((template) => [template.id, template] as const))(
    '%s renders a populated resume',
    (id, template) => {
      const markup = renderToStaticMarkup(<template.component resume={createSampleResume(id)} />);
      expect(markup).toContain('Alex Morgan');
      expect(markup.length).toBeGreaterThan(500);
    },
  );

  it.each(TEMPLATES.map((template) => [template.id, template] as const))(
    '%s renders an empty resume without throwing',
    (id, template) => {
      const markup = renderToStaticMarkup(<template.component resume={createEmptyResume(id)} />);
      expect(markup).toContain('Your Name');
    },
  );

  it.each(TEMPLATES.map((template) => [template.id, template] as const))(
    '%s omits sections the user hid',
    (id, template) => {
      const resume: Resume = createSampleResume(id);
      resume.sections = resume.sections.map((section) =>
        section.id === 'awards' ? { ...section, visible: false } : section,
      );
      const markup = renderToStaticMarkup(<template.component resume={resume} />);
      expect(markup).not.toContain('Engineering Excellence Award');
    },
  );

  it.each(TEMPLATES.map((template) => [template.id, template] as const))(
    '%s honours a renamed section heading',
    (id, template) => {
      const resume: Resume = createSampleResume(id);
      resume.sections = resume.sections.map((section) =>
        section.id === 'experience' ? { ...section, title: 'Work History' } : section,
      );
      const markup = renderToStaticMarkup(<template.component resume={resume} />);
      expect(markup).toContain('Work History');
    },
  );
});
