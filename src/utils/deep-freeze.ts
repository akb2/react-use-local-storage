import { isDefined } from "@akb2/types-tools";

/**
 * Deeply freezes an object, making it immutable.
 *
 * @param value - The object to freeze.
 * @returns The frozen object.
 */
export const deepFreeze = <T>(value: T): T => {
  if (!isDefined(value) || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  Object.freeze(value);
  Object.values(value as Record<string, unknown>).forEach(deepFreeze);

  return value;
};