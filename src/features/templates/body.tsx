import * as React from 'react';
import type { Resume } from '@/entities/resume';
import type { SectionRenderers } from './primitives';
import {
  Bullets,
  cleanHighlights,
  joinParts,
  nonEmptyCustomSections,
  rhythm,
  sectionTitle,
} from './primitives';
import { experienceDateRange, formatDateRange } from '@/shared/lib/format';

/**
 * Shared section bodies.
 *
 * Templates differ in *design* — header composition, heading treatment, column
 * structure — far more than in how a job entry is laid out. Those bodies live
 * here once and are parameterised, so adding a template means writing a header
 * and a heading style, not re-deriving every section.
 */

export type HeadingComponent = React.ComponentType<{ children: React.ReactNode }>;

export interface BodyOptions {
  Heading: HeadingComponent;
  /** Date placement relative to the entry title. */
  dateStyle?: 'right' | 'under';
  /** How skill groups are presented. */
  skillsStyle?: 'inline' | 'chips' | 'stacked';
  /** Space above each section. */
  sectionGap?: number;
  /** Space between entries within a section. */
  entryGap?: number;
  justifyProse?: boolean;
  /** Muted text colour, so dark-backed templates can invert it. */
  mutedColor?: string;
  /** Colour of the company/issuer line. Defaults to the accent. */
  metaColor?: string;
  bulletMarker?: string;
}

interface Resolved extends Required<Omit<BodyOptions, 'Heading'>> {
  Heading: HeadingComponent;
}

function resolve(options: BodyOptions): Resolved {
  return {
    Heading: options.Heading,
    dateStyle: options.dateStyle ?? 'right',
    skillsStyle: options.skillsStyle ?? 'inline',
    sectionGap: options.sectionGap ?? 6,
    entryGap: options.entryGap ?? 3,
    justifyProse: options.justifyProse ?? false,
    mutedColor: options.mutedColor ?? '#5c5c5c',
    metaColor: options.metaColor ?? 'var(--accent-ink)',
    bulletMarker: options.bulletMarker ?? '•',
  };
}

function EntryHead({
  title,
  meta,
  date,
  options,
}: {
  title: React.ReactNode;
  meta?: React.ReactNode;
  date?: string;
  options: Resolved;
}) {
  const dateNode = date ? (
    <span style={{ fontSize: '0.85em', color: options.mutedColor, whiteSpace: 'nowrap' }}>
      {date}
    </span>
  ) : null;

  if (options.dateStyle === 'under') {
    return (
      <div>
        <h3 style={{ margin: 0, fontSize: '1.02em', fontWeight: 700, lineHeight: 1.3 }}>{title}</h3>
        <p style={{ margin: `${rhythm(0.5)} 0 0`, fontSize: '0.9em', color: options.metaColor }}>
          {meta}
          {meta && date ? <span style={{ color: options.mutedColor }}>{'  ·  '}</span> : null}
          {dateNode}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: rhythm(4),
        }}
      >
        <h3 style={{ margin: 0, fontSize: '1.02em', fontWeight: 700, lineHeight: 1.3 }}>{title}</h3>
        {dateNode}
      </div>
      {meta ? (
        <p style={{ margin: `${rhythm(0.5)} 0 0`, fontSize: '0.9em', color: options.metaColor }}>
          {meta}
        </p>
      ) : null}
    </div>
  );
}

