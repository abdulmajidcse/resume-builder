import * as React from 'react';
import { SECTION_LABELS } from '@/entities/resume';
import type { Resume, SectionId, Theme } from '@/entities/resume';
import { displayUrl, joinParts } from '@/shared/lib/format';

/** Vertical rhythm multipliers, driven by the document's density setting. */
const DENSITY_SCALE: Record<Theme['density'], number> = {
  compact: 0.78,
  normal: 1,
  relaxed: 1.24,
};

/**
 * Font variables are declared on <html> by the root layout. Falling back to
 * system families keeps printing correct even if a webfont fails to load.
 */
const FONT_STACKS: Record<Theme['fontFamily'], string> = {
  sans: "var(--font-inter), ui-sans-serif, system-ui, 'Segoe UI', Helvetica, Arial, sans-serif",
  serif: "var(--font-source-serif), ui-serif, Georgia, 'Times New Roman', serif",
  mono: 'var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};

/**
 * Templates read presentation entirely from CSS custom properties, so a theme
 * change repaints without re-rendering any template subtree.
 */
export function templateStyle(theme: Theme): React.CSSProperties {
  return {
    '--accent': theme.accent,
    '--accent-soft': `color-mix(in srgb, ${theme.accent} 12%, white)`,
    '--accent-line': `color-mix(in srgb, ${theme.accent} 28%, white)`,
    '--accent-ink': `color-mix(in srgb, ${theme.accent} 78%, black)`,
    '--rhythm': `${DENSITY_SCALE[theme.density]}`,
    fontFamily: FONT_STACKS[theme.fontFamily],
    fontSize: `${theme.fontSize}pt`,
    lineHeight: 1.45,
  } as React.CSSProperties;
}

/** Spacing helper: `rhythm(3)` is three base units scaled by density. */
export function rhythm(units: number): string {
  return `calc(${units * 4}px * var(--rhythm))`;
}

export function sectionTitle(resume: Resume, id: SectionId): string {
  const override = resume.sections.find((section) => section.id === id)?.title.trim();
  return override || SECTION_LABELS[id];
}

function hasText(...values: string[]): boolean {
  return values.some((value) => value.trim().length > 0);
}

/** True when a section would print nothing, so templates can omit its heading. */
export function isSectionEmpty(resume: Resume, id: SectionId): boolean {
  switch (id) {
    case 'summary':
      return !hasText(resume.profile.summary);
    case 'experience':
      return !resume.experience.some(
        (item) => hasText(item.role, item.company) || item.highlights.some((h) => h.trim()),
      );
    case 'education':
      return !resume.education.some((item) => hasText(item.degree, item.institution));
    case 'projects':
      return !resume.projects.some((item) => hasText(item.name, item.description));
    case 'skills':
      return !resume.skills.some(
        (group) => hasText(group.category) || group.items.some((i) => i.trim()),
      );
    case 'certifications':
      return !resume.certifications.some((item) => hasText(item.name, item.issuer));
    case 'languages':
      return !resume.languages.some((item) => hasText(item.name));
    case 'awards':
      return !resume.awards.some((item) => hasText(item.title, item.issuer));
    default:
      return true;
  }
}

/**
 * Ordered list of sections a template should render: visible, non-empty, in the
 * user's chosen order. Sequencing lives here so no template reimplements it.
 */
export function orderedSections(resume: Resume): SectionId[] {
  return resume.sections
    .filter((section) => section.visible && !isSectionEmpty(resume, section.id))
    .map((section) => section.id);
}

export type SectionRenderers = Partial<Record<SectionId, () => React.ReactNode>>;

/** Applies a template's per-section renderers in the document's order. */
export function renderSections(resume: Resume, renderers: SectionRenderers): React.ReactNode[] {
  return orderedSections(resume)
    .map((id) => {
      const render = renderers[id];
      if (!render) return null;
      return <React.Fragment key={id}>{render()}</React.Fragment>;
    })
    .filter(Boolean) as React.ReactNode[];
}

/**
 * Renders only the requested sections, keeping the user's ordering. Two-column
 * templates call this twice — once per column — with disjoint id sets.
 */
export function renderSelected(
  resume: Resume,
  renderers: SectionRenderers,
  only: readonly SectionId[],
): React.ReactNode[] {
  const allowed = new Set<SectionId>(only);
  return orderedSections(resume)
    .filter((id) => allowed.has(id))
    .map((id) => {
      const render = renderers[id];
      if (!render) return null;
      return <React.Fragment key={id}>{render()}</React.Fragment>;
    })
    .filter(Boolean) as React.ReactNode[];
}

export function nonEmptyCustomSections(resume: Resume) {
  return resume.customSections.filter(
    (section) =>
      section.title.trim() &&
      section.entries.some((entry) => hasText(entry.title, entry.subtitle, entry.description)),
  );
}

export function cleanHighlights(highlights: string[]): string[] {
  return highlights.map((line) => line.trim()).filter(Boolean);
}

/** Contact line items, already de-blanked and link-normalised for display. */
export function contactItems(resume: Resume): Array<{ key: string; text: string; href?: string }> {
  const { profile } = resume;
  const items: Array<{ key: string; text: string; href?: string }> = [];
  if (profile.email.trim())
    items.push({
      key: 'email',
      text: profile.email.trim(),
      href: `mailto:${profile.email.trim()}`,
    });
  if (profile.phone.trim()) items.push({ key: 'phone', text: profile.phone.trim() });
  if (profile.location.trim()) items.push({ key: 'location', text: profile.location.trim() });
  if (profile.website.trim())
    items.push({ key: 'website', text: displayUrl(profile.website), href: profile.website });
  for (const link of profile.links) {
    if (!link.url.trim() && !link.label.trim()) continue;
    items.push({
      key: link.id,
      text: link.label.trim() || displayUrl(link.url),
      href: link.url,
    });
  }
  return items;
}

export { joinParts };

export interface BulletsProps {
  items: string[];
  marker?: string;
  style?: React.CSSProperties;
  className?: string;
}

/** Achievement list. Uses a text marker so bullets survive PDF text extraction. */
export function Bullets({ items, marker = '•', style, className }: BulletsProps) {
  if (items.length === 0) return null;
  return (
    <ul className={className} style={{ listStyle: 'none', margin: 0, padding: 0, ...style }}>
      {items.map((item, index) => (
        <li
          key={index}
          style={{ display: 'flex', gap: '0.6em', marginTop: index === 0 ? 0 : rhythm(1) }}
        >
          <span aria-hidden style={{ color: 'var(--accent)', lineHeight: 1.45 }}>
            {marker}
          </span>
          <span style={{ flex: 1 }}>{item}</span>
        </li>
      ))}
    </ul>
  );
}
