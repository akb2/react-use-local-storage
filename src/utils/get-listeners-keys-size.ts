import { anyToInt } from "@akb2/types-tools";

/**
 * Gets the number of keys that have listeners in local storage.
 *
 * @returns The number of keys with listeners.
 */
export const getListenersKeysSize = (): number => {
  if (typeof window === 'undefined') {
    return 0;
  }

  return anyToInt(window.__AKB2_LOCAL_STORAGE__?.listeners?.size);
}