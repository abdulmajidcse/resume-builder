'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export interface SectionShellProps {
  title: string;
  description?: string;
  onAdd?: () => void;
  addLabel?: string;
  children: React.ReactNode;
}

/** Consistent frame for every editor section: heading, hint, content, add action. */
export function SectionShell({ title, description, onAdd, addLabel, children }: SectionShellProps) {
  return (
    <section className="animate-rise">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-[-0.01em] text-ink">
            {title}
          </h2>
          {description ? <p className="mt-1 text-[13px] text-ink-muted">{description}</p> : null}
        </div>
        {onAdd ? (
          <Button size="sm" onClick={onAdd} className="shrink-0">
            <Plus size={14} aria-hidden />
            {addLabel ?? 'Add'}
          </Button>
        ) : null}
      </div>
      {children}
    </section>
  );
}

/** Two-up field row that stacks on narrow panes. */
export function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

export function FieldStack({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-3">{children}</div>;
}
