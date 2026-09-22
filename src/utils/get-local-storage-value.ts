import { isDefined, Nullable } from "@akb2/types-tools";
import { deepFreeze } from "@utils/deep-freeze";
import { getOriginalDataStorageKey } from "./get-original-data-storage-key";

/**
 * Retrieves the value associated with a specific key from local storage.
 *
 * @template T The expected type of the value.
 * @param key The key in local storage to retrieve the value for.
 * @returns The value associated with the key, or undefined if not found.
 */
export function getLocalStorageValue<T>(key: string): Nullable<T>;
export function getLocalStorageValue<T>(
  key: string,
  fallback: Exclude<T, null | undefined>,
): Exclude<T, null | undefined>;
export function getLocalStorageValue<T>(key: string, fallback: Nullable<T>): Nullable<T>;
export function getLocalStorageValue<T>(
  key: string,
  mixedFallback: Nullable<T> = null,
): Nullable<T> {
  const fallback = mixedFallback ?? null;

  if (typeof window === "undefined") {
    return fallback;
  }

  const raw = localStorage.getItem(key);

  if (!isDefined(raw)) {
    return fallback;
  }

  if (!isDefined(window.__AKB2_LOCAL_STORAGE__)) {
    window.__AKB2_LOCAL_STORAGE__ = {} as typeof window.__AKB2_LOCAL_STORAGE__;
  }

  if (!isDefined(window.__AKB2_LOCAL_STORAGE__.originalData)) {
    window.__AKB2_LOCAL_STORAGE__.originalData = new Map();
  }

  try {
    const cachedKey = getOriginalDataStorageKey(key, raw);
    const cachedData = window.__AKB2_LOCAL_STORAGE__.originalData.get(cachedKey);

    if (isDefined(cachedData)) {
      return cachedData as T;
    }

    const parsedData = deepFreeze(JSON.parse(raw).value);

    if (isDefined(parsedData)) {
      window.__AKB2_LOCAL_STORAGE__.originalData.set(cachedKey, parsedData);
    }

    return parsedData as Readonly<T>;
  } catch {
    return raw.length > 0 ? (raw as unknown as T) : fallback;
  }
}
