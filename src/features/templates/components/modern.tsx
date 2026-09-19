import { memo } from 'react';
import type { TemplateProps } from '../types';
import { CustomSections, standardRenderers } from '../body';
import { contactItems, renderSections, rhythm } from '../primitives';

/**
 * Modern — a tinted header band with the name reversed out of the accent.
 * Reads current without being decorative; good for product and design roles.
 */
function ModernTemplate({ resume }: TemplateProps) {
  const contacts = contactItems(resume);
  const options = {
    Heading: ({ children }: { children: React.ReactNode }) => (
      <h2
        data-block-heading
        style={{
          margin: `0 0 ${rhythm(2)}`,
          fontSize: '0.9em',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase' as const,
          color: 'var(--accent)',
        }}
      >
        {children}
      </h2>
    ),
    skillsStyle: 'chips' as const,
    dateStyle: 'right' as const,
  };

  return (
    <div>
      <header
        style={{
          background: 'var(--accent)',
          color: '#ffffff',
          padding: `${rhythm(9)} ${rhythm(11)}`,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '2.25em',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}
        >
          {resume.profile.fullName || 'Your Name'}
        </h1>
        {resume.profile.headline ? (
          <p style={{ margin: `${rhythm(1.5)} 0 0`, fontSize: '1.05em', opacity: 0.92 }}>
            {resume.profile.headline}
          </p>
        ) : null}
        {contacts.length > 0 ? (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: `${rhythm(1)} ${rhythm(3.5)}`,
              marginTop: rhythm(3),
              fontSize: '0.85em',
              opacity: 0.9,
            }}
          >
            {contacts.map((item) => (
              <span key={item.key}>{item.text}</span>
            ))}
          </div>
        ) : null}
      </header>

      <div style={{ padding: `${rhythm(4)} ${rhythm(11)} ${rhythm(11)}` }}>
        {renderSections(resume, standardRenderers(resume, options))}
        <CustomSections resume={resume} options={options} />
      </div>
    </div>
  );
}

export default memo(ModernTemplate);
