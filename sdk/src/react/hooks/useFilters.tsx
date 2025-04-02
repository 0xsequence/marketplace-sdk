import type { PropertyFilter } from '@0xsequence/metadata';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { FilterCondition, type SdkConfig } from '../../types';
import { compareAddress } from '../../utils';
import {
	AddressSchema,
	ChainIdSchema,
	QueryArgSchema,
	collectableKeys,
	getMetadataClient,
	getQueryClient,
} from '../_internal';
import { useConfig } from './useConfig';
import { marketplaceConfigOptions } from './useMarketplaceConfig';

const UseFiltersSchema = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	collectionAddress: AddressSchema,
	showAllFilters: z.boolean().default(false).optional(),
	query: QueryArgSchema,
});

export type UseFiltersArgs = z.infer<typeof UseFiltersSchema>;

export type UseFilterReturn = Awaited<ReturnType<typeof fetchFilters>>;

export const fetchFilters = async (args: UseFiltersArgs, config: SdkConfig) => {
	const parsedArgs = UseFiltersSchema.parse(args);
	const metadataClient = getMetadataClient(config);

	const filters = await metadataClient
		.getTokenMetadataPropertyFilters({
			chainID: parsedArgs.chainId,
			contractAddress: parsedArgs.collectionAddress,
			excludeProperties: [], // TODO: We can leverage this for some of the exclusion logic
		})
		.then((resp) => resp.filters);

	if (args.showAllFilters) return filters;

	const queryClient = getQueryClient();
	const marketplaceConfig = await queryClient.fetchQuery(
		marketplaceConfigOptions(config),
	);
	const collectionFilters = marketplaceConfig.collections.find((c) =>
		compareAddress(c.address, parsedArgs.collectionAddress),
	)?.filterSettings;

	if (
		!collectionFilters?.exclusions ||
		collectionFilters.exclusions.length === 0 ||
		!collectionFilters.filterOrder ||
		collectionFilters.filterOrder.length === 0
	)
		return filters;

	const { filterOrder, exclusions } = collectionFilters;

	// Sort the filters based on the filterOrder, the filters that are not in the filterOrder are at the end
	const sortedFilters = filters.toSorted((a, b) => {
		const aIndex =
			filterOrder.indexOf(a.name) > -1
				? filterOrder.indexOf(a.name)
				: filterOrder.length;
		const bIndex =
			filterOrder.indexOf(b.name) > -1
				? filterOrder.indexOf(b.name)
				: filterOrder.length;
		return aIndex - bIndex;
	});

	const filteredResults = sortedFilters.reduce<PropertyFilter[]>(
		(acc, filter) => {
			// Check if this filter should be excluded
			const exclusionRule = exclusions.find((rule) => rule.key === filter.name);

			if (!exclusionRule) {
				// No exclusion rule, include the filter
				acc.push(filter);
				return acc;
			}

			if (exclusionRule.condition === FilterCondition.ENTIRE_KEY) {
				// Skip this filter entirely
				return acc;
			}

			if (
				exclusionRule.condition === FilterCondition.SPECIFIC_VALUE &&
				exclusionRule.value
			) {
				// Filter out specific values while keeping the filter
				const filteredValues =
					filter.values?.filter((value) => value !== exclusionRule.value) || [];
				if (filteredValues.length > 0) {
					acc.push({ ...filter, values: filteredValues });
				}
			}

			return acc;
		},
		[],
	);

	return filteredResults;
};

export const filtersOptions = (args: UseFiltersArgs, config: SdkConfig) => {
	return queryOptions({
		...args.query,
		queryKey: [...collectableKeys.filter, args, config],
		queryFn: () => fetchFilters(args, config),
	});
};

export const useFilters = (args: UseFiltersArgs) => {
	const config = useConfig();
	return useQuery(filtersOptions(args, config));
};
