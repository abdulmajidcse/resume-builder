import { describe, expect, it } from 'vitest';
import { importResumeJson } from '@/features/export/json';
import { createSampleResume } from '@/entities/resume';

function fileOf(contents: string): File {
  return new File([contents], 'resume.json', { type: 'application/json' });
}

describe('resume import', () => {
  it('accepts a document this app exported', async () => {
    const resume = createSampleResume('bold');
    const result = await importResumeJson(fileOf(JSON.stringify(resume)));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.resume.profile.fullName).toBe('Alex Morgan');
  });

  it('rejects malformed JSON with a readable message', async () => {
    const result = await importResumeJson(fileOf('{ not json'));
    expect(result).toEqual({ ok: false, error: 'That file is not valid JSON.' });
  });

  it('rejects JSON that is not a resume', async () => {
    const result = await importResumeJson(fileOf(JSON.stringify({ hello: 'world' })));
    expect(result).toEqual({
      ok: false,
      error: 'That file is not a resume exported from this app.',
    });
  });

  it('distinguishes an unreadable file from malformed JSON', async () => {
    const unreadable = {
      text: () => Promise.reject(new Error('disk error')),
    } as unknown as File;
    const result = await importResumeJson(unreadable);
    expect(result).toEqual({
      ok: false,
      error: 'That file could not be read. Try selecting it again.',
    });
  });
});
