import { beforeEach, describe, expect, it } from 'vitest';
import { useResumeStore } from '@/features/editor/store';
import { createEmptyResume, createSampleResume } from '@/entities/resume';

describe('resume store', () => {
  beforeEach(() => {
    useResumeStore.getState().replace(createEmptyResume(), { recordHistory: false });
  });

  it('records an undoable step for an update', () => {
    const { update, undo } = useResumeStore.getState();
    update((draft) => void (draft.profile.fullName = 'Alex'));
    expect(useResumeStore.getState().resume.profile.fullName).toBe('Alex');

    undo();
    expect(useResumeStore.getState().resume.profile.fullName).toBe('');
  });

  it('redoes what it just undid', () => {
    const { update, undo, redo } = useResumeStore.getState();
    update((draft) => void (draft.profile.fullName = 'Alex'));
    undo();
    redo();
    expect(useResumeStore.getState().resume.profile.fullName).toBe('Alex');
  });

  it('collapses rapid edits sharing a coalesce key into one history step', () => {
    const { update } = useResumeStore.getState();
    update((draft) => void (draft.profile.fullName = 'A'), { coalesceKey: 'name' });
    update((draft) => void (draft.profile.fullName = 'Al'), { coalesceKey: 'name' });
    update((draft) => void (draft.profile.fullName = 'Ale'), { coalesceKey: 'name' });

    expect(useResumeStore.getState().past.length).toBe(1);
    useResumeStore.getState().undo();
    expect(useResumeStore.getState().resume.profile.fullName).toBe('');
  });

  it('keeps separate history steps for different fields', () => {
    const { update } = useResumeStore.getState();
    update((draft) => void (draft.profile.fullName = 'A'), { coalesceKey: 'name' });
    update((draft) => void (draft.profile.email = 'a@b.c'), { coalesceKey: 'email' });
    expect(useResumeStore.getState().past.length).toBe(2);
  });

  it('does not mutate the previous snapshot when a draft is edited', () => {
    const { replace, update } = useResumeStore.getState();
    replace(createSampleResume(), { recordHistory: false });
    const before = useResumeStore.getState().resume;

    update((draft) => void (draft.experience[0]!.role = 'Changed'));

    expect(before.experience[0]!.role).not.toBe('Changed');
  });

  it('clears history when starting a new document', () => {
    const { update, startBlank } = useResumeStore.getState();
    update((draft) => void (draft.profile.fullName = 'Alex'));
    startBlank('modern');

    const state = useResumeStore.getState();
    expect(state.past).toEqual([]);
    expect(state.resume.templateId).toBe('modern');
    expect(state.resume.profile.fullName).toBe('');
  });

  it('toggles section visibility', () => {
    useResumeStore.getState().toggleSection('awards');
    const section = useResumeStore.getState().resume.sections.find((item) => item.id === 'awards');
    expect(section?.visible).toBe(false);
  });
});
