# Global Store Usage Guide

## 1. Creating a Global Store

Define a class that extends `ObservableStore`. Add your state and methods as class members.

Example (`src/shared/globalStore/keysPress/keysPress.ts`):

```typescript
import { ObservableStore } from "@starter/global-store";
import { TKey } from "@/libs/types/TStore/TKeys";

const VALID_METHODS = [
  "set",
  "add",
  "delete",
  "remove",
  "update",
  "clear",
  "load",
  "create",
  "rename",
  "reset",
  "init",
];

// Only methods that start with these verbs will notify the store to re-render the store.
// Only basic variables (string, number, boolean, array, object, set, map and
// instance class that extends ObservableStore) are reactive.

export class KeysPress extends ObservableStore {
  keysPressed: Set<TKey>;

  constructor() {
    super();
    this.keysPressed = new Set<TKey>([]);
  }

  addKey(key: TKey) {
    this.keysPressed.add(key);
  }

  // ...other methods
}
```

## 2. Registering the Store

Use the `createStore` function to register your store globally. This is usually
done in a dedicated file:

```typescript
import { createStore, storesName } from "@starter/global-store";
import { KeysPress } from "./KeysPress";

const store = new KeysPress();
export const groupStore = createStore(storesName.KeysPress, store);
```

## 3. Accessing the Store in Components

- **Get the whole store reactively:**

  ```typescript
  import { useKeysPress } from "@/shared/globalStore/keysPress/keysPressStore";
  const keysPress = useKeysPress();
  ```

- **Get store methods (auto-bound):**

  ```typescript
  import { useKeysPressFn } from "@/shared/globalStore/keysPress/keysPressStore";
  const { addKey, removeKey } = useKeysPressFn();
  ```

- **Subscribe to specific fields:**
  Use the `useStore` or `useSelectorStore` methods from the store helper.

## 4. Example Usage in a Component

```typescriptreact
import { useKeysPress, useKeysPressFn } from '@/shared/globalStore/keysPress/keysPressStore';

const MyComponent = () => {
  const keysPress = useKeysPress();
  const { addKey } = useKeysPressFn();

  // Use keysPress.keysPressed or call addKey('a')
};
```

---

# Creating Custom Hooks with Store Helpers

You can create custom hooks to access and interact with your store using the
following helper methods:

### 1. `useSelectorStore`

Subscribe to a specific part of the store using a selector function.

```typescript
// Returns only the selectedNode from the store
export const useSelectedNode = () => {
  return selectNodeStore.useSelectorStore((store) => store.selectedNode, []);
};

// Returns whether a node is hovered
export const useNodeHover = (id: string) => {
  return selectNodeStore.useSelectorStore(
    (store) =>
      store.isBlockSelecting
        ? store.hoverNodes.has(id)
        : store.hoverNode === id,
    [id],
  );
};
```

### 2. `useStoreFn`

Access all store methods, auto-bound to the store instance.

```typescript
export const useSelectNodeFn = () => {
  return selectNodeStore.useStoreFn();
};

// Usage in a component
const { selectNode, clearSelection } = useSelectNodeFn();
```

### 3. `useStore`

Subscribe to specific fields by key, returning an object with only those fields.

```typescript
export const useSelectNode = (keys: (keyof SelectNodeState)[]) => {
  return selectNodeStore.useStore(keys);
};

// Usage: const { selectedNode, hoverNode } = useSelectNode([
//   'selectedNode',
//   'hoverNode',
// ]);
```

### 4. `useReactiveStore`

Subscribe to the entire store reactively.

```typescript
export const useSelectNodeStore = () => {
  return selectNodeStore.useReactiveStore();
};

// Usage: const store = useSelectNodeStore();
```

---

# `useStateClass` Hook

## What is `useStateClass`?

`useStateClass` is a React hook for using a class-based state (extending
`ObservableStore`) as a local, component-scoped store. It clones the provided
instance, manages its lifecycle, and provides reactivity.

## Usage

```typescriptreact
import { useStateClass } from '@starter/global-store';
import { Gradient } from '@/shared/features/color/gradient';

const MyComponent = () => {
  const gradient = useStateClass(new Gradient());

  // Use gradient as a reactive class instance
  // e.g., gradient.setAngle(45)
};
```

---

**Summary:**

- Use `createStore` and `helperStore` for global, shared state.
- Use `useStateClass` for local, class-based, reactive state in components.
- Access store data and methods via provided hooks.
- Use `useSelectorStore` to create custom hooks for specific fields or computed values.
