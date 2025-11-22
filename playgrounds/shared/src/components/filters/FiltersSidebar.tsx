import { Scroll, Separator, Switch, Text } from '@0xsequence/design-system';
import type { PropertyFilter } from '@0xsequence/marketplace-sdk';
import {
	useFilterState,
	useFiltersProgressive,
} from '@0xsequence/marketplace-sdk/react';
import type { Address } from 'viem';
import { PriceFilter } from './PriceFilter';
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

	const { showPriceFilter, setShowPriceFilter } = useFilterState();

	return (
		<div className="[&>div]:before:to-transparent">
			<div className="flex items-center justify-between">
				<Text className="font-bold text-sm">Filter on price</Text>

				<Switch
					checked={showPriceFilter}
					onCheckedChange={setShowPriceFilter}
				/>
			</div>

			<Separator />

			{showPriceFilter && (
				<PriceFilter chainId={chainId} collectionAddress={collectionAddress} />
			)}

			<Scroll className={'h-full pr-0'}>
				<div className={'flex w-full flex-col'}>
					{error ? (
						<div className="flex flex-col rounded-md bg-background-error">
							<Text className="text-error text-xs">
								Failed to load filters. Please try again.
							</Text>
						</div>
					) : (
						<PropertyFiltersList
							collectibleFilters={collectableFilters}
							collectibleFiltersNamesLoading={isLoadingNames}
							collectibleFiltersValuesLoading={isFetchingValues}
							collectibleFiltersLoading={collectableFiltersLoading}
						/>
					)}
				</div>
			</Scroll>
		</div>
	);
}

type PropertyFiltersListProps = {
	collectibleFilters: PropertyFilter[] | undefined;
	collectibleFiltersNamesLoading: boolean;
	collectibleFiltersValuesLoading: boolean;
	collectibleFiltersLoading: boolean;
};

function PropertyFiltersList({
	collectibleFilters,
	collectibleFiltersNamesLoading,
	collectibleFiltersValuesLoading,
	collectibleFiltersLoading,
}: PropertyFiltersListProps) {
	if (
		collectibleFilters &&
		collectibleFilters.length > 0 &&
		!collectibleFiltersLoading
	) {
		return (
			<div className="flex flex-col gap-3" style={{ width: 200 }}>
				<PropertyFilters
					filters={collectibleFilters}
					filterNamesLoading={collectibleFiltersNamesLoading}
					filterValuesLoading={collectibleFiltersValuesLoading}
				/>
			</div>
		);
	}

	return null;
}

export { FiltersSidebar };
