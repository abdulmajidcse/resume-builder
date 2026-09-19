import type { TemplateDefinition } from './types';
import Classic from './components/classic';
import Executive from './components/executive';
import Modern from './components/modern';
import Minimal from './components/minimal';
import Technical from './components/technical';
import Elegant from './components/elegant';
import Academic from './components/academic';
import Creative from './components/creative';
import Compact from './components/compact';
import Bold from './components/bold';

/**
 * The template registry — the single place the app learns which templates exist.
 *
 * Components are imported statically rather than lazily on purpose: the gallery
 * renders all ten at once, each is a small pure presentational module, and
 * static imports remove an entire class of loading-state and hydration bugs for
 * a negligible bundle cost.
 *
 * Adding a template: create the component, add one entry here. Nothing else in
 * the codebase needs to change.
 */
export const TEMPLATES: readonly TemplateDefinition[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Centred masthead and ruled headings. The safe, ATS-friendly default.',
    category: 'classic',
    tags: ['ATS-friendly', 'Single column'],
    defaultAccent: '#1f3a5f',
    swatch: ['#1f3a5f', '#dfe5ec'],
    component: Classic,
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Left-anchored masthead with an accent rule. Senior and restrained.',
    category: 'classic',
    tags: ['Leadership', 'Single column'],
    defaultAccent: '#2f3e46',
    swatch: ['#2f3e46', '#dde3e2'],
    component: Executive,
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Colour-block header with chipped skills. Current without being loud.',
    category: 'modern',
    tags: ['Colour header', 'Product'],
    defaultAccent: '#2563a8',
    swatch: ['#2563a8', '#dbe8f6'],
    component: Modern,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'No rules, no fills — hierarchy from whitespace alone.',
    category: 'modern',
    tags: ['Whitespace', 'Understated'],
    defaultAccent: '#3d3d3d',
    swatch: ['#3d3d3d', '#e8e8e8'],
    component: Minimal,
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Monospaced labels and a dense grid. Built for engineering detail.',
    category: 'modern',
    tags: ['Engineering', 'Dense'],
    defaultAccent: '#0f766e',
    swatch: ['#0f766e', '#d6ece9'],
    component: Technical,
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Hairline rules and wide letterspacing. Editorial and composed.',
    category: 'classic',
    tags: ['Editorial', 'Serif-friendly'],
    defaultAccent: '#6b4b3e',
    swatch: ['#6b4b3e', '#ece2dc'],
    component: Elegant,
  },
  {
    id: 'academic',
    name: 'Academic CV',
    description: 'Small-caps headings and a long-form record that carries across pages.',
    category: 'academic',
    tags: ['Multi-page', 'Research'],
    defaultAccent: '#4a4a4a',
    swatch: ['#4a4a4a', '#e6e6e6'],
    component: Academic,
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Tinted sidebar for identity and skills, main column for the story.',
    category: 'creative',
    tags: ['Two column', 'Sidebar'],
    defaultAccent: '#9a3f6b',
    swatch: ['#9a3f6b', '#f3e0ea'],
    component: Creative,
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'A narrow supporting rail beside the narrative. Fits a lot on one page.',
    category: 'modern',
    tags: ['Two column', 'Space-saving'],
    defaultAccent: '#1f5f4d',
    swatch: ['#1f5f4d', '#d9ece5'],
    component: Compact,
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Deep accent rail with reversed type and an oversized masthead.',
    category: 'creative',
    tags: ['High contrast', 'Sidebar'],
    defaultAccent: '#b4522d',
    swatch: ['#b4522d', '#f6e2da'],
    component: Bold,
  },
];

const TEMPLATE_INDEX = new Map(TEMPLATES.map((template) => [template.id, template]));

export const DEFAULT_TEMPLATE_ID = 'classic';

/** Always returns a renderable template, falling back rather than throwing. */
export function getTemplate(id: string): TemplateDefinition {
  return TEMPLATE_INDEX.get(id) ?? TEMPLATE_INDEX.get(DEFAULT_TEMPLATE_ID)!;
}

export function templateExists(id: string): boolean {
  return TEMPLATE_INDEX.has(id);
}

export function templateIds(): string[] {
  return TEMPLATES.map((template) => template.id);
}
