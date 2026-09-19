'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  createEmptyResume,
  createSampleResume,
  defaultSections,
  resumeSchema,
} from '@/entities/resume';
import type { Resume, SectionId, SectionMeta, Theme } from '@/entities/resume';
import { getStorageAdapter } from '@/shared/lib/storage';

const STORAGE_KEY = 'resume-builder:document:v1';
const HISTORY_LIMIT = 50;
const COALESCE_WINDOW_MS = 700;

export interface ResumeState {
  resume: Resume;
  /** Snapshots for undo/redo. Kept out of persistence so reloads start clean. */
  past: Resume[];
  future: Resume[];
  hydrated: boolean;
  lastSavedAt: string | null;
}

interface CoalesceMark {
  key: string;
  at: number;
}

/** Held outside the store: it is bookkeeping for history, not document state. */
let lastCoalesce: CoalesceMark | null = null;

export interface UpdateOptions {
  /**
   * Consecutive edits sharing a key within `COALESCE_WINDOW_MS` collapse into
   * one history entry, so undo steps back by edit rather than by keystroke.
   */
  coalesceKey?: string;
}

export interface ResumeActions {
  /** Applies a mutation to a draft copy and records it for undo. */
  update: (mutate: (draft: Resume) => void, options?: UpdateOptions) => void;
  replace: (resume: Resume, options?: { recordHistory?: boolean }) => void;
  setTemplate: (templateId: string) => void;
  setTheme: (patch: Partial<Theme>) => void;
  setSections: (sections: SectionMeta[]) => void;
  toggleSection: (id: SectionId) => void;
  startBlank: (templateId: string) => void;
  startFromSample: (templateId: string) => void;
  reset: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  markHydrated: () => void;
}

export type ResumeStore = ResumeState & ResumeActions;

/**
 * Structured clone keeps history snapshots independent of the live document.
 * The resume is plain JSON, so this is both correct and cheap.
 */
function clone(resume: Resume): Resume {
  return JSON.parse(JSON.stringify(resume)) as Resume;
}

function withTimestamp(resume: Resume): Resume {
  resume.updatedAt = new Date().toISOString();
  return resume;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resume: createEmptyResume(),
      past: [],
      future: [],
      hydrated: false,
      lastSavedAt: null,

      update: (mutate, options) =>
        set((state) => {
          const draft = clone(state.resume);
          mutate(draft);

          const now = Date.now();
          const key = options?.coalesceKey;
          const shouldCoalesce =
            key !== undefined &&
            lastCoalesce !== null &&
            lastCoalesce.key === key &&
            now - lastCoalesce.at < COALESCE_WINDOW_MS;
          lastCoalesce = key === undefined ? null : { key, at: now };

          return {
            resume: withTimestamp(draft),
            past: shouldCoalesce ? state.past : [...state.past, state.resume].slice(-HISTORY_LIMIT),
            future: [],
            lastSavedAt: new Date().toISOString(),
          };
        }),

      replace: (resume, options) => {
        // A whole-document swap always starts a fresh coalescing run.
        lastCoalesce = null;
        set((state) => ({
          resume: withTimestamp(clone(resume)),
          past:
            options?.recordHistory === false
              ? []
              : [...state.past, state.resume].slice(-HISTORY_LIMIT),
          future: [],
          lastSavedAt: new Date().toISOString(),
        }));
      },

      setTemplate: (templateId) => get().update((draft) => void (draft.templateId = templateId)),

      setTheme: (patch) => get().update((draft) => void Object.assign(draft.theme, patch)),

      setSections: (sections) => get().update((draft) => void (draft.sections = sections)),

      toggleSection: (id) =>
        get().update((draft) => {
          const section = draft.sections.find((item) => item.id === id);
          if (section) section.visible = !section.visible;
          else draft.sections = defaultSections();
        }),

      startBlank: (templateId) =>
        get().replace(createEmptyResume(templateId), { recordHistory: false }),

      startFromSample: (templateId) =>
        get().replace(createSampleResume(templateId), { recordHistory: false }),

      reset: () =>
        get().replace(createEmptyResume(get().resume.templateId), { recordHistory: false }),

      undo: () =>
        set((state) => {
          const previous = state.past.at(-1);
          if (!previous) return state;
          return {
            resume: previous,
            past: state.past.slice(0, -1),
            future: [state.resume, ...state.future].slice(0, HISTORY_LIMIT),
          };
        }),

      redo: () =>
        set((state) => {
          const next = state.future[0];
          if (!next) return state;
          return {
            resume: next,
            past: [...state.past, state.resume].slice(-HISTORY_LIMIT),
            future: state.future.slice(1),
          };
        }),

      canUndo: () => get().past.length > 0,
      canRedo: () => get().future.length > 0,

      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => {
        const adapter = getStorageAdapter();
        return {
          getItem: (name) => adapter.read(name),
          setItem: (name, value) => adapter.write(name, value),
          removeItem: (name) => adapter.remove(name),
        };
      }),
      // History is session state, not document state.
      partialize: (state) => ({ resume: state.resume, lastSavedAt: state.lastSavedAt }),
      merge: (persisted, current) => {
        const candidate = (persisted as { resume?: unknown } | undefined)?.resume;
        const parsed = resumeSchema.safeParse(candidate);
        return {
          ...current,
          // A corrupt or outdated document must never break the editor.
          resume: parsed.success ? parsed.data : current.resume,
          lastSavedAt:
            (persisted as { lastSavedAt?: string | null } | undefined)?.lastSavedAt ?? null,
        };
      },
      // Fires after persisted state is merged in, on success or failure alike.
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    },
  ),
);

/**
 * Persistence rehydrates after the first client render, so components that read
 * the document must wait for this flag or they will flash the empty default and
 * trip a hydration mismatch.
 */
export const useHydrated = () => useResumeStore((state) => state.hydrated);
