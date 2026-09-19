/**
 * Storage adapter.
 *
 * The editor depends on this interface, never on `localStorage` directly, so a
 * server-backed adapter can replace it later without the editor changing.
 */
export interface StorageAdapter {
  read(key: string): string | null;
  write(key: string, value: string): void;
  remove(key: string): void;
}

/** No-op adapter used during server rendering and when storage is unavailable. */
const memoryStore = new Map<string, string>();

export const memoryAdapter: StorageAdapter = {
  read: (key) => memoryStore.get(key) ?? null,
  write: (key, value) => void memoryStore.set(key, value),
  remove: (key) => void memoryStore.delete(key),
};

function isBrowserStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const probe = '__rb_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    // Private browsing and blocked site data both throw here.
    return false;
  }
}

export const localStorageAdapter: StorageAdapter = {
  read(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  write(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Quota exceeded or storage blocked: fall back to this session only.
      memoryAdapter.write(key, value);
    }
  },
  remove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      memoryAdapter.remove(key);
    }
  },
};

export function getStorageAdapter(): StorageAdapter {
  return isBrowserStorageAvailable() ? localStorageAdapter : memoryAdapter;
}
