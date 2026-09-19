import Link from 'next/link';
import { ArrowRight, FileDown, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { TEMPLATES } from '@/features/templates/registry';
import { Logo } from '@/shared/ui/logo';
import { Badge } from '@/shared/ui/surface';
import { HeroPreview } from './hero-preview';

const STEPS = [
  {
    title: 'Pick a template',
    body: 'Ten layouts, from conservative and ATS-safe to bold two-column. Switch any time without touching your content.',
  },
  {
    title: 'Fill in the details',
    body: 'Type on the left, watch the page compose itself on the right. Reorder, rename or hide any section.',
  },
  {
    title: 'Download the PDF',
    body: 'One click, real text — not an image. Selectable, searchable, and around fifty kilobytes.',
  },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Nothing leaves your browser',
    body: 'No account, no upload, no server storing your employment history. Your resume lives in local storage, and you can export it as JSON whenever you want a backup.',
  },
  {
    icon: Layers,
    title: 'Ten templates, one document',
    body: 'Templates are pure layouts over the same content, so trying a different look costs you a single click and never risks your words.',
  },
  {
    icon: FileDown,
    title: 'Print-accurate export',
    body: 'The preview is the printed page — the same component, at the same size. What you see is genuinely what you get.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/templates"
            className="rounded-lg px-3 py-2 text-[14px] font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Templates
          </Link>
          <Link
            href="/builder?start=blank"
            className="rounded-lg bg-ink px-4 py-2 text-[14px] font-medium text-paper transition-colors hover:bg-ink/90"
          >
            Start building
          </Link>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="paper-grain relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-28 lg:pt-16">
            <div className="animate-rise">
              <Badge className="border-clay/30 bg-clay-soft text-clay-deep">
                <Sparkles size={12} aria-hidden />
                Free · No sign-up · Private
              </Badge>

              <h1 className="mt-5 font-display text-[clamp(2.6rem,6vw,4.1rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-ink">
                A resume worth
                <br />
                <span className="text-clay">reading twice.</span>
              </h1>

              <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-muted">
                Ten carefully set templates, a live editor that shows the real printed page, and a
                one-click PDF. Start from a blank sheet or an example — either way it takes minutes,
                and nothing you type ever leaves this device.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/builder?start=blank"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-clay px-6 text-[15px] font-medium text-white shadow-raised transition-colors hover:bg-clay-deep"
                >
                  Build my resume
                  <ArrowRight
                    size={17}
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  href="/templates"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-rule-strong bg-paper-raised px-6 text-[15px] font-medium text-ink transition-colors hover:border-ink-faint"
                >
                  Browse {TEMPLATES.length} templates
                </Link>
              </div>

              <p className="mt-5 text-[13px] text-ink-faint">
                Works offline after first load · Exports selectable-text PDFs · A4 and Letter
              </p>
            </div>

            <div className="animate-rise lg:pl-4">
              <HeroPreview />
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="border-y border-rule bg-paper-raised/60">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
            <h2 className="font-display text-[clamp(1.7rem,3vw,2.2rem)] font-semibold tracking-[-0.02em] text-ink">
              Three steps, start to PDF
            </h2>
            <ol className="mt-10 grid gap-8 sm:grid-cols-3">
              {STEPS.map((step, index) => (
                <li key={step.title}>
                  <span className="font-display text-[2.4rem] font-semibold leading-none text-clay/25">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 text-[17px] font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-10 sm:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title}>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-clay-soft text-clay-deep">
                    <Icon size={19} aria-hidden />
                  </span>
                  <h3 className="mt-4 text-[17px] font-semibold text-ink">{feature.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">{feature.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
          <div className="rounded-card border border-rule bg-ink px-8 py-14 text-center sm:px-14">
            <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.5rem)] font-semibold leading-tight tracking-[-0.02em] text-paper">
              Your next role is one page away.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-paper/70">
              Open a blank sheet, or start from an example and replace it line by line.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/builder?start=blank"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-paper px-6 text-[15px] font-medium text-ink transition-transform hover:-translate-y-0.5"
              >
                Start from blank
              </Link>
              <Link
                href="/builder?start=sample"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-paper/25 px-6 text-[15px] font-medium text-paper transition-colors hover:bg-paper/10"
              >
                Start from an example
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-rule">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8">
          <Logo />
          <p className="text-[13px] text-ink-faint">
            Built with Next.js. Your data stays on your device.
          </p>
        </div>
      </footer>
    </div>
  );
}
