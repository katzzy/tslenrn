export type UserScopedStorageArea =
  | 'code-drafts'
  | 'selected-problem'
  | 'executor-mode'
  | 'runner-input'
  | 'runner-tab';

const STORAGE_PREFIX = 'tslenrn';
const STORAGE_VERSION = 'v1';

export const appStorageKey = (area: string): string =>
  `${STORAGE_PREFIX}.${area}:${STORAGE_VERSION}`;

export const userStorageKey = (userId: string, area: UserScopedStorageArea): string =>
  `${STORAGE_PREFIX}.${area}:${STORAGE_VERSION}:${userId}`;

export const readJsonStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (error) {
    console.error(`Failed to read JSON storage key "${key}"`, error);
    return fallback;
  }
};

export const writeJsonStorage = (key: string, value: unknown): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to write JSON storage key "${key}"`, error);
    return false;
  }
};

export const readStringStorage = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.error(`Failed to read string storage key "${key}"`, error);
    return null;
  }
};

export const writeStringStorage = (key: string, value: string): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Failed to write string storage key "${key}"`, error);
    return false;
  }
};

export const removeStorage = (key: string): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove storage key "${key}"`, error);
    return false;
  }
};

export const subscribeStorageKeys = (
  keys: readonly string[],
  onChange: (event: StorageEvent) => void
): (() => void) => {
  if (typeof window === 'undefined') return () => undefined;

  const keySet = new Set(keys);
  const listener = (event: StorageEvent) => {
    if (!event.key || !keySet.has(event.key)) return;
    onChange(event);
  };

  window.addEventListener('storage', listener);
  return () => {
    window.removeEventListener('storage', listener);
  };
};
