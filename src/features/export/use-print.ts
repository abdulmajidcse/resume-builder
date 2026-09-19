'use client';

import { useCallback, useEffect } from 'react';
import type { PageFormat } from '@/entities/resume';
import { pageGeometry } from './page-geometry';

/**
 * Print export.
 *
 * There is no PDF renderer here by design: the browser already has one, and
 * printing the same DOM the user is looking at means the export cannot drift
 * from the preview. It also keeps the text selectable and the file small.
 */
export function usePrintPageSize(format: PageFormat): void {
  useEffect(() => {
    const { cssSize } = pageGeometry(format);
    document.documentElement.style.setProperty('--print-page-size', cssSize);
  }, [format]);
}

export function usePrint(documentTitle: string): () => void {
  return useCallback(() => {
    const previousTitle = document.title;
    // Browsers seed the "Save as PDF" filename from document.title.
    document.title = documentTitle;

    const restore = () => {
      document.title = previousTitle;
      window.removeEventListener('afterprint', restore);
    };
    window.addEventListener('afterprint', restore);

    // Let the title change and any pending layout settle before the dialog opens.
    requestAnimationFrame(() => {
      window.print();
      // Safari does not always fire afterprint; restore defensively.
      window.setTimeout(restore, 1000);
    });
  }, [documentTitle]);
}
