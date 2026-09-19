'use client';

import { useMemo } from 'react';
import type { Resume } from '@/entities/resume';
import { useElementSize } from '@/shared/lib/use-element-width';
import { cn } from '@/shared/lib/cn';
import ResumeDocument from './resume-document';
import { pageGeometry } from './page-geometry';

export interface ResumePreviewProps {
  resume: Resume;
  /** Screen zoom applied on top of the fit-to-width scale. */
  zoom?: number;
  /** Clips to exactly one page — used for gallery thumbnails. */
  clipToPage?: boolean;
  className?: string;
}

const MAX_SCALE = 1;

/**
 * Fits the fixed-size sheet into whatever width the pane has, using a transform
 * so the document's own layout stays in print units. Print CSS drops the
 * transform, so the exported page is unscaled and exact.
 *
 * The outer box is sized from the *measured* document height rather than one
 * page, so documents that run to several pages scroll naturally in the editor.
 */
export function ResumePreview({
  resume,
  zoom = 1,
  clipToPage = false,
  className,
}: ResumePreviewProps) {
  const container = useElementSize<HTMLDivElement>();
  const sheet = useElementSize<HTMLDivElement>();
  const geometry = pageGeometry(resume.theme.pageFormat);

  const scale = useMemo(() => {
    if (!container.width) return 0;
    return Math.min(container.width / geometry.width, MAX_SCALE) * zoom;
  }, [container.width, geometry.width, zoom]);

  const naturalHeight = sheet.height || geometry.height;

  return (
    <div ref={container.ref} data-print="passthrough" className={cn('w-full', className)}>
      {scale > 0 ? (
        <div
          data-print="passthrough"
          style={{
            width: geometry.width * scale,
            height: naturalHeight * scale,
            margin: '0 auto',
          }}
        >
          {/*
            The screen-fit transform. Print CSS zeroes it explicitly rather than
            relying on a re-measure during printing, which is not guaranteed to
            happen before the page is captured.
          */}
          <div
            ref={sheet.ref}
            data-print="scaler"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              width: geometry.width,
            }}
          >
            <ResumeDocument
              resume={resume}
              clipToPage={clipToPage}
              className="shadow-float ring-1 ring-black/5"
            />
          </div>
        </div>
      ) : (
        <div style={{ aspectRatio: `${geometry.width} / ${geometry.height}` }} />
      )}
    </div>
  );
}
