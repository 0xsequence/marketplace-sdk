import type { GetFiltersArgs, PropertyFilter } from '@0xsequence/api-client';
import { isAddress } from 'viem';
import { FilterCondition } from '../../../types';
import { compareAddress } from '../../../utils';
import {
	buildQueryOptions,
	getMetadataClient,
	getQueryClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';
import { marketplaceConfigOptions } from './config';
import { createMarketplaceQueryKey } from './queryKeys';

export type FetchFiltersParams = GetFiltersArgs;

/**
 * Fetches collection filters from the Metadata API with optional marketplace filtering
 */
export async function fetchFilters(
	params: WithRequired<
		FiltersQueryOptions,
		'chainId' | 'collectionAddress' | 'config'
	>,
): Promise<PropertyFilter[]> {
	const {
		chainId,
		collectionAddress,
		showAllFilters,
		excludePropertyValues,
		config,
	} = params;

	const metadataClient = getMetadataClient(config);

	const result = await metadataClient.getTokenMetadataPropertyFilters({
		chainId,
		collectionAddress,
		excludeProperties: [],
		excludePropertyValues,
	});

	const filters = result.filters as PropertyFilter[];

	if (showAllFilters) return filters;

	const queryClient = getQueryClient();
	const marketplaceConfig = await queryClient.fetchQuery(
		marketplaceConfigOptions(config),
	);
	const collectionFilters = marketplaceConfig.market.collections.find((c) =>
		compareAddress(c.itemsAddress, collectionAddress),
	)?.filterSettings;

	const filterOrder = collectionFilters?.filterOrder;
	const exclusions = collectionFilters?.exclusions;
	let sortedFilters = filters;

	if (filterOrder) {
		sortedFilters = filters.toSorted((a, b) => {
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
	}

	if (exclusions) {
		sortedFilters = sortedFilters.reduce<PropertyFilter[]>((acc, filter) => {
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
		}, []);
	}

	return sortedFilters;
}

export type FiltersQueryOptions = SdkQueryParams<FetchFiltersParams>;

export function getFiltersQueryKey(params: FiltersQueryOptions) {
	const apiArgs = {
		chainId: params.chainId,
		collectionAddress: params.collectionAddress,
		excludeProperties: undefined,
		excludePropertyValues: params.excludePropertyValues,
	};

	return createMarketplaceQueryKey('filters', {
		...apiArgs,
		showAllFilters: params.showAllFilters,
	});
}

export function filtersQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			FiltersQueryOptions,
			'chainId' | 'collectionAddress' | 'config'
		>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getFiltersQueryKey,
			requiredParams: ['chainId', 'collectionAddress', 'config'] as const,
			fetcher: fetchFilters,
			customValidation: (p) =>
				!!p.collectionAddress && isAddress(p.collectionAddress),
		},
		params,
	);
}
