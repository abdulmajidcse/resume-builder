import Link from 'next/link';
import { Logo } from '@/shared/ui/logo';

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <Logo />
      <h1 className="mt-8 font-display text-[2.5rem] font-semibold tracking-[-0.02em] text-ink">
        Page not found
      </h1>
      <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink-muted">
        That link does not lead anywhere. Your resume is safe — it is stored in this browser.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-lg border border-rule-strong bg-paper-raised px-5 text-[14px] font-medium text-ink transition-colors hover:border-ink-faint"
        >
          Home
        </Link>
        <Link
          href="/builder"
          className="inline-flex h-11 items-center rounded-lg bg-clay px-5 text-[14px] font-medium text-white transition-colors hover:bg-clay-deep"
        >
          Back to the editor
        </Link>
      </div>
    </main>
  );
}
