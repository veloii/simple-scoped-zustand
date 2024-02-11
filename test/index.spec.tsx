import { createScopedStore } from "../src";
import { render, renderHook } from "@testing-library/react";
import { create } from "zustand";
import { combine } from "zustand/middleware";
import React from "react";

describe("index", () => {
	describe("createScopedStore", () => {
		type Cat = {
			id: number;
			color: string;
			name: string;
		};

		const usePageStore = create(
			combine(
				{
					cats: [
						{
							id: 1,
							color: "black",
							name: "Felix",
						},
						{
							id: 2,
							color: "orange",
							name: "Garfield",
						},
						{
							id: 3,
							color: "white",
							name: "Snowball",
						},
					] as Cat[],
					selectedCatId: null as number | null,
				},
				(set) => ({
					selectCat: (id: number) => {
						set({ selectedCatId: id });
					},
				}),
			),
		);

		it("should sucessfully create a scoped store", () => {
			const [CurrentCatProvider, useCurrentCat] = createScopedStore(
				usePageStore,
				(store) =>
					({ id }: { id: number }) => {
						const cat = store.cats.find((cat) => cat.id === id);
						if (!cat) throw new Error(`No cat found with id ${id}`);
						return cat;
					},
			);

			const wrapper = ({ children }: { children: React.ReactNode }) => (
				<CurrentCatProvider id={1}>{children}</CurrentCatProvider>
			);
			const { result: cat } = renderHook(() => useCurrentCat(), { wrapper });
			expect(cat.current.id).toBe(1);

			const { result: catId } = renderHook(
				() => useCurrentCat((cat) => cat.id),
				{
					wrapper,
				},
			);

			expect(catId.current).toBe(1);
		});

		it("should throw if not wrapped in a provider", () => {
			const [_, useCurrentCat] = createScopedStore(
				usePageStore,
				(store) =>
					({ id }: { id: number }) => {
						const cat = store.cats.find((cat) => cat.id === id);
						if (!cat) throw new Error(`No cat found with id ${id}`);
						return cat;
					},
			);

			function DummyComponent() {
				useCurrentCat();
				return <div />;
			}

			const renderComponent = () => render(<DummyComponent />);
			expect(renderComponent).toThrow(
				"useStore must be used within a StoreProvider.",
			);
		});
	});
});
