import type { PropertyFilter } from '@0xsequence/metadata';
import { queryOptions } from '@tanstack/react-query';
import { FilterCondition, type SdkConfig } from '../../types';
import { compareAddress } from '../../utils';
import {
	getMetadataClient,
	getQueryClient,
	type ValuesOptional,
} from '../_internal';
import type { StandardQueryOptions } from '../types/query';
import { marketplaceConfigOptions } from './marketplaceConfig';

export interface FetchFiltersParams {
	chainId: number;
	collectionAddress: string;
	showAllFilters?: boolean;
	excludePropertyValues?: boolean;
	config: SdkConfig;
}

/**
 * Fetches collection filters from the Metadata API with optional marketplace filtering
 */
export async function fetchFilters(
	params: FetchFiltersParams,
): Promise<PropertyFilter[]> {
	const {
		chainId,
		collectionAddress,
		showAllFilters,
		excludePropertyValues,
		config,
	} = params;

	const metadataClient = getMetadataClient(config);

	const filters = await metadataClient
		.getTokenMetadataPropertyFilters({
			chainID: chainId.toString(),
			contractAddress: collectionAddress,
			excludeProperties: [],
			excludePropertyValues,
		})
		.then((resp) => resp.filters);

	if (showAllFilters) return filters;

	const queryClient = getQueryClient();
	const marketplaceConfig = await queryClient.fetchQuery(
		marketplaceConfigOptions(config),
	);
	const collectionFilters = marketplaceConfig.market.collections.find((c) =>
		compareAddress(c.itemsAddress, collectionAddress),
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
}

export type FiltersQueryOptions = ValuesOptional<FetchFiltersParams> & {
	query?: StandardQueryOptions;
};

export function filtersQueryOptions(params: FiltersQueryOptions) {
	const enabled = Boolean(
		params.chainId &&
			params.collectionAddress &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: ['filters', params],
		queryFn: () =>
			fetchFilters({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				showAllFilters: params.showAllFilters,
				excludePropertyValues: params.excludePropertyValues,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
			}),
		...params.query,
		enabled,
	});
}
