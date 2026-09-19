'use client';

import { useCallback, useRef, useState } from 'react';

export interface ElementSize {
  width: number;
  height: number;
}

/**
 * Tracks an element's box size, for layout that must scale to fit.
 *
 * This uses a callback ref rather than `useRef` + an effect, because the
 * measured element is often rendered conditionally — it appears only once an
 * earlier measurement has resolved. An effect with empty deps would run before
 * the node existed and never observe it, silently leaving the size at zero.
 */
export function useElementSize<T extends HTMLElement>() {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });
  const observer = useRef<ResizeObserver | null>(null);

  const ref = useCallback((node: T | null) => {
    observer.current?.disconnect();
    observer.current = null;
    if (!node) return;

    const measure = () => setSize({ width: node.clientWidth, height: node.offsetHeight });
    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(node);
    observer.current = resizeObserver;
  }, []);

  return { ref, ...size };
}
