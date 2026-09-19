import { memo } from 'react';
import type { SectionId } from '@/entities/resume';
import type { TemplateProps } from '../types';
import { CustomSections, standardRenderers } from '../body';
import { contactItems, renderSelected, rhythm } from '../primitives';

const ASIDE: readonly SectionId[] = ['skills', 'languages', 'certifications'];
const MAIN: readonly SectionId[] = ['summary', 'experience', 'education', 'projects', 'awards'];

/**
 * Bold — a deep accent rail on the left with reversed type, and a large
 * masthead. High contrast, confident; suits design and brand-facing roles.
 */
function BoldTemplate({ resume }: TemplateProps) {
  const contacts = contactItems(resume);

  const MainHeading = ({ children }: { children: React.ReactNode }) => (
    <h2
      data-block-heading
      style={{
        margin: `0 0 ${rhythm(2)}`,
        fontSize: '1.02em',
        fontWeight: 800,
        letterSpacing: '-0.01em',
        color: 'var(--accent-ink)',
      }}
    >
      {children}
    </h2>
  );

  const AsideHeading = ({ children }: { children: React.ReactNode }) => (
    <h2
      data-block-heading
      style={{
        margin: `0 0 ${rhythm(1.5)}`,
        paddingBottom: rhythm(0.75),
        borderBottom: '1px solid rgba(255,255,255,0.28)',
        fontSize: '0.76em',
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase' as const,
        color: 'rgba(255,255,255,0.92)',
      }}
    >
      {children}
    </h2>
  );

  const options = {
    Heading: MainHeading,
    sectionGap: 5.5,
    entryGap: 3,
    dateStyle: 'under' as const,
  };
  const asideOptions = {
    Heading: AsideHeading,
    sectionGap: 4.5,
    entryGap: 1.5,
    skillsStyle: 'stacked' as const,
    dateStyle: 'under' as const,
    mutedColor: 'rgba(255,255,255,0.72)',
    metaColor: 'rgba(255,255,255,0.9)',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100%' }}>
      <aside
        className="sections-flush"
        style={{
          width: '32%',
          background: 'var(--accent)',
          color: '#ffffff',
          padding: `${rhythm(9)} ${rhythm(5)}`,
        }}
      >
        {contacts.length > 0 ? (
          <section>
            <AsideHeading>Contact</AsideHeading>
            <div
              style={{
                display: 'grid',
                gap: rhythm(1),
                fontSize: '0.83em',
                wordBreak: 'break-word',
                opacity: 0.92,
              }}
            >
              {contacts.map((item) => (
                <span key={item.key}>{item.text}</span>
              ))}
            </div>
          </section>
        ) : null}
        {renderSelected(resume, standardRenderers(resume, asideOptions), ASIDE)}
      </aside>

      <main style={{ flex: 1, padding: `${rhythm(9)} ${rhythm(8)}`, minWidth: 0 }}>
        <header style={{ marginBottom: rhythm(2) }}>
          <h1
            style={{
              margin: 0,
              fontSize: '2.5em',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.035em',
            }}
          >
            {resume.profile.fullName || 'Your Name'}
          </h1>
          {resume.profile.headline ? (
            <p
              style={{
                margin: `${rhythm(1.5)} 0 0`,
                fontSize: '0.95em',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
              }}
            >
              {resume.profile.headline}
            </p>
          ) : null}
        </header>
        {renderSelected(resume, standardRenderers(resume, options), MAIN)}
        <CustomSections resume={resume} options={options} />
      </main>
    </div>
  );
}

export default memo(BoldTemplate);
