'use client';

import { useMemo } from 'react';
import { createSampleResume } from '@/entities/resume';
import { ResumePreview } from '@/features/export/resume-preview';

/** A real template rendering real sample data, angled slightly on its stack. */
export function HeroPreview() {
  const resume = useMemo(() => {
    const sample = createSampleResume('executive');
    sample.theme.accent = '#2f3e46';
    return sample;
  }, []);

  return (
    <div className="relative mx-auto max-w-[420px]">
      <div
        aria-hidden
        className="absolute inset-x-6 top-5 h-full rounded-card border border-rule bg-paper-raised"
        style={{ transform: 'rotate(2.4deg)' }}
      />
      <div className="relative rounded-[4px]">
        <ResumePreview resume={resume} clipToPage />
      </div>
    </div>
  );
}
