import { memo } from 'react';
import type { TemplateProps } from '../types';
import { CustomSections, standardRenderers } from '../body';
import { contactItems, renderSections, rhythm } from '../primitives';

/**
 * Minimal — no rules, no fills. Hierarchy comes from whitespace and weight
 * alone, which lets dense content breathe on a single page.
 */
function MinimalTemplate({ resume }: TemplateProps) {
  const contacts = contactItems(resume);
  const options = {
    Heading: ({ children }: { children: React.ReactNode }) => (
      <h2
        data-block-heading
        style={{
          margin: `0 0 ${rhythm(2)}`,
          fontSize: '0.72em',
          fontWeight: 600,
          letterSpacing: '0.22em',
          textTransform: 'uppercase' as const,
          color: '#8a8a8a',
        }}
      >
        {children}
      </h2>
    ),
    dateStyle: 'right' as const,
    sectionGap: 7,
    entryGap: 3.5,
    mutedColor: '#8a8a8a',
    bulletMarker: '–',
  };

  return (
    <div style={{ padding: `${rhythm(14)} ${rhythm(13)}` }}>
      <header>
        <h1 style={{ margin: 0, fontSize: '1.9em', fontWeight: 500, letterSpacing: '0.01em' }}>
          {resume.profile.fullName || 'Your Name'}
        </h1>
        {resume.profile.headline ? (
          <p style={{ margin: `${rhythm(1)} 0 0`, fontSize: '1em', color: '#6b6b6b' }}>
            {resume.profile.headline}
          </p>
        ) : null}
        {contacts.length > 0 ? (
          <p
            style={{
              margin: `${rhythm(2.5)} 0 0`,
              fontSize: '0.85em',
              color: '#8a8a8a',
              lineHeight: 1.8,
            }}
          >
            {contacts.map((item) => item.text).join('   ·   ')}
          </p>
        ) : null}
      </header>

      {renderSections(resume, standardRenderers(resume, options))}
      <CustomSections resume={resume} options={options} />
    </div>
  );
}

export default memo(MinimalTemplate);
