import { clearLocalStorage, useLocalStorageState } from "@source";
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => localStorage.clear());

afterEach(() => {
  cleanup();
  clearLocalStorage();
  vi.useRealTimers();
});

describe("A simple value changing", () => {
  it("No changing a value", () => {
    const { result } = renderHook(() => useLocalStorageState("initial"));

    expect(result.current[0]).toBeNull();
  });

  it("Changing a value", () => {
    const { result } = renderHook(() => useLocalStorageState("initial"));

    expect(result.current[0]).toBeNull();
    act(() => result.current[1]("new value"));
    expect(result.current[0]).toBe("new value");
  });

  it("Change a value with timeout", () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useLocalStorageState("initial"));

    expect(result.current[0]).toBeNull();
    setTimeout(() => result.current[1]("new value with timeout"), 100);
    act(() => vi.advanceTimersByTime(99));
    expect(result.current[0]).toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(result.current[0]).toBe("new value with timeout");
  });
});
