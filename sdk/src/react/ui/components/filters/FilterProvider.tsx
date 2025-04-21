'use client';

import { type ReactNode, createContext } from 'react';

import { useFilterState } from './useFilterState';

const FilterContext = createContext<ReturnType<typeof useFilterState> | null>(
	null,
);

interface FilterProviderProps {
	children: ReactNode;
}

export function FilterProvider({ children }: FilterProviderProps) {
	const filterState = useFilterState();
	return (
		<FilterContext.Provider value={filterState}>
			{children}
		</FilterContext.Provider>
	);
}
