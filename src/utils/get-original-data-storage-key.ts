/**
 * Generates a unique key for storing the original data in local storage.
 *
 * @param key The key in local storage.
 * @param value The value associated with the key.
 * @returns A unique key for storing the original data.
 */
export const getOriginalDataStorageKey = (key: string, value: string): string => `${key}:{${value}}`;