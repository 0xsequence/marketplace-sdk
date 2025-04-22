import { Scroll, Text } from '@0xsequence/design-system';
import type { Address } from 'viem';
import { useFiltersProgressive } from '../../../../../sdk/src/react';
import { PropertyFilters } from './PropertyFilters';

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

	return (
		<div className="[&>div]:before:to-transparent">
			<Scroll className={'h-full pr-0'}>
				<div className={'flex w-full flex-col'}>
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
