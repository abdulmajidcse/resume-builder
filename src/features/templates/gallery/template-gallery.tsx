'use client';

import { useState } from 'react';
import { TEMPLATES } from '../registry';
import type { TemplateCategory } from '../types';
import { cn } from '@/shared/lib/cn';
import { TemplateCard } from './template-card';

const FILTERS: ReadonlyArray<{ value: TemplateCategory | 'all'; label: string }> = [
  { value: 'all', label: 'All templates' },
  { value: 'classic', label: 'Classic' },
  { value: 'modern', label: 'Modern' },
  { value: 'creative', label: 'Creative' },
  { value: 'academic', label: 'Academic' },
];

export function TemplateGallery() {
  const [filter, setFilter] = useState<TemplateCategory | 'all'>('all');
  const visible = filter === 'all' ? TEMPLATES : TEMPLATES.filter((t) => t.category === filter);

  return (
    <div>
      <div role="tablist" aria-label="Filter templates" className="mb-8 flex flex-wrap gap-2">
        {FILTERS.map((option) => {
          const active = option.value === filter;
          return (
            <button
              key={option.value}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => setFilter(option.value)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors duration-150',
                active
                  ? 'border-ink bg-ink text-paper'
                  : 'border-rule-strong bg-paper-raised text-ink-muted hover:border-ink-faint hover:text-ink',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}
