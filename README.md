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
  const [count, setCount] = useLocalStorageState<number>("counter", 0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicks: {count}
    </button>
  );
};
```

The optional second argument is a fallback for a missing key. Without a fallback, a missing key returns `null`. The fallback is used for reading and rendering only; it is not written to storage. Removing the key makes the hook return its fallback again.

## API

### `useLocalStorageState<T>(key, fallback?)`

```ts
const [value, setValue, storageKey] = useLocalStorageState<string>("name", "Guest");
```

| Element | Description |
| --- | --- |
| `value` | The stored value, or the fallback for a missing key (`null` by default) |
| `setValue` | Writes a new value; accepts nullable values for removal |
| `storageKey` | The key passed to the hook |

```ts
setValue("Andrew");
setValue(`${value}!`);
setValue(null); // Removes the key; this hook returns "Guest" again.
```

The hook's setter is typed as `Dispatch<Nullable<T>>`: pass a value directly. Functional updater callbacks are not part of this public hook signature.

A non-null fallback selects an overload with a non-null return type. This is a TypeScript declaration, not runtime validation of existing storage data.

For object or array fallbacks, reuse a stable reference so that repeated snapshot reads return the same value when the key is missing:

```ts
const DEFAULT_PREFERENCES = { theme: "light" as const };

// Inside a component:
const [preferences, setPreferences] = useLocalStorageState<{
  theme: "light" | "dark";
}>("preferences", DEFAULT_PREFERENCES);
```

Avoid passing a newly created object or array as the fallback on every render, especially during server rendering and hydration.

### `getLocalStorageValue<T>(key, fallback?)`

Reads a value without creating a React subscription:

```ts
import { getLocalStorageValue } from "react-use-local-storage";

const name = getLocalStorageValue<string>("name", "Guest");
const missing = getLocalStorageValue<string>("missing"); // null if absent
```

Returns the fallback when the key is missing or `window` is unavailable. An omitted, `null`, or `undefined` fallback is normalized to `null` by the getter. The generic type `T` describes the expected value; it does not validate stored data at runtime.

### `setLocalStorageValue<T>(key, value)`

Writes a value and notifies subscribers to that key in the current window:

```ts
import { setLocalStorageValue } from "react-use-local-storage";

setLocalStorageValue("name", "Andrew");
setLocalStorageValue<number>("counter", 1);
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
        setPreferences({ ...preferences, theme: "dark" })
      }
    >
      Theme: {preferences?.theme ?? "light"}
    </button>
  );
};
```

When reading data written by other code, the getter reads the `.value` property of parsed JSON. If parsing or subsequent processing throws, it returns the original nonempty string. Arbitrary JSON without the wrapper is not the library's storage format.

The fallback does not replace all invalid stored data:

| Stored content | Getter result |
| --- | --- |
| Missing key | Fallback, or `null` by default |
| `{"value":42}` | `42` |
| `{}` | `undefined`, even with a fallback |
| `{"value":null}` | `null`, even with a non-null fallback |
| Nonempty invalid JSON | The original raw string |
| Empty string | Fallback |

The getter currently returns `parsedData` directly after reading `.value`. Therefore, the non-null fallback overload does not guarantee a non-null runtime result for arbitrary existing data.

## Synchronization

- In the current window, use the hook's setter or the library utilities to notify subscribers.
- External changes are handled through `storage` events for `localStorage`. The handler supports key updates, removal, and storage clearing.
- Direct calls to `localStorage.setItem()`, `removeItem()`, or `clear()` do not fire a `storage` event in the window that made the change. This subscription does not automatically detect those local writes.
- Cross-tab synchronization requires the same origin: protocol, host, and port.

When writing directly from another tab, use the `JSON.stringify({ value: ... })` format.

## Server-side rendering

The hook's server snapshot is its fallback (`null` by default). When `window` is unavailable, the getter returns its fallback, and writes and clearing are no-ops. During hydration, use the same fallback on the server and client. After hydration, React uses the client snapshot from `localStorage`.

The fallback does not initialize or overwrite stored data.

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
