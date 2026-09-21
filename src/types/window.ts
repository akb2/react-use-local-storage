declare global {
  interface Window {
    __AKB2_LOCAL_STORAGE__: {
      listeners: Map<string, Set<() => void>>;
      originalData: Map<string, unknown>;
    }
  }
}

export { };
