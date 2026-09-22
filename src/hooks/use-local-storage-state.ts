import { Nullable } from "@akb2/types-tools";
import { addListenerByKey } from "@utils/add-listener-by-key";
import { deleteListenerByKey } from "@utils/delete-listener-by-key";
import { getLocalStorageValue } from "@utils/get-local-storage-value";
import { setLocalStorageValue } from "@utils/set-local-storage-value";
import type { Dispatch } from "react";
import { useCallback, useSyncExternalStore } from "react";

/**
 * A custom React hook that synchronizes a state variable with local storage.
 *
 * @template T The type of the state variable.
 * @param key The key in local storage to associate with the state variable.
 * @returns A tuple containing the state variable, a setter function, and the key.
 */
export function useLocalStorageState<T>(key: string): [Nullable<T>, Dispatch<Nullable<T>>, string];
export function useLocalStorageState<T>(
  key: string,
  fallback: Exclude<T, null | undefined>,
): [Exclude<T, null | undefined>, Dispatch<Nullable<T>>, string];
export function useLocalStorageState<T>(
  key: string,
  fallback: Nullable<T>,
): [Nullable<T>, Dispatch<Nullable<T>>, string];
export function useLocalStorageState<T>(
  key: string,
  fallback: Nullable<T> = null,
): [Nullable<T>, Dispatch<Nullable<T>>, string] {
  const setState = useCallback(setLocalStorageValue.bind(null, key), [key]);
  const state = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") {
        return (): void => {};
      }

      addListenerByKey(key, onStoreChange);

      return (): void => deleteListenerByKey(key, onStoreChange);
    },
    () => getLocalStorageValue<T>(key, fallback) as T,
    () => fallback,
  );

  return [state, setState, key];
}
