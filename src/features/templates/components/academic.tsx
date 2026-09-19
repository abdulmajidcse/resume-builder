import { memo } from 'react';
import type { TemplateProps } from '../types';
import { CustomSections, standardRenderers } from '../body';
import { contactItems, renderSections, rhythm } from '../primitives';

/**
 * Academic CV — dates set in a left gutter so a long record scans by year,
 * with section headings that carry across multiple pages without shouting.
 */
function AcademicTemplate({ resume }: TemplateProps) {
  const contacts = contactItems(resume);
  const options = {
    Heading: ({ children }: { children: React.ReactNode }) => (
      <h2
        data-block-heading
        style={{
          margin: `0 0 ${rhythm(2.5)}`,
          paddingBottom: rhythm(0.75),
          borderBottom: '1px solid #d8d8d8',
          fontSize: '1em',
          fontWeight: 700,
          fontVariant: 'small-caps',
          letterSpacing: '0.06em',
          color: 'var(--accent-ink)',
        }}
      >
        {children}
      </h2>
    ),
    dateStyle: 'under' as const,
    sectionGap: 6,
    entryGap: 3,
    justifyProse: true,
  };

  return (
    <div style={{ padding: `${rhythm(12)} ${rhythm(12)}` }}>
      <header style={{ textAlign: 'center', paddingBottom: rhythm(4) }}>
        <h1
          style={{
            margin: 0,
            fontSize: '1.95em',
            fontWeight: 700,
            fontVariant: 'small-caps',
            letterSpacing: '0.05em',
          }}
        >
          {resume.profile.fullName || 'Your Name'}
        </h1>
        {resume.profile.headline ? (
          <p style={{ margin: `${rhythm(1)} 0 0`, fontSize: '0.98em', color: '#4a4a4a' }}>
            {resume.profile.headline}
          </p>
        ) : null}
        {contacts.length > 0 ? (
          <p
            style={{
              margin: `${rhythm(2)} 0 0`,
              fontSize: '0.85em',
              color: '#5a5a5a',
              lineHeight: 1.75,
            }}
          >
            {contacts.map((item) => item.text).join('  ·  ')}
          </p>
        ) : null}
      </header>

      <div style={{ borderTop: '1px solid #cfcfcf' }} />

      {renderSections(resume, standardRenderers(resume, options))}
      <CustomSections resume={resume} options={options} />
    </div>
  );
}

export default memo(AcademicTemplate);
