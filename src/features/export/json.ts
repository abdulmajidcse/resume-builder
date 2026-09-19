import { resumeSchema } from '@/entities/resume';
import type { Resume } from '@/entities/resume';
import { toFileStem } from '@/shared/lib/format';

/** Serialises a resume for backup or transfer between devices. */
export function downloadResumeJson(resume: Resume): void {
  const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${toFileStem(resume.title || resume.profile.fullName)}.json`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export type ImportResult = { ok: true; resume: Resume } | { ok: false; error: string };

/** Reads a file as text, falling back to FileReader where `Blob.text` is absent. */
function readFileText(file: File): Promise<string> {
  if (typeof file.text === 'function') return file.text();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error ?? new Error('Could not read file'));
    reader.readAsText(file);
  });
}

/**
 * Validates an uploaded file against the schema before it can touch the store.
 *
 * Reading, parsing and validating fail for different reasons, so they are kept
 * separate — a user who picked an unreadable file should not be told their JSON
 * is malformed.
 */
export async function importResumeJson(file: File): Promise<ImportResult> {
  let text: string;
  try {
    text = await readFileText(file);
  } catch {
    return { ok: false, error: 'That file could not be read. Try selecting it again.' };
  }

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: 'That file is not valid JSON.' };
  }

  const parsed = resumeSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: 'That file is not a resume exported from this app.' };
  }
  return { ok: true, resume: parsed.data };
}
