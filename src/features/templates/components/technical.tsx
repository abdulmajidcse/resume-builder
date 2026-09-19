import { memo } from 'react';
import type { TemplateProps } from '../types';
import { CustomSections, standardRenderers } from '../body';
import { contactItems, renderSections, rhythm } from '../primitives';

/**
 * Technical — tight leading, monospaced labels, skills presented as a scannable
 * key/value block. Built for engineering résumés that carry a lot of detail.
 */
function TechnicalTemplate({ resume }: TemplateProps) {
  const contacts = contactItems(resume);
  const options = {
    Heading: ({ children }: { children: React.ReactNode }) => (
      <h2
        data-block-heading
        style={{
          margin: `0 0 ${rhythm(2)}`,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
          fontSize: '0.8em',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          color: 'var(--accent)',
        }}
      >
        <span style={{ opacity: 0.55 }}>{'// '}</span>
        {children}
      </h2>
    ),
    skillsStyle: 'stacked' as const,
    dateStyle: 'right' as const,
    sectionGap: 5,
    entryGap: 2.75,
    bulletMarker: '▸',
  };

  return (
    <div style={{ padding: `${rhythm(10)} ${rhythm(11)}` }}>
      <header
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: rhythm(3),
          paddingBottom: rhythm(3),
          borderBottom: '2px solid var(--accent)',
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: '2em',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            {resume.profile.fullName || 'Your Name'}
          </h1>
          {resume.profile.headline ? (
            <p
              style={{
                margin: `${rhythm(1)} 0 0`,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                fontSize: '0.88em',
                color: 'var(--accent-ink)',
              }}
            >
              {resume.profile.headline}
            </p>
          ) : null}
        </div>
        {contacts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gap: rhythm(0.5),
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
              fontSize: '0.78em',
              color: '#555',
              textAlign: 'right',
            }}
          >
            {contacts.map((item) => (
              <span key={item.key}>{item.text}</span>
            ))}
          </div>
        ) : null}
      </header>

      {renderSections(resume, standardRenderers(resume, options))}
      <CustomSections resume={resume} options={options} />
    </div>
  );
}

export default memo(TechnicalTemplate);
