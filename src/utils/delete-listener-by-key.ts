import { getListenersKeysSize } from "@utils/get-listeners-keys-size";
import { listenExternalStoreEvents } from "@utils/listen-external-store-events";

/**
 * Deletes a listener for changes to a specific key in local storage.
 *
 * @param key The key in local storage to stop listening for changes on.
 * @param listener The callback function to remove.
 * @returns void
 */
export const deleteListenerByKey = (key: string, listener: () => void): void => {
  if (typeof window === 'undefined') {
    return;
  }

  if (!window.__AKB2_LOCAL_STORAGE__?.listeners?.has(key)) {
    return;
  }

  window.__AKB2_LOCAL_STORAGE__.listeners.get(key)!.delete(listener);

  if (window.__AKB2_LOCAL_STORAGE__.listeners.get(key)?.size === 0) {
    window.__AKB2_LOCAL_STORAGE__.listeners.delete(key);
  }

  if (getListenersKeysSize() === 0) {
    removeEventListener('storage', listenExternalStoreEvents);
  }
};