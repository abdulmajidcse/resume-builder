import { describe, expect, it } from 'vitest';
import {
  displayUrl,
  ensureProtocol,
  formatDateRange,
  joinParts,
  toFileStem,
} from '@/shared/lib/format';

describe('formatting helpers', () => {
  it('renders a full date range', () => {
    expect(formatDateRange('Mar 2021', 'Feb 2024')).toBe('Mar 2021 — Feb 2024');
  });

  it('prints Present for a current role regardless of the stored end date', () => {
    expect(formatDateRange('Mar 2021', 'Feb 2024', true)).toBe('Mar 2021 — Present');
  });

  it('drops the separator when one half is missing', () => {
    expect(formatDateRange('2019', '')).toBe('2019');
    expect(formatDateRange('', '2019')).toBe('2019');
    expect(formatDateRange('', '')).toBe('');
  });

  it('omits blank parts instead of leaving stray separators', () => {
    expect(joinParts(['Acme', '', 'Remote'])).toBe('Acme · Remote');
    expect(joinParts([undefined, null, ''])).toBe('');
  });

  it('shortens urls for print and restores a protocol for links', () => {
    expect(displayUrl('https://example.com/')).toBe('example.com');
    expect(ensureProtocol('example.com')).toBe('https://example.com');
    expect(ensureProtocol('http://example.com')).toBe('http://example.com');
    expect(ensureProtocol('  ')).toBe('');
  });

  it('builds a safe filename stem and falls back when nothing is usable', () => {
    expect(toFileStem('Alex Morgan — Senior Engineer')).toBe('alex-morgan-senior-engineer');
    expect(toFileStem('///')).toBe('resume');
  });
});
