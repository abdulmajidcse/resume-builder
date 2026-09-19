import { cn } from '@/shared/lib/cn';

export interface LogoProps {
  className?: string;
  /** Lets tight layouts drop the wordmark and keep the mark. */
  wordmarkClassName?: string;
}

/** Wordmark. The stacked rules stand in for lines of a printed page. */
export function Logo({ className, wordmarkClassName }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        aria-hidden
        className="flex h-8 w-8 shrink-0 flex-col justify-center gap-[3px] rounded-[9px] bg-ink px-[7px]"
      >
        <span className="h-[2px] w-full rounded-full bg-clay" />
        <span className="h-[2px] w-full rounded-full bg-paper/70" />
        <span className="h-[2px] w-3/5 rounded-full bg-paper/40" />
      </span>
      <span
        className={cn(
          'font-display text-[19px] font-semibold leading-none tracking-[-0.015em] text-ink',
          wordmarkClassName,
        )}
      >
        Inkwell
      </span>
    </span>
  );
}
