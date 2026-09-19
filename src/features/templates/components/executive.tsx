import { memo } from 'react';
import type { TemplateProps } from '../types';
import { CustomSections, standardRenderers } from '../body';
import { contactItems, renderSections, rhythm } from '../primitives';

/**
 * Executive — an accent rule anchors a left-aligned masthead. Restrained and
 * senior in tone; suits leadership and long-tenure histories.
 */
function ExecutiveTemplate({ resume }: TemplateProps) {
  const contacts = contactItems(resume);
  const options = {
    Heading: ({ children }: { children: React.ReactNode }) => (
      <h2
        data-block-heading
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: rhythm(2),
          margin: `0 0 ${rhythm(2.5)}`,
          fontSize: '0.82em',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase' as const,
          color: 'var(--accent-ink)',
        }}
      >
        {children}
        <span style={{ flex: 1, height: '1px', background: 'var(--accent-line)' }} />
      </h2>
    ),
    entryGap: 3.5,
  };

  return (
    <div style={{ padding: `${rhythm(11)} ${rhythm(12)}` }}>
      <header style={{ borderLeft: '4px solid var(--accent)', paddingLeft: rhythm(4) }}>
        <h1
          style={{
            margin: 0,
            fontSize: '2.3em',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.015em',
          }}
        >
          {resume.profile.fullName || 'Your Name'}
        </h1>
        {resume.profile.headline ? (
          <p
            style={{
              margin: `${rhythm(1.5)} 0 0`,
              fontSize: '1.05em',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              fontWeight: 600,
            }}
          >
            {resume.profile.headline}
          </p>
        ) : null}
      </header>

      {contacts.length > 0 ? (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: `${rhythm(1)} ${rhythm(4)}`,
            marginTop: rhythm(4),
            paddingTop: rhythm(3),
            borderTop: '1px solid var(--accent-line)',
            fontSize: '0.87em',
            color: '#4b4b4b',
          }}
        >
          {contacts.map((item) => (
            <span key={item.key}>{item.text}</span>
          ))}
        </div>
      ) : null}

      {renderSections(resume, standardRenderers(resume, options))}
      <CustomSections resume={resume} options={options} />
    </div>
  );
}

export default memo(ExecutiveTemplate);
