# simple-scoped-zustand

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

> Helping to make zustand stores easier

## Install

```bash
pnpm install simple-scoped-zustand
```

## Usage

```ts
import { createScopedStore } from 'simple-scoped-zustand';

export const useCatStore = create(
  combine(
    {
      cats: [
        {
          id: 1,
          color: 'black',
          name: 'Felix',
        },
        {
          id: 2,
          color: 'orange',
          name: 'Garfield',
        },
        {
          id: 3,
          color: 'white',
          name: 'Snowball',
        },
      ] as Cat[],
      selectedCatId: null as number | null,
    },
    set => ({
      selectCat: (id: number) => {
        set({ selectedCatId: id });
      },
    })
  )
);

export const [CurrentCatProvider, useCurrentCat] = createScopedStore(
  useCatStore,
  store =>
    ({ id }: { id: number }) => {
      const cat = store.cats.find(cat => cat.id === id);
      if (!cat) throw new Error(`No cat found with id ${id}`);
      return cat;
    }
);

export function MyComponent() {
  const [id, setId] = useState(1);

  return (
    <>
      <button onClick={() => setId(1)}>Set cat id to 1</button>
      <button onClick={() => setId(2)}>Set cat id to 2</button>
      <button onClick={() => setId(3)}>Set cat id to 3</button>
      <button onClick={() => setId(4)}>Set cat id to 4</button>
      <CurrentCatProvider id={id}>
        <CatScreen />
      </CurrentCatProvider>
    </>
  );
}

function CatScreen() {
  const cat = useCurrentCat();
  const color = useCurrentCat(cat => cat.color);
  return (
    <div>
      name: {cat.name}, color: {color}
    </div>
  );
}
```

## API

### `createScopedStore(initialStore, scope)`

Creates a scoped store and provides a React context for it. This allows for creating a subset ("scope") of a larger store that can be provided and consumed using React Context.

#### Parameters

- **initialStore** (`UseScopedStore<StoreState>`): The initial Zustand store or a custom hook that behaves like a store. This store is used as the basis for creating the scoped store.

- **scope** (`(store: StoreState) => (args: ScopeArgs) => ScopeValue`): A function that takes the store state and returns another function. This returned function takes `ScopeArgs` and returns a `ScopeValue`, defining the scope of the store.

#### Returns

An array containing two elements:

1. **StoreProvider** (`React.FC<StoreProviderProps>`): A React context provider component that provides the scoped store value to its children. It accepts all scope arguments as props in addition to `children`.

2. **useStore** (`function`): A hook that allows consuming the scoped store value. It can be called with a selector function to select a part of the scoped store value.

### Types

- **`UseScopedStore<S>`**: A union type that either represents a Zustand store or a function that directly returns the store state or a selected part of it.

- **`ScopeArgs`**: The type of arguments passed to the `scope` function to define or modify the scope of the store.

- **`ScopeValue`**: The type of value returned by the `scope` function, representing the scoped part of the store.

### Usage

```jsx
const [StoreProvider, useStore] = createScopedStore(initialStore, scope);

// Inside a component
return (
  <StoreProvider {...scopeArgs}>
    {/* Children that can use useStore hook */}
  </StoreProvider>
);
```

#### `StoreProvider` Props

- **children** (`React.ReactNode`): The children that will have access to the scoped store.
- **...scopeArgs** (`ScopeArgs`): Arguments required by the `scope` function to define the scoped store value.

#### `useStore()`

When called without arguments, it returns the entire scoped store value.

```jsx
const scopedValue = useStore();
```

#### `useStore(selector)`

- **selector** (`(state: ScopeValue) => U`): A function that selects a part of the scoped store value.

Returns the result of the selector function applied to the scoped store value.

```jsx
const selectedValue = useStore(state => state.partOfScopedValue);
```

[build-img]: https://github.com/veloii/simple-scoped-zustand/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/veloii/simple-scoped-zustand/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/simple-scoped-zustand
[downloads-url]: https://www.npmtrends.com/simple-scoped-zustand
[npm-img]: https://img.shields.io/npm/v/simple-scoped-zustand
[npm-url]: https://www.npmjs.com/package/simple-scoped-zustand
[issues-img]: https://img.shields.io/github/issues/veloii/simple-scoped-zustand
[issues-url]: https://github.com/veloii/simple-scoped-zustand/issues
[codecov-img]: https://codecov.io/gh/veloii/simple-scoped-zustand/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/veloii/simple-scoped-zustand
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
