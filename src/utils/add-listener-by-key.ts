import { isDefined } from "@akb2/types-tools";
import { getListenersKeysSize } from "@utils/get-listeners-keys-size";
import { listenExternalStoreEvents } from "@utils/listen-external-store-events";

/**
 * Adds a listener for changes to a specific key in local storage.
 *
 * @param key The key in local storage to listen for changes on.
 * @param listener The callback function to invoke when the specified key changes.
 * @returns void
 */
export const addListenerByKey = (key: string, listener: () => void): void => {
  if (typeof window === 'undefined') {
    return;
  }

  if (getListenersKeysSize() === 0) {
    addEventListener('storage', listenExternalStoreEvents);
  }

  if(!isDefined(window.__AKB2_LOCAL_STORAGE__)){
    window.__AKB2_LOCAL_STORAGE__ = { } as typeof window.__AKB2_LOCAL_STORAGE__;
  }

  if(!isDefined(window.__AKB2_LOCAL_STORAGE__.listeners)){
    window.__AKB2_LOCAL_STORAGE__.listeners = new Map();
  }

  if (!window.__AKB2_LOCAL_STORAGE__.listeners.has(key)) {
    window.__AKB2_LOCAL_STORAGE__.listeners.set(key, new Set());
  }

  window.__AKB2_LOCAL_STORAGE__.listeners.get(key)!.add(listener);
};