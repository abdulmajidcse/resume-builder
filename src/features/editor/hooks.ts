'use client';

import { useCallback } from 'react';
import type { ListSectionId, Resume } from '@/entities/resume';
import { useResumeStore } from './store';

export function useResume(): Resume {
  return useResumeStore((state) => state.resume);
}

export function useUpdateResume() {
  return useResumeStore((state) => state.update);
}

type ListItem = { id: string };

/**
 * CRUD for one repeating section. Handing every list editor the same four
 * operations keeps add/remove/reorder/patch behaviour identical across sections.
 */
export function useListSection<K extends ListSectionId>(key: K) {
  const update = useUpdateResume();

  const add = useCallback(
    (factory: () => Resume[K][number]) => {
      update((draft) => {
        (draft[key] as ListItem[]).push(factory() as ListItem);
      });
    },
    [key, update],
  );

  const remove = useCallback(
    (id: string) => {
      update((draft) => {
        draft[key] = (draft[key] as ListItem[]).filter((item) => item.id !== id) as Resume[K];
      });
    },
    [key, update],
  );

  const reorder = useCallback(
    (items: Resume[K]) => {
      update((draft) => {
        draft[key] = items;
      });
    },
    [key, update],
  );

  const patch = useCallback(
    (id: string, changes: Partial<Resume[K][number]>, coalesceKey?: string) => {
      update(
        (draft) => {
          const target = (draft[key] as ListItem[]).find((item) => item.id === id);
          if (target) Object.assign(target, changes);
        },
        coalesceKey ? { coalesceKey } : undefined,
      );
    },
    [key, update],
  );

  return { add, remove, reorder, patch };
}

/** Splits a textarea into trimmed lines, the storage shape for bullet lists. */
export function linesToArray(value: string): string[] {
  return value.split('\n');
}

export function arrayToLines(value: string[]): string {
  return value.join('\n');
}

/** Comma-separated token editing, used for skills and technologies. */
export function tokensToArray(value: string): string[] {
  return value
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);
}

export function arrayToTokens(value: string[]): string {
  return value.join(', ');
}
