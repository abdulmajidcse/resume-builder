import { memo } from 'react';
import type { SectionId } from '@/entities/resume';
import type { TemplateProps } from '../types';
import { CustomSections, standardRenderers } from '../body';
import { contactItems, renderSelected, rhythm } from '../primitives';

const ASIDE: readonly SectionId[] = ['skills', 'certifications', 'languages', 'awards'];
const MAIN: readonly SectionId[] = ['summary', 'experience', 'education', 'projects'];

/**
 * Compact — a narrow supporting rail beside the main narrative, tuned to fit a
 * long history onto one page without dropping content.
 */
function CompactTemplate({ resume }: TemplateProps) {
  const contacts = contactItems(resume);

  const MainHeading = ({ children }: { children: React.ReactNode }) => (
    <h2
      data-block-heading
      style={{
        margin: `0 0 ${rhythm(1.5)}`,
        paddingBottom: rhythm(0.75),
        borderBottom: '1px solid var(--accent-line)',
        fontSize: '0.82em',
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase' as const,
        color: 'var(--accent-ink)',
      }}
    >
      {children}
    </h2>
  );

  const options = {
    Heading: MainHeading,
    sectionGap: 4,
    entryGap: 2.5,
    dateStyle: 'right' as const,
  };
  const asideOptions = {
    Heading: MainHeading,
    sectionGap: 4,
    entryGap: 1.5,
    skillsStyle: 'stacked' as const,
    dateStyle: 'under' as const,
    mutedColor: '#666',
  };

  return (
    <div style={{ padding: `${rhythm(9)} ${rhythm(9)}` }}>
      <header style={{ paddingBottom: rhythm(3), borderBottom: '2px solid var(--accent)' }}>
        <div
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: rhythm(2.5) }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '1.85em',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.015em',
            }}
          >
            {resume.profile.fullName || 'Your Name'}
          </h1>
          {resume.profile.headline ? (
            <p style={{ margin: 0, fontSize: '0.95em', color: 'var(--accent-ink)' }}>
              {resume.profile.headline}
            </p>
          ) : null}
        </div>
        {contacts.length > 0 ? (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: `${rhythm(0.5)} ${rhythm(3)}`,
              marginTop: rhythm(1.5),
              fontSize: '0.82em',
              color: '#555',
            }}
          >
            {contacts.map((item) => (
              <span key={item.key}>{item.text}</span>
            ))}
          </div>
        ) : null}
      </header>

      <div style={{ display: 'flex', gap: rhythm(7), marginTop: rhythm(5) }}>
        <main className="sections-flush" style={{ flex: '1 1 64%', minWidth: 0 }}>
          {renderSelected(resume, standardRenderers(resume, options), MAIN)}
          <CustomSections resume={resume} options={options} />
        </main>
        <aside className="sections-flush" style={{ flex: '1 1 30%', minWidth: 0 }}>
          {renderSelected(resume, standardRenderers(resume, asideOptions), ASIDE)}
        </aside>
      </div>
    </div>
  );
}

export default memo(CompactTemplate);
