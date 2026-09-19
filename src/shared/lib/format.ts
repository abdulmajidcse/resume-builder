import type { Experience } from '@/entities/resume';

/** Renders a date range the way a reader expects, tolerating missing halves. */
export function formatDateRange(start: string, end: string, current = false): string {
  const to = current ? 'Present' : end.trim();
  const from = start.trim();
  if (from && to) return `${from} — ${to}`;
  return from || to;
}

export function experienceDateRange(entry: Experience): string {
  return formatDateRange(entry.startDate, entry.endDate, entry.current);
}

/** Joins the parts of a line, dropping blanks so no stray separators appear. */
export function joinParts(parts: Array<string | undefined | null>, separator = ' · '): string {
  return parts
    .map((part) => part?.trim() ?? '')
    .filter(Boolean)
    .join(separator);
}

/** Strips the protocol prefix so links print compactly. */
export function displayUrl(url: string): string {
  return url
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/$/, '');
}

export function ensureProtocol(url: string): string {
  const value = url.trim();
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

/** Turns a resume title into a safe download filename stem. */
export function toFileStem(value: string, fallback = 'resume'): string {
  const stem = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return stem || fallback;
}
