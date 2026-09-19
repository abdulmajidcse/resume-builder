'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { templateExists } from '@/features/templates/registry';
import { EditorShell } from '@/features/editor/components/editor-shell';
import { useResumeStore } from '@/features/editor/store';

/**
 * Applies the `?template=` / `?start=` entry parameters exactly once, then
 * clears them from the URL so a refresh never silently discards edits.
 */
export function BuilderClient() {
  const params = useSearchParams();
  const router = useRouter();
  const hydrated = useResumeStore((state) => state.hydrated);
  const applied = useRef(false);

  useEffect(() => {
    if (!hydrated || applied.current) return;

    const start = params.get('start');
    const templateParam = params.get('template');
    const template = templateParam && templateExists(templateParam) ? templateParam : undefined;

    if (!start && !template) {
      applied.current = true;
      return;
    }
    applied.current = true;

    const store = useResumeStore.getState();
    if (start === 'blank') {
      store.startBlank(template ?? store.resume.templateId);
    } else if (start === 'sample') {
      store.startFromSample(template ?? store.resume.templateId);
    } else if (template) {
      store.setTemplate(template);
    }

    router.replace('/builder', { scroll: false });
  }, [hydrated, params, router]);

  return <EditorShell />;
}
