import { memo } from 'react';
import type { TemplateProps } from '../types';
import { CustomSections, standardRenderers } from '../body';
import { contactItems, renderSections, rhythm } from '../primitives';

/**
 * Classic — centred header, ruled headings, single column.
 * The conservative default: unambiguous structure, parses cleanly in ATS.
 */
function ClassicTemplate({ resume }: TemplateProps) {
  const contacts = contactItems(resume);
  const options = {
    Heading: ({ children }: { children: React.ReactNode }) => (
      <h2
        data-block-heading
        style={{
          margin: `0 0 ${rhythm(2)}`,
          paddingBottom: rhythm(1),
          borderBottom: '1px solid var(--accent-line)',
          color: 'var(--accent-ink)',
          fontSize: '0.95em',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
        }}
      >
        {children}
      </h2>
    ),
    justifyProse: true,
  };

  return (
    <div style={{ padding: rhythm(12) }}>
      <header style={{ textAlign: 'center', paddingBottom: rhythm(4) }}>
        <h1
          style={{
            margin: 0,
            fontSize: '2.1em',
            fontWeight: 700,
            letterSpacing: '0.01em',
            lineHeight: 1.1,
          }}
        >
          {resume.profile.fullName || 'Your Name'}
        </h1>
        {resume.profile.headline ? (
          <p
            style={{ margin: `${rhythm(1.5)} 0 0`, color: 'var(--accent-ink)', fontSize: '1.02em' }}
          >
            {resume.profile.headline}
          </p>
        ) : null}
        {contacts.length > 0 ? (
          <p
            style={{
              margin: `${rhythm(2)} 0 0`,
              fontSize: '0.87em',
              color: '#4b4b4b',
              lineHeight: 1.7,
            }}
          >
            {contacts.map((item, index) => (
              <span key={item.key}>
                {index > 0 ? <span style={{ color: 'var(--accent-line)' }}> | </span> : null}
                {item.text}
              </span>
            ))}
          </p>
        ) : null}
      </header>

      <div style={{ borderTop: '2px solid var(--accent)' }} />

      {renderSections(resume, standardRenderers(resume, options))}
      <CustomSections resume={resume} options={options} />
    </div>
  );
}

export default memo(ClassicTemplate);
