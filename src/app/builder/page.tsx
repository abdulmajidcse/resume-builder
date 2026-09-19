import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BuilderClient } from './builder-client';

export const metadata: Metadata = {
  title: 'Resume builder',
  description: 'Edit your resume with a live preview and download it as a PDF.',
  robots: { index: false, follow: true },
};

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <BuilderClient />
    </Suspense>
  );
}
