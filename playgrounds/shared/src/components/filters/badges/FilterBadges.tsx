'use client';

import { Button } from '@0xsequence/design-system';
import { useFilterState } from '@0xsequence/marketplace-sdk/react';
import { type PropertyFilter, PropertyType } from '@0xsequence/metadata';
import { useCallback } from 'react';
import type { Address } from 'viem';
import { IntBadge } from './IntBadge';
import { PriceBadge } from './PriceBadge';
import { StringAndArrayBadge } from './StringAndArrayBadge';

interface FilterBadgesProps {
	chainId: number;
	collectionAddress: Address;
}

export const FilterBadges = ({
	chainId,
	collectionAddress,
}: FilterBadgesProps) => {
	const { filterOptions, priceFilters, clearAllFilters, getFilter } =
		useFilterState();

	const getFilterType = useCallback(
		(name: string) => getFilter(name)?.type,
		[getFilter],
	);

	const hasFilters = filterOptions.length > 0 || priceFilters.length > 0;

	if (!hasFilters) return null;

	return (
		<div className="w-full bg-background-primary pb-3">
			<div className="flex w-full flex-wrap gap-2">
				{/* Property filters */}
				{filterOptions.map((filter: PropertyFilter) => {
					const filterType = getFilterType(filter.name);

					switch (filterType) {
						case PropertyType.STRING:
						case PropertyType.ARRAY:
							if (filter?.values?.length) {
								return (
									<StringAndArrayBadge
										key={`string-${filter.name}`}
										filter={filter}
									/>
								);
							}
							return null;
						case PropertyType.INT:
							return (
								<IntBadge
									key={`int-${filter.name}`}
									name={filter.name}
									min={filter.min}
									max={filter.max}
								/>
							);
						default:
							return null;
					}
				})}

				{/* Price filters */}
				{priceFilters.map((priceFilter) => (
					<PriceBadge
						key={`price-${priceFilter.contractAddress}`}
						priceFilter={priceFilter}
						chainId={chainId}
						collectionAddress={collectionAddress}
					/>
				))}

				{hasFilters && (
					<Button
						className="rounded-lg bg-background-secondary"
						size="xs"
						variant="secondary"
						onClick={clearAllFilters}
						shape="square"
					>
						Clear all
					</Button>
				)}
			</div>
		</div>
	);
};
