'use client';

import { Check } from 'lucide-react';
import { TEMPLATES } from '@/features/templates/registry';
import { cn } from '@/shared/lib/cn';
import { useResumeStore } from '../store';
import { useResume } from '../hooks';
import { SectionShell } from './section-shell';

/**
 * Template switcher. Changing a template only changes `templateId`; the
 * document is untouched, so switching is free and reversible.
 */
export function TemplatePanel() {
  const resume = useResume();
  const update = useResumeStore((state) => state.update);

  return (
    <SectionShell
      title="Templates"
      description="Switch freely — your content never changes. Adopting a template also suggests its accent colour."
    >
      <ul className="grid grid-cols-2 gap-3">
        {TEMPLATES.map((template) => {
          const active = template.id === resume.templateId;
          return (
            <li key={template.id}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() =>
                  update((draft) => {
                    draft.templateId = template.id;
                    draft.theme.accent = template.defaultAccent;
                  })
                }
                className={cn(
                  'group w-full rounded-xl border p-3 text-left transition-all duration-150',
                  active
                    ? 'border-clay bg-clay-soft/50 shadow-raised'
                    : 'border-rule bg-paper-raised hover:border-rule-strong hover:shadow-raised',
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="flex h-6 w-6 overflow-hidden rounded-md ring-1 ring-black/10"
                      style={{ background: template.swatch[1] }}
                    >
                      <span className="h-full w-1/3" style={{ background: template.swatch[0] }} />
                    </span>
                    <span className="text-sm font-semibold text-ink">{template.name}</span>
                  </span>
                  {active ? <Check size={15} aria-hidden className="text-clay" /> : null}
                </span>
                <span className="mt-1.5 block text-[12px] leading-snug text-ink-muted">
                  {template.description}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}
