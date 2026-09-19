import * as React from 'react';
import { cn } from '@/shared/lib/cn';

export function Panel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-card border border-rule bg-paper-raised shadow-raised', className)}
      {...props}
    />
  );
}

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-rule-strong bg-paper-raised px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-ink-muted',
        className,
      )}
      {...props}
    />
  );
}

export interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (value: T) => void;
  className?: string;
}

/** Compact single-choice control used throughout the design panel. */
export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: SegmentedProps<T>) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-faint">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-label={label}
        className="flex rounded-lg border border-rule bg-paper p-0.5"
      >
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.value)}
              className={cn(
                'flex-1 rounded-[6px] px-2 py-1.5 text-[12px] font-medium transition-colors duration-150',
                active
                  ? 'bg-paper-raised text-ink shadow-sm'
                  : 'text-ink-faint hover:text-ink-muted',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
