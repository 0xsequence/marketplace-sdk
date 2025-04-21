import { Scroll, Text } from '@0xsequence/design-system';
import { useEffect, useState } from 'react';
import type { Address } from 'viem';
import { useFilters } from '../../../../../sdk/src/react';
import { PropertyFilters } from './PropertyFilters';

type FiltersSidebarProps = {
	chainId: number;
	collectionAddress: Address;
};

function FiltersSidebar({ chainId, collectionAddress }: FiltersSidebarProps) {
	const [excludePropertyValues, setExcludePropertyValues] = useState(true);
	const {
		data: collectableFilters,
		isLoading: collectableFiltersLoading,
		error: collectableFiltersError,
	} = useFilters({
		chainId,
		collectionAddress,
		excludePropertyValues: excludePropertyValues,
	});

	const filterNamesLoaded = collectableFilters?.every(
		(filter) => filter.values?.length === 0,
	);
	const filterValuesLoaded = !collectableFilters?.every(
		(filter) => filter.values?.length === 0,
	);

	useEffect(() => {
		if (filterNamesLoaded) {
			setExcludePropertyValues(false);
		}
	}, [filterNamesLoaded]);

	return (
		<div className="[&>div]:before:to-transparent">
			<Scroll className={'h-full pr-0'}>
				<div className={'flex w-full flex-col'}>
					{collectableFiltersError ? (
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
								filterNamesLoading={collectableFiltersLoading}
								filterValuesLoading={
									!collectableFiltersLoading && !filterValuesLoaded
								}
							/>
						</div>
					) : null}
				</div>
			</Scroll>
		</div>
	);
}

export { FiltersSidebar };
