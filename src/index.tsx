import type { UseBoundStore, StoreApi } from "zustand";
import React from "react";

// couldn't be bothered to basically recreate the entire zustand api for usestore so we have a union type here for if we want to scope a scoped store
export type UseScopedStore<S> =
	| UseBoundStore<StoreApi<S>>
	| {
			(): S;
			<U>(selector: (state: S) => U): U;
	  };

const identity = <T,>(x: T) => x;

export function createScopedStore<StoreState, ScopeArgs, ScopeValue>(
	initialStore: UseScopedStore<StoreState>,
	scope: (store: StoreState) => (args: ScopeArgs) => ScopeValue,
) {
	const StoreContext = React.createContext<ScopeValue | null>(null);

	type StoreProviderProps = { children?: React.ReactNode } & ScopeArgs;

	const StoreProvider: React.FC<StoreProviderProps> = React.memo(
		function StoreProvider({ children, ...args }) {
			const store = initialStore();
			const scopedValue = scope(store)(args as ScopeArgs);

			return (
				<StoreContext.Provider value={scopedValue}>
					{children}
				</StoreContext.Provider>
			);
		},
	);

	function useStore(): ScopeValue;
	function useStore<U>(selector: (state: ScopeValue) => U): U;
	function useStore<U>(
		selector: (state: ScopeValue) => U = identity as unknown as (
			state: ScopeValue,
		) => U,
	): U {
		const useStore = React.useContext(StoreContext);
		if (!useStore)
			throw new Error("useStore must be used within a StoreProvider.");
		return selector(useStore);
	}

	return [StoreProvider, useStore] as const;
}
