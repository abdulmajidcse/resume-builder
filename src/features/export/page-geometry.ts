import type { PageFormat } from '@/entities/resume';

/**
 * Page geometry in CSS pixels at 96 DPI, which is the unit browsers use when
 * laying out for print. Keeping the preview in the same unit is what makes the
 * on-screen page and the printed page the same size.
 */
export interface PageGeometry {
  width: number;
  height: number;
  /** CSS `@page size` keyword. */
  cssSize: string;
}

export const PAGE_GEOMETRY: Record<PageFormat, PageGeometry> = {
  A4: { width: 794, height: 1123, cssSize: 'A4' },
  Letter: { width: 816, height: 1056, cssSize: 'Letter' },
};

export function pageGeometry(format: PageFormat): PageGeometry {
  return PAGE_GEOMETRY[format] ?? PAGE_GEOMETRY.A4;
}
