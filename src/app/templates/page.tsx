import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { TEMPLATES } from '@/features/templates/registry';
import { TemplateGallery } from '@/features/templates/gallery/template-gallery';
import { Logo } from '@/shared/ui/logo';

export const metadata: Metadata = {
  title: 'Resume templates',
  description: `Browse ${TEMPLATES.length} print-ready resume and CV templates. Pick one and start editing — no account needed.`,
};

export default function TemplatesPage() {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-rule">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" aria-label="Inkwell home">
            <Logo />
          </Link>
          <Link
            href="/builder?start=blank"
            className="rounded-lg bg-ink px-4 py-2 text-[14px] font-medium text-paper transition-colors hover:bg-ink/90"
          >
            Start from blank
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft size={14} aria-hidden />
          Back
        </Link>

        <h1 className="mt-5 font-display text-[clamp(2.1rem,4.5vw,3rem)] font-semibold leading-tight tracking-[-0.025em] text-ink">
          {TEMPLATES.length} templates, every one print-ready
        </h1>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-muted">
          Each preview below is the live template rendering sample content — not a screenshot. Pick
          one to open it in the editor with the example already filled in, then replace it line by
          line.
        </p>

        <div className="mt-12">
          <TemplateGallery />
        </div>
      </main>
    </div>
  );
}
