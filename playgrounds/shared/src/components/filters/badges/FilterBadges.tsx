'use client';

import { Button } from '@0xsequence/design-system';
import { useFilterState } from '@0xsequence/marketplace-sdk/react';
import { type PropertyFilter, PropertyType } from '@0xsequence/metadata';
import { useCallback } from 'react';
import { IntBadge } from './IntBadge';
import { StringAndArrayBadge } from './StringAndArrayBadge';

export const FilterBadges = () => {
	const { filterOptions, clearAllFilters, getFilter } = useFilterState();

	const getFilterType = useCallback(
		(name: string) => getFilter(name)?.type,
		[getFilter],
	);

	if (!filterOptions.length) return null;

	return (
		<div className="w-full bg-background-primary pb-3">
			<div className="flex w-full flex-wrap gap-2">
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

				{filterOptions.length > 0 && (
					<Button
						className="rounded-lg bg-background-secondary"
						size="xs"
						variant="raised"
						onClick={clearAllFilters}
						label="Clear all"
						shape="square"
					/>
				)}
			</div>
		</div>
	);
};
