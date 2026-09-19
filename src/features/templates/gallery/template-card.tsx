'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { createSampleResume } from '@/entities/resume';
import type { TemplateDefinition } from '../types';
import { ResumePreview } from '@/features/export/resume-preview';
import { Badge } from '@/shared/ui/surface';

export interface TemplateCardProps {
  template: TemplateDefinition;
  priority?: boolean;
}

/**
 * Gallery card. The thumbnail is the real template rendering real data — not a
 * screenshot — so it can never go stale relative to the template itself.
 */
export function TemplateCard({ template }: TemplateCardProps) {
  const resume = useMemo(() => {
    const sample = createSampleResume(template.id);
    sample.theme.accent = template.defaultAccent;
    return sample;
  }, [template.id, template.defaultAccent]);

  return (
    <article className="group flex flex-col">
      <Link
        href={`/builder?template=${template.id}&start=sample`}
        className="relative block overflow-hidden rounded-card border border-rule bg-white transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-float"
        aria-label={`Use the ${template.name} template`}
      >
        <div className="pointer-events-none select-none p-3">
          <ResumePreview resume={resume} clipToPage />
        </div>
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-ink/85 py-2.5 text-[13px] font-medium text-paper opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Use this template
        </span>
      </Link>

      <div className="mt-3.5 px-0.5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-[17px] font-semibold tracking-[-0.01em] text-ink">
            {template.name}
          </h3>
          <span
            aria-hidden
            className="h-3 w-3 shrink-0 rounded-full ring-1 ring-black/10"
            style={{ background: template.defaultAccent }}
          />
        </div>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">{template.description}</p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {template.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>
    </article>
  );
}
