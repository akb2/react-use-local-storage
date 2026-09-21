import { isDefined } from "@akb2/types-tools";
import { getOriginalDataStorageKey } from "@utils/get-original-data-storage-key";

/**
 * Listens for external changes to the local storage and updates the internal cache and listeners accordingly.
 *
 * @param event The storage event triggered by changes to the local storage.
 * @returns void
 */
export const listenExternalStoreEvents = (event: StorageEvent): void => {
  if (event.storageArea === localStorage) {
    if(!isDefined(window.__AKB2_LOCAL_STORAGE__)){
      window.__AKB2_LOCAL_STORAGE__ = { } as typeof window.__AKB2_LOCAL_STORAGE__;
    }

    if(!isDefined(window.__AKB2_LOCAL_STORAGE__.listeners)){
      window.__AKB2_LOCAL_STORAGE__.listeners = new Map();
    }

    if(!isDefined(window.__AKB2_LOCAL_STORAGE__.originalData)){
      window.__AKB2_LOCAL_STORAGE__.originalData = new Map();
    }

    if (isDefined(event.key)) {
      if (isDefined(event.oldValue) && event.oldValue !== event.newValue) {
        window.__AKB2_LOCAL_STORAGE__.originalData.delete(getOriginalDataStorageKey(event.key, event.oldValue));
      }

      window.__AKB2_LOCAL_STORAGE__.listeners.get(event.key)?.forEach((listener) => listener());
    } else {
      window.__AKB2_LOCAL_STORAGE__.originalData.clear();
      window.__AKB2_LOCAL_STORAGE__.listeners.forEach((listeners) => listeners.forEach((listener) => listener()));
    }
  }
};