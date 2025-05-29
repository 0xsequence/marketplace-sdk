import { Scroll, Switch, Text, TextInput } from '@0xsequence/design-system';
import { useEffect, useState } from 'react';
import type { Address } from 'viem';
import {
	useFilterState,
	useFiltersProgressive,
} from '../../../../../sdk/src/react';
import { PropertyFilters } from './PropertyFilters';

const useDebounce = <T,>(value: T, delay: number): T => {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
};

type FiltersSidebarProps = {
	chainId: number;
	collectionAddress: Address;
};

function FiltersSidebar({ chainId, collectionAddress }: FiltersSidebarProps) {
	const {
		data: collectableFilters,
		isLoading: collectableFiltersLoading,
		error,
		isLoadingNames,
		isFetchingValues,
	} = useFiltersProgressive({
		chainId,
		collectionAddress,
	});

	const { searchText, setSearchText, showListedOnly, setShowListedOnly } =
		useFilterState();
	const [localSearchText, setLocalSearchText] = useState(searchText);
	const debouncedSearchText = useDebounce(localSearchText, 300);

	useEffect(() => {
		setSearchText(debouncedSearchText);
	}, [debouncedSearchText, setSearchText]);

	return (
		<div className="[&>div]:before:to-transparent">
			<Scroll className={'h-full pr-0'}>
				<div className={'flex w-full flex-col gap-4'}>
					<div className="mt-4 flex flex-col gap-2">
						<TextInput
							name="search-collectibles"
							value={localSearchText}
							onChange={(e) => setLocalSearchText(e.target.value)}
							placeholder="Search collectibles..."
							className="w-full [&>div>input]:h-8 [&>div>input]:bg-none! [&>div>input]:py-1 [&>div>input]:text-xs [&>div]:h-9 [&>div]:rounded-lg [&>div]:px-2"
						/>
					</div>

					<div className="flex items-center justify-between px-2">
						<Text className="text-primary text-xs">Listed Only</Text>
						<Switch
							checked={showListedOnly}
							onCheckedChange={(checked) => setShowListedOnly(checked)}
							className="data-[state=checked]:bg-primary"
						/>
					</div>

					{error ? (
						<div className="flex flex-col rounded-md bg-background-error">
							<Text className="text-error text-xs">
								Failed to load filters. Please try again.
							</Text>
						</div>
					) : collectableFilters &&
						collectableFilters.length > 0 &&
						!collectableFiltersLoading ? (
						<div className="flex flex-col gap-3" style={{ width: 200 }}>
							<PropertyFilters
								filters={collectableFilters}
								filterNamesLoading={isLoadingNames}
								filterValuesLoading={isFetchingValues}
							/>
						</div>
					) : null}
				</div>
			</Scroll>
		</div>
	);
}

export { FiltersSidebar };
