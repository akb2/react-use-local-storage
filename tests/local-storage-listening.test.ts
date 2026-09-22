import { clearLocalStorage, useLocalStorageState } from "@source";
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => localStorage.clear());

afterEach(() => {
  cleanup();
  clearLocalStorage();
  vi.useRealTimers();
});

describe("LocalStorage direct changing", () => {
  it("No support changes with direct localStorage modification", () => {
    const { result } = renderHook(() => useLocalStorageState("initial"));

    expect(result.current[0]).toBeNull();

    localStorage.setItem(
      "initial",
      JSON.stringify({ value: "new value with direct modification" }),
    );

    return waitFor(() => expect(result.current[0]).toBeNull(), {
      timeout: 2000,
    });
  });
});
