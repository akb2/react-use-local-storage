import { isDefined, Nullable } from "@akb2/types-tools";

export const clearLocalStorage = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  const keys = Array.from(window.__AKB2_LOCAL_STORAGE__?.listeners?.keys()??[]);
  const currentValues = keys.reduce((acc, key) => {
    acc.set(key, localStorage.getItem(key) ?? null);

    return acc;
  }, new Map<string, Nullable<string>>());

  localStorage.clear();
  window.__AKB2_LOCAL_STORAGE__?.originalData?.clear();

  window.__AKB2_LOCAL_STORAGE__?.listeners?.forEach((listeners, key) => {
    const currentValue = currentValues.get(key);

    if (isDefined(currentValue)) {
      listeners.forEach((listener) => listener());
    }
  });
};