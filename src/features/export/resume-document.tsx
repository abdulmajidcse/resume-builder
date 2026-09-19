'use client';

import { memo } from 'react';
import type { Resume } from '@/entities/resume';
import { getTemplate } from '@/features/templates/registry';
import { templateStyle } from '@/features/templates/primitives';
import { pageGeometry } from './page-geometry';

export interface ResumeDocumentProps {
  resume: Resume;
  /** Fixes the sheet to one page height. Off lets long documents flow. */
  clipToPage?: boolean;
  className?: string;
}

/**
 * The printable sheet. One component serves the live preview, the gallery
 * thumbnails and the print output — which is what guarantees WYSIWYG rather
 * than leaving it to be maintained by hand.
 */
function ResumeDocument({ resume, clipToPage = false, className }: ResumeDocumentProps) {
  const { component: Template } = getTemplate(resume.templateId);
  const geometry = pageGeometry(resume.theme.pageFormat);

  return (
    <div
      data-print="page"
      data-resume-root
      className={className}
      style={{
        ...templateStyle(resume.theme),
        width: geometry.width,
        minHeight: geometry.height,
        height: clipToPage ? geometry.height : undefined,
        overflow: clipToPage ? 'hidden' : undefined,
        background: '#ffffff',
        color: '#1a1a1a',
      }}
    >
      <Template resume={resume} />
    </div>
  );
}

export default memo(ResumeDocument);
