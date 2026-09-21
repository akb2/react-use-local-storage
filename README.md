# react-use-local-storage

A React state hook backed by `localStorage`, built on `useSyncExternalStore`. Read and update values by key, subscribe to changes, and access storage outside React components.

## Installation

```bash
pnpm add react-use-local-storage
```

Declared peer dependencies: `react@^18.3.1` and `@akb2/types-tools@^1.3.0`. The current React peer dependency range does not include React 19.

The package provides ESM, CommonJS, and TypeScript declarations.

## Quick start

```tsx
import { useLocalStorageState } from "react-use-local-storage";

export const Counter = () => {
  const [count, setCount] = useLocalStorageState<number>("counter");

  return (
    <button onClick={() => setCount((previous) => (previous ?? 0) + 1)}>
      Clicks: {count ?? 0}
    </button>
  );
};
```

The hook returns `undefined` for a missing key. There is no second argument for an initial value. Use `??` to provide a display fallback; this does not write the fallback to storage.

## API

### `useLocalStorageState<T>(key)`

```ts
const [value, setValue, storageKey] = useLocalStorageState<string>("name");
```

| Element | Description |
| --- | --- |
| `value` | The current value, or `undefined` for a missing key |
| `setValue` | Writes a value or computes a new value from the previous one |
| `storageKey` | The key passed to the hook |

```ts
setValue("Andrew");
setValue((previous) => `${previous ?? ""}!`);
```

An updater callback receives the current value from storage. At runtime, this can be `undefined` when the key is missing, so handle that case in the callback. The current setter signature is `Dispatch<SetStateAction<T>>`, which does not reflect this possible `undefined` argument.

Functions cannot be stored as values: a function argument is treated as an updater, and returning a function from that updater throws an error.

### `getLocalStorageValue<T>(key)`

Reads a value without creating a React subscription:

```ts
import { getLocalStorageValue } from "react-use-local-storage";

const name = getLocalStorageValue<string>("name");
```

Returns `undefined` for a missing key. The generic type `T` describes the expected value; it does not validate stored data at runtime.

### `setLocalStorageValue<T>(key, valueOrCallback)`

Writes a value and notifies subscribers to that key in the current window:

```ts
import { setLocalStorageValue } from "react-use-local-storage";

setLocalStorageValue("name", "Andrew");
setLocalStorageValue<number>("counter", (previous) => (previous ?? 0) + 1);
```

Writing the same serialized content does not notify subscribers again. Passing `null` removes the value.

### `removeLocalStorageValue(key)`

Removes a value through the library's setter and notifies subscribers if the stored value changes:

```ts
import { removeLocalStorageValue } from "react-use-local-storage";

removeLocalStorageValue("name");
```

### `clearLocalStorage()`

```ts
import { clearLocalStorage } from "react-use-local-storage";

clearLocalStorage();
```

Clears **all `localStorage` entries for the current origin**, including keys written by other code. It also clears the internal cache and notifies subscribers to keys that existed before the operation.

## Storage format

Values are stored in a JSON wrapper with a `value` property:

```ts
setLocalStorageValue("name", "Andrew");

localStorage.getItem("name");
// '{"value":"Andrew"}'
```

Use JSON-compatible data. For example, `Date` becomes a string during serialization; circular objects and `BigInt` cause serialization errors.

Read values are cached by storage key and raw content. Parsed data is passed through `deepFreeze`. Create new values when updating objects:

```tsx
import { useLocalStorageState } from "react-use-local-storage";

type Preferences = {
  theme: "light" | "dark";
};

export const ThemeButton = () => {
  const [preferences, setPreferences] =
    useLocalStorageState<Preferences>("preferences");

  return (
    <button
      onClick={() =>
        setPreferences((previous) => ({ ...previous, theme: "dark" }))
      }
    >
      Theme: {preferences?.theme ?? "light"}
    </button>
  );
};
```

When reading data written by other code, the getter reads the `.value` property of parsed JSON. If parsing or subsequent processing throws, it returns the original nonempty string. Arbitrary JSON without the wrapper is not the library's storage format.

## Synchronization

- In the current window, use the hook's setter or the library utilities to notify subscribers.
- External changes are handled through `storage` events for `localStorage`. The handler supports key updates, removal, and storage clearing.
- Direct calls to `localStorage.setItem()`, `removeItem()`, or `clear()` do not fire a `storage` event in the window that made the change. This subscription does not automatically detect those local writes.
- Cross-tab synchronization requires the same origin: protocol, host, and port.

When writing directly from another tab, use the `JSON.stringify({ value: ... })` format.

## Server-side rendering

The hook's server snapshot is `undefined`. When `window` is unavailable, reads return `undefined`, and writes and clearing are no-ops. After hydration, React uses the client snapshot from `localStorage`.

Provide a fallback for the initial display, such as `value ?? ""`.

## Limitations

- Accessing or writing to `localStorage` can throw, for example when access is denied or the storage quota is exceeded. The library does not catch these errors.
- Updates to multiple keys are not transactional.
- Stored data is not validated against the declared TypeScript type.

## Development

```bash
pnpm install
pnpm test
pnpm run test:watch
pnpm build
```

Build output is written to `.dist`: `index.js` for ESM, `index.cjs` for CommonJS, and type declarations.

Additional commands:

```bash
pnpm lint
pnpm run lint:fix
pnpm format
pnpm run format:check
```

For package maintainers, publish with:

```bash
pnpm release
```

This command builds the package and then publishes it with public access.

## Links

- [Source code](https://github.com/akb2/react-use-local-storage)
- [Report an issue](https://github.com/akb2/react-use-local-storage/issues)

## License

MPL-2.0. Author: akb2.