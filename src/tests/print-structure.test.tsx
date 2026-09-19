import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { EditorShell } from '@/features/editor/components/editor-shell';
import { useResumeStore } from '@/features/editor/store';
import { createSampleResume } from '@/entities/resume';

/**
 * Print isolation is structural: the stylesheet decides what reaches the page
 * purely from `data-print` roles. If a pane loses its role, the wrong half of
 * the editor ends up in the user's PDF — which is exactly what these assert.
 */
/**
 * jsdom performs no layout, so every element measures zero and the preview
 * never leaves its placeholder branch. Giving elements a nominal box lets the
 * real render path run.
 */
const LAYOUT_STUBS = { clientWidth: 900, offsetHeight: 1123 } as const;
const originals = new Map<string, PropertyDescriptor | undefined>();

beforeAll(() => {
  for (const [property, value] of Object.entries(LAYOUT_STUBS)) {
    originals.set(property, Object.getOwnPropertyDescriptor(HTMLElement.prototype, property));
    Object.defineProperty(HTMLElement.prototype, property, { configurable: true, value });
  }
});

afterAll(() => {
  for (const [property, descriptor] of originals) {
    if (descriptor) Object.defineProperty(HTMLElement.prototype, property, descriptor);
    else Reflect.deleteProperty(HTMLElement.prototype, property);
  }
});

function renderEditor() {
  useResumeStore.setState({ hydrated: true });
  useResumeStore.getState().replace(createSampleResume('classic'), { recordHistory: false });
  return render(<EditorShell />);
}

describe('print structure', () => {
  afterEach(cleanup);

  it('routes the document through exactly one printable pane', () => {
    const { container } = renderEditor();
    const panes = container.querySelectorAll('[data-print="pane"]');
    expect(panes.length).toBe(1);
    expect(panes[0]!.querySelector('[data-resume-root]')).not.toBeNull();
  });

  it('marks the toolbar and the form pane as non-printing', () => {
    const { container } = renderEditor();
    const hidden = [...container.querySelectorAll('[data-print="hide"]')];
    expect(hidden.length).toBeGreaterThan(0);

    // The form pane is identified by the content it holds, not by position.
    const formPane = hidden.find((element) => element.textContent?.includes('Personal details'));
    expect(formPane).toBeDefined();
  });

  it('keeps the editable form out of every printable pane', () => {
    const { container } = renderEditor();
    const pane = container.querySelector('[data-print="pane"]')!;
    expect(pane.querySelector('input')).toBeNull();
    expect(pane.textContent).not.toContain('Personal details');
  });

  it('wraps the sheet in collapsible sizing wrappers only', () => {
    const { container } = renderEditor();
    const sheet = container.querySelector('[data-resume-root]')!;
    // Every ancestor up to the pane must be a wrapper print CSS knows how to
    // collapse; an unmarked one would keep its screen-sized box on the page.
    let node = sheet.parentElement;
    const roles: string[] = [];
    while (node && node.getAttribute('data-print') !== 'pane') {
      roles.push(node.getAttribute('data-print') ?? 'unmarked');
      node = node.parentElement;
    }
    expect(node).not.toBeNull();
    expect(roles.every((role) => role === 'passthrough' || role === 'scaler')).toBe(true);
  });
});
