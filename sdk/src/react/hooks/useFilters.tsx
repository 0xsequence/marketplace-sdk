import type { PropertyFilter } from '@0xsequence/metadata';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { FilterCondition, type SdkConfig } from '../../types';
import { compareAddress } from '../../utils';
import {
	collectableKeys,
	getMetadataClient,
	getQueryClient,
} from '../_internal';
import { marketplaceConfigOptions } from '../queries/marketplaceConfig';
import { useConfig } from './useConfig';

export type UseFiltersArgs = {
	chainId: number;
	collectionAddress: string;
	showAllFilters?: boolean;
	excludePropertyValues?: boolean;
	query?: {
		enabled?: boolean;
	};
};

export type UseFilterReturn = Awaited<ReturnType<typeof fetchFilters>>;

export const fetchFilters = async (args: UseFiltersArgs, config: SdkConfig) => {
	const parsedArgs = args;
	const metadataClient = getMetadataClient(config);

	const filters = await metadataClient
		.getTokenMetadataPropertyFilters({
			chainID: parsedArgs.chainId.toString(),
			contractAddress: parsedArgs.collectionAddress,
			excludeProperties: [],
			excludePropertyValues: parsedArgs.excludePropertyValues,
		})
		.then((resp) => resp.filters);

	if (args.showAllFilters) return filters;

	const queryClient = getQueryClient();
	const marketplaceConfig = await queryClient.fetchQuery(
		marketplaceConfigOptions(config),
	);
	const collectionFilters = marketplaceConfig.market.collections.find((c) =>
		compareAddress(c.itemsAddress, parsedArgs.collectionAddress),
	)?.filterSettings;

	if (
		!collectionFilters?.exclusions ||
		collectionFilters.exclusions.length === 0 ||
		!collectionFilters.filterOrder ||
		collectionFilters.filterOrder.length === 0
	)
		return filters;

	const { filterOrder, exclusions } = collectionFilters;

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
			const exclusionRule = exclusions.find((rule) => rule.key === filter.name);

			if (!exclusionRule) {
				acc.push(filter);
				return acc;
			}

			if (exclusionRule.condition === FilterCondition.ENTIRE_KEY) {
				return acc;
			}

			if (
				exclusionRule.condition === FilterCondition.SPECIFIC_VALUE &&
				exclusionRule.value
			) {
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

export const useFiltersProgressive = (args: UseFiltersArgs) => {
	const config = useConfig();

	const namesQuery = useQuery(
		filtersOptions({ ...args, excludePropertyValues: true }, config),
	);

	const fullQuery = useQuery({
		...filtersOptions(args, config),
		placeholderData: namesQuery.data,
	});

	const isLoadingNames = namesQuery.isLoading;
	const isFetchingValues = fullQuery.isPlaceholderData && fullQuery.isFetching;

	return {
		...fullQuery,
		isFetchingValues,
		isLoadingNames,
	};
};
