import type { ComponentType } from 'react';
import type { Resume } from '@/entities/resume';

/**
 * The template contract.
 *
 * A template is a pure function of the resume document. It never reads the
 * editor store, never fetches, and holds no state — which is why the same
 * component can be used for the live preview, the gallery thumbnail, and the
 * printed page without divergence.
 */
export interface TemplateProps {
  resume: Resume;
}

export type TemplateComponent = ComponentType<TemplateProps>;

export type TemplateCategory = 'classic' | 'modern' | 'creative' | 'academic';

export interface TemplateDefinition {
  id: string;
  name: string;
  /** One line shown in the gallery; says who the template suits. */
  description: string;
  category: TemplateCategory;
  tags: string[];
  /** Accent applied when a resume first adopts this template. */
  defaultAccent: string;
  /** Two-tone swatch used by the gallery card, independent of the accent. */
  swatch: [string, string];
  component: TemplateComponent;
}
