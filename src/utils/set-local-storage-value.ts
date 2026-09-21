import { isDefined, Nullable } from "@akb2/types-tools";
import { deepFreeze } from "@utils/deep-freeze";
import { getLocalStorageValue } from "@utils/get-local-storage-value";
import { getOriginalDataStorageKey } from "@utils/get-original-data-storage-key";
import { SetStateAction } from "react";

export const setLocalStorageValue = <T>(key: string, valueOrCallback: SetStateAction<Nullable<T>>): void => {
  if (typeof window === 'undefined') {
    return;
  }

  const value = typeof valueOrCallback === 'function' ? (valueOrCallback as Function)(getLocalStorageValue<T>(key)) : valueOrCallback;

  if (typeof value === 'function') {
    throw new Error('Functional updates are not supported in useLocalStorageState setter. Please provide the new value directly.');
  }

  const currentValue = localStorage.getItem(key) ?? null;
  const newValue = isDefined(value) ? JSON.stringify({ value }) : null;

  if (isDefined(newValue)) {
    localStorage.setItem(key, newValue);
  } else {
    localStorage.removeItem(key);
  }

  if (currentValue !== newValue) {
    if(!isDefined(window.__AKB2_LOCAL_STORAGE__)){
      window.__AKB2_LOCAL_STORAGE__ = { } as typeof window.__AKB2_LOCAL_STORAGE__;
    }

    if(!isDefined(window.__AKB2_LOCAL_STORAGE__.listeners)){
      window.__AKB2_LOCAL_STORAGE__.listeners = new Map();
    }

    if(!isDefined(window.__AKB2_LOCAL_STORAGE__.originalData)){
      window.__AKB2_LOCAL_STORAGE__.originalData = new Map();
    }

    window.__AKB2_LOCAL_STORAGE__.listeners.get(key)?.forEach((listener) => listener());

    if (isDefined(currentValue)) {
      window.__AKB2_LOCAL_STORAGE__.originalData.delete(getOriginalDataStorageKey(key, currentValue));
    }

    if (isDefined(newValue)) {
      window.__AKB2_LOCAL_STORAGE__.originalData.set(getOriginalDataStorageKey(key, newValue), deepFreeze(JSON.parse(newValue).value));
    }
  }
};