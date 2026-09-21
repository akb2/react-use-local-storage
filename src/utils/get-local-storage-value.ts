import { isDefined, NotDefinable } from "@akb2/types-tools";
import { deepFreeze } from "@utils/deep-freeze";
import { getOriginalDataStorageKey } from "./get-original-data-storage-key";

/**
 * Retrieves the value associated with a specific key from local storage.
 *
 * @template T The expected type of the value.
 * @param key The key in local storage to retrieve the value for.
 * @returns The value associated with the key, or undefined if not found.
 */
export const getLocalStorageValue = <T>(key: string): NotDefinable<T> => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const raw = localStorage.getItem(key);

  if (!isDefined(raw)) {
    return undefined;
  }

  if(!isDefined(window.__AKB2_LOCAL_STORAGE__)){
    window.__AKB2_LOCAL_STORAGE__ = { } as typeof window.__AKB2_LOCAL_STORAGE__;
  }

  if(!isDefined(window.__AKB2_LOCAL_STORAGE__.originalData)){
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
    return raw.length > 0 ? (raw as unknown as T) : undefined;
  }
};