import { setLocalStorageValue } from "@utils/set-local-storage-value";

export const removeLocalStorageValue = (key: string): void => setLocalStorageValue(key, null);