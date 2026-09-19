import { memo } from 'react';
import type { TemplateProps } from '../types';
import { CustomSections, standardRenderers } from '../body';
import { contactItems, renderSections, rhythm } from '../primitives';

/**
 * Elegant — hairline rules, wide letterspacing, a centred masthead.
 * Editorial in feel; reads well for communications, law, and academia.
 */
function ElegantTemplate({ resume }: TemplateProps) {
  const contacts = contactItems(resume);
  const options = {
    Heading: ({ children }: { children: React.ReactNode }) => (
      <h2
        data-block-heading
        style={{
          margin: `0 0 ${rhythm(2.5)}`,
          textAlign: 'center' as const,
          fontSize: '0.78em',
          fontWeight: 600,
          letterSpacing: '0.3em',
          textTransform: 'uppercase' as const,
          color: 'var(--accent-ink)',
        }}
      >
        {children}
      </h2>
    ),
    dateStyle: 'right' as const,
    sectionGap: 6.5,
    entryGap: 3,
    justifyProse: true,
    bulletMarker: '—',
  };

  return (
    <div style={{ padding: `${rhythm(12)} ${rhythm(13)}` }}>
      <header style={{ textAlign: 'center' }}>
        <div style={{ height: '1px', background: 'var(--accent-line)' }} />
        <h1
          style={{
            margin: `${rhythm(3)} 0 0`,
            fontSize: '2.15em',
            fontWeight: 400,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            lineHeight: 1.15,
          }}
        >
          {resume.profile.fullName || 'Your Name'}
        </h1>
        {resume.profile.headline ? (
          <p
            style={{
              margin: `${rhythm(1.5)} 0 0`,
              fontSize: '0.95em',
              fontStyle: 'italic',
              color: 'var(--accent-ink)',
            }}
          >
            {resume.profile.headline}
          </p>
        ) : null}
        <div style={{ height: '1px', background: 'var(--accent-line)', marginTop: rhythm(3) }} />
        {contacts.length > 0 ? (
          <p
            style={{
              margin: `${rhythm(2)} 0 0`,
              fontSize: '0.83em',
              letterSpacing: '0.04em',
              color: '#5a5a5a',
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

export default memo(ElegantTemplate);