function Chips({ items, muted }: { items: string[]; muted: string }) {
  if (items.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: rhythm(1.25), marginTop: rhythm(1) }}>
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          style={{
            border: '1px solid var(--accent-line)',
            background: 'var(--accent-soft)',
            borderRadius: '999px',
            padding: '0.15em 0.7em',
            fontSize: '0.82em',
            color: muted,
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

/** Section bodies keyed by section id, ready to hand to `renderSections`. */
export function standardRenderers(resume: Resume, rawOptions: BodyOptions): SectionRenderers {
  const options = resolve(rawOptions);
  const { Heading } = options;

  const Section = ({ children }: { children: React.ReactNode }) => (
    <section style={{ marginTop: rhythm(options.sectionGap) }}>{children}</section>
  );

  const entryStyle = { marginTop: rhythm(options.entryGap) } as React.CSSProperties;

  return {
    summary: () => (
      <Section>
        <Heading>{sectionTitle(resume, 'summary')}</Heading>
        <p style={{ margin: 0, textAlign: options.justifyProse ? 'justify' : 'left' }}>
          {resume.profile.summary}
        </p>
      </Section>
    ),

    experience: () => (
      <Section>
        <Heading>{sectionTitle(resume, 'experience')}</Heading>
        {resume.experience.map((item) => (
          <article key={item.id} data-block style={entryStyle}>
            <EntryHead
              title={item.role}
              meta={joinParts([item.company, item.location], ' · ')}
              date={experienceDateRange(item)}
              options={options}
            />
            <Bullets
              items={cleanHighlights(item.highlights)}
              marker={options.bulletMarker}
              style={{ marginTop: rhythm(1.5), fontSize: '0.95em' }}
            />
          </article>
        ))}
      </Section>
    ),

    education: () => (
      <Section>
        <Heading>{sectionTitle(resume, 'education')}</Heading>
        {resume.education.map((item) => (
          <article key={item.id} data-block style={entryStyle}>
            <EntryHead
              title={item.degree}
              meta={joinParts([item.institution, item.location, item.grade], ' · ')}
              date={formatDateRange(item.startDate, item.endDate)}
              options={options}
            />
            {item.details ? (
              <p style={{ margin: `${rhythm(1)} 0 0`, fontSize: '0.93em' }}>{item.details}</p>
            ) : null}
          </article>
        ))}
      </Section>
    ),

    projects: () => (
      <Section>
        <Heading>{sectionTitle(resume, 'projects')}</Heading>
        {resume.projects.map((item) => (
          <article key={item.id} data-block style={entryStyle}>
            <EntryHead
              title={joinParts([item.name, item.role], ' — ')}
              meta={item.url || undefined}
              date={formatDateRange(item.startDate, item.endDate)}
              options={options}
            />
            {item.description ? (
              <p style={{ margin: `${rhythm(1)} 0 0`, fontSize: '0.95em' }}>{item.description}</p>
            ) : null}
            {item.technologies.length > 0 ? (
              options.skillsStyle === 'chips' ? (
                <Chips items={item.technologies} muted={options.mutedColor} />
              ) : (
                <p
                  style={{
                    margin: `${rhythm(0.75)} 0 0`,
                    fontSize: '0.85em',
                    color: 'var(--accent-ink)',
                  }}
                >
                  {item.technologies.join(' · ')}
                </p>
              )
            ) : null}
          </article>
        ))}
      </Section>
    ),

    skills: () => (
      <Section>
        <Heading>{sectionTitle(resume, 'skills')}</Heading>
        {resume.skills.map((group) => {
          if (options.skillsStyle === 'chips') {
            return (
              <div key={group.id} data-block style={{ marginTop: rhythm(1.5) }}>
                {group.category ? (
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.85em',
                      fontWeight: 600,
                      color: options.metaColor,
                    }}
                  >
                    {group.category}
                  </p>
                ) : null}
                <Chips items={group.items} muted={options.mutedColor} />
              </div>
            );
          }
          if (options.skillsStyle === 'stacked') {
            return (
              <div key={group.id} data-block style={{ marginTop: rhythm(1.5) }}>
                {group.category ? (
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.85em',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {group.category}
                  </p>
                ) : null}
                <p
                  style={{
                    margin: `${rhythm(0.5)} 0 0`,
                    fontSize: '0.93em',
                    color: options.mutedColor,
                  }}
                >
                  {group.items.join(', ')}
                </p>
              </div>
            );
          }
          return (
            <p
              key={group.id}
              data-block
              style={{ margin: `${rhythm(1.5)} 0 0`, fontSize: '0.95em' }}
            >
              {group.category ? <strong>{group.category}: </strong> : null}
              {group.items.join(', ')}
            </p>
          );
        })}
      </Section>
    ),

    certifications: () => (
      <Section>
        <Heading>{sectionTitle(resume, 'certifications')}</Heading>
        {resume.certifications.map((item) => (
          <div key={item.id} data-block style={{ marginTop: rhythm(1.5) }}>
            <EntryHead title={item.name} meta={item.issuer} date={item.date} options={options} />
          </div>
        ))}
      </Section>
    ),

    languages: () => (
      <Section>
        <Heading>{sectionTitle(resume, 'languages')}</Heading>
        <p style={{ margin: 0, fontSize: '0.95em' }}>
          {resume.languages
            .map((item) => joinParts([item.name, item.proficiency], ' — '))
            .filter(Boolean)
            .join('   ·   ')}
        </p>
      </Section>
    ),

    awards: () => (
      <Section>
        <Heading>{sectionTitle(resume, 'awards')}</Heading>
        {resume.awards.map((item) => (
          <div key={item.id} data-block style={{ marginTop: rhythm(1.5) }}>
            <EntryHead title={item.title} meta={item.issuer} date={item.date} options={options} />
            {item.description ? (
              <p style={{ margin: `${rhythm(0.75)} 0 0`, fontSize: '0.93em' }}>
                {item.description}
              </p>
            ) : null}
          </div>
        ))}
      </Section>
    ),
  };
}

/** User-defined sections always print after the built-in ones. */
export function CustomSections({ resume, options: raw }: { resume: Resume; options: BodyOptions }) {
  const options = resolve(raw);
  const { Heading } = options;
  return (
    <>
      {nonEmptyCustomSections(resume).map((section) => (
        <section key={section.id} style={{ marginTop: rhythm(options.sectionGap) }}>
          <Heading>{section.title}</Heading>
          {section.entries.map((entry) => (
            <article key={entry.id} data-block style={{ marginTop: rhythm(options.entryGap) }}>
              <EntryHead
                title={entry.title}
                meta={entry.subtitle}
                date={entry.date}
                options={options}
              />
              {entry.description ? (
                <p style={{ margin: `${rhythm(1)} 0 0`, fontSize: '0.95em' }}>
                  {entry.description}
                </p>
              ) : null}
            </article>
          ))}
        </section>
      ))}
    </>
  );
}
