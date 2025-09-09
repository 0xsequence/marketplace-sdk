import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { SdkConfig } from '../../types';
import type {
	ListCollectibleOffersReturn,
	ListOffersForCollectibleArgs,
	Page,
	SortBy,
	ValuesOptional,
} from '../_internal';
import { collectableKeys, getMarketplaceClient } from '../_internal';
import type { StandardQueryOptions } from '../types/query';

export interface FetchListOffersForCollectibleParams
	extends Omit<
		ListOffersForCollectibleArgs,
		'chainId' | 'contractAddress' | 'tokenId'
	> {
	chainId: number;
	collectionAddress: Address;
	collectibleId: string;
	config: SdkConfig;
	sort?: Array<SortBy>;
}

/**
 * Fetches offers for a specific collectible from the Marketplace API
 */
export async function fetchListOffersForCollectible(
	params: FetchListOffersForCollectibleParams,
): Promise<ListCollectibleOffersReturn> {
	const {
		collectionAddress,
		chainId,
		collectibleId,
		config,
		sort,
		page,
		...additionalApiParams
	} = params;
	const marketplaceClient = getMarketplaceClient(config);

	// Handle backwards compatibility: if sort is provided in page object, use it
	// Otherwise, use the sort parameter directly
	let finalPage = page;
	let finalSort = sort;

	if (page && 'sort' in page && page.sort && !sort) {
		// Backwards compatibility: sort is in page object
		finalSort = page.sort;
		finalPage = {
			page: page.page,
			pageSize: page.pageSize,
			more: page.more,
		} as Page;
	}

	// If sort is provided as top-level parameter, merge it into page
	if (finalSort && finalPage) {
		finalPage = {
			...finalPage,
			sort: finalSort,
		} as Page;
	} else if (finalSort && !finalPage) {
		// Create a minimal page object with default pagination values
		finalPage = {
			page: 1,
			pageSize: 20,
			sort: finalSort,
		} as Page;
	}

	const apiArgs: ListOffersForCollectibleArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		tokenId: collectibleId,
		page: finalPage,
		...additionalApiParams,
	};

	return await marketplaceClient.listCollectibleOffers(apiArgs);
}

export type ListOffersForCollectibleQueryOptions =
	ValuesOptional<FetchListOffersForCollectibleParams> & {
		query?: StandardQueryOptions;
	};

export function listOffersForCollectibleQueryOptions(
	params: ListOffersForCollectibleQueryOptions,
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.collectibleId &&
			params.config &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: [...collectableKeys.offers, params],
		queryFn: () =>
			fetchListOffersForCollectible({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectibleId: params.collectibleId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
				filter: params.filter,
				page: params.page,
				sort: params.sort,
			}),
		...params.query,
		enabled,
	});
}
