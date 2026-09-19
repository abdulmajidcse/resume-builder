import { memo } from 'react';
import type { SectionId } from '@/entities/resume';
import type { TemplateProps } from '../types';
import { CustomSections, standardRenderers } from '../body';
import { contactItems, renderSelected, rhythm } from '../primitives';

const ASIDE: readonly SectionId[] = ['skills', 'languages', 'certifications'];
const MAIN: readonly SectionId[] = ['summary', 'experience', 'education', 'projects', 'awards'];

/**
 * Creative — a tinted sidebar carries identity and supporting detail while the
 * main column keeps the narrative. Two columns, one page, clear priority.
 */
function CreativeTemplate({ resume }: TemplateProps) {
  const contacts = contactItems(resume);

  const MainHeading = ({ children }: { children: React.ReactNode }) => (
    <h2
      data-block-heading
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: rhythm(1.5),
        margin: `0 0 ${rhythm(2)}`,
        fontSize: '0.88em',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: 'var(--accent-ink)',
      }}
    >
      <span style={{ width: rhythm(3), height: '2px', background: 'var(--accent)' }} />
      {children}
    </h2>
  );

  const AsideHeading = ({ children }: { children: React.ReactNode }) => (
    <h2
      data-block-heading
      style={{
        margin: `0 0 ${rhythm(1.5)}`,
        fontSize: '0.78em',
        fontWeight: 700,
        letterSpacing: '0.16em',
        textTransform: 'uppercase' as const,
        color: 'var(--accent-ink)',
      }}
    >
      {children}
    </h2>
  );

  const options = { Heading: MainHeading, sectionGap: 5.5, entryGap: 3 };
  const asideOptions = {
    Heading: AsideHeading,
    sectionGap: 4.5,
    skillsStyle: 'stacked' as const,
    mutedColor: '#5a5a5a',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100%' }}>
      <aside
        style={{
          width: '33%',
          background: 'var(--accent-soft)',
          padding: `${rhythm(9)} ${rhythm(5)}`,
          borderRight: '1px solid var(--accent-line)',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '1.65em',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
          }}
        >
          {resume.profile.fullName || 'Your Name'}
        </h1>
        {resume.profile.headline ? (
          <p
            style={{ margin: `${rhythm(1.5)} 0 0`, fontSize: '0.92em', color: 'var(--accent-ink)' }}
          >
            {resume.profile.headline}
          </p>
        ) : null}

        {contacts.length > 0 ? (
          <section style={{ marginTop: rhythm(5) }}>
            <AsideHeading>Contact</AsideHeading>
            <div
              style={{
                display: 'grid',
                gap: rhythm(1),
                fontSize: '0.84em',
                color: '#4f4f4f',
                wordBreak: 'break-word',
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

      <main className="sections-flush" style={{ flex: 1, padding: `${rhythm(9)} ${rhythm(8)}` }}>
        {renderSelected(resume, standardRenderers(resume, options), MAIN)}
        <CustomSections resume={resume} options={options} />
      </main>
    </div>
  );
}

export default memo(CreativeTemplate);
