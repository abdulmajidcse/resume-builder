'use client';

import { DENSITIES, FONT_FAMILIES, PAGE_FORMATS } from '@/entities/resume';
import type { Density, FontFamily, PageFormat } from '@/entities/resume';
import { Segmented } from '@/shared/ui/surface';
import { useResumeStore } from '../store';
import { useResume } from '../hooks';
import { SectionShell } from './section-shell';
import { cn } from '@/shared/lib/cn';

/** Curated accents. Each is dark enough to stay legible printed in greyscale. */
const ACCENTS = [
  '#1f3a5f',
  '#2563a8',
  '#0f766e',
  '#1f5f4d',
  '#4a4a4a',
  '#2f3e46',
  '#6b4b3e',
  '#b4522d',
  '#9a3f6b',
  '#5b4b8a',
] as const;

const FONT_LABELS: Record<FontFamily, string> = { sans: 'Sans', serif: 'Serif', mono: 'Mono' };
const DENSITY_LABELS: Record<Density, string> = {
  compact: 'Compact',
  normal: 'Normal',
  relaxed: 'Relaxed',
};

export function DesignPanel() {
  const { theme } = useResume();
  const setTheme = useResumeStore((state) => state.setTheme);

  return (
    <SectionShell
      title="Design"
      description="Typography and colour apply to every template, so you can switch layouts without losing your look."
    >
      <div className="flex flex-col gap-6">
        <div>
          <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-faint">
            Accent colour
          </span>
          <div className="flex flex-wrap gap-2">
            {ACCENTS.map((accent) => {
              const active = theme.accent.toLowerCase() === accent;
              return (
                <button
                  key={accent}
                  type="button"
                  aria-label={`Accent ${accent}`}
                  aria-pressed={active}
                  onClick={() => setTheme({ accent })}
                  style={{ backgroundColor: accent }}
                  className={cn(
                    'h-8 w-8 rounded-full transition-transform duration-150 hover:scale-110',
                    active
                      ? 'ring-2 ring-ink ring-offset-2 ring-offset-paper'
                      : 'ring-1 ring-black/10',
                  )}
                />
              );
            })}
            <label className="relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-dashed border-rule-strong text-[10px] font-semibold text-ink-faint transition-colors hover:border-ink-faint hover:text-ink-muted">
              <span aria-hidden>+</span>
              <span className="sr-only">Choose a custom accent colour</span>
              <input
                type="color"
                value={theme.accent}
                onChange={(event) => setTheme({ accent: event.target.value })}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </label>
          </div>
        </div>

        <Segmented
          label="Typeface"
          value={theme.fontFamily}
          options={FONT_FAMILIES.map((value) => ({ value, label: FONT_LABELS[value] }))}
          onChange={(fontFamily: FontFamily) => setTheme({ fontFamily })}
        />

        <Segmented
          label="Density"
          value={theme.density}
          options={DENSITIES.map((value) => ({ value, label: DENSITY_LABELS[value] }))}
          onChange={(density: Density) => setTheme({ density })}
        />

        <Segmented
          label="Page size"
          value={theme.pageFormat}
          options={PAGE_FORMATS.map((value) => ({ value, label: value }))}
          onChange={(pageFormat: PageFormat) => setTheme({ pageFormat })}
        />

        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.09em] text-ink-faint">
              Body text size
            </span>
            <span className="text-[12px] tabular-nums text-ink-muted">
              {theme.fontSize.toFixed(1)} pt
            </span>
          </div>
          <input
            type="range"
            min={8}
            max={13}
            step={0.5}
            value={theme.fontSize}
            onChange={(event) => setTheme({ fontSize: Number(event.target.value) })}
            aria-label="Body text size in points"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-rule-strong accent-clay"
          />
          <p className="mt-2 text-[11px] text-ink-faint">
            Drop half a point to pull a document back onto one page.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
