import type { Page } from '../../../types';
import type { CardType } from '../../../types/types';
import { compareAddress } from '../../../utils';
import type {
	ListCollectiblesRequest,
	ListCollectiblesResponse,
} from '../../_internal';
import {
	buildInfiniteQueryOptions,
	getMarketplaceClient,
	type SdkInfiniteQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';
import { fetchMarketplaceConfig } from '../marketplace/config';

export type ListCollectiblesQueryOptions = SdkInfiniteQueryParams<
	ListCollectiblesRequest & {
		cardType?: CardType;
		enabled?: boolean;
	}
>;

/**
 * Fetches a list of collectibles with pagination support from the Marketplace API
 */
export async function fetchListCollectibles(
	params: WithRequired<
		ListCollectiblesQueryOptions,
		'chainId' | 'collectionAddress' | 'side' | 'config'
	>,
	page: Page,
): Promise<ListCollectiblesResponse> {
	const { chainId, collectionAddress, config, ...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const marketplaceConfig = await fetchMarketplaceConfig({ config });
	const isMarketCollection = marketplaceConfig?.market.collections.some(
		(collection) => compareAddress(collection.itemsAddress, collectionAddress),
	);

	// If it's not a market collection, return an empty list. those collections are not compatible with the ListCollectibles endpoint.
	if (params.enabled === false || !isMarketCollection) {
		return {
			collectibles: [],
			page: {
				page: 1,
				pageSize: 30,
				more: false,
			},
		};
	}

	return await marketplaceClient.listCollectibles({
		chainId,
		collectionAddress,
		page,
		...additionalApiParams,
	});
}

/**
 * Query key structure: [resource, operation, params]
 * @example ['collectible', 'market-list', { chainId, contractAddress, side, filter }]
 */
export function getListCollectiblesQueryKey(
	params: ListCollectiblesQueryOptions,
) {
	return [
		'collectible',
		'market-list',
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? '',
			side: params.side,
			filter: params.filter,
		},
	] as const;
}

export function listCollectiblesQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			ListCollectiblesQueryOptions,
			'chainId' | 'collectionAddress' | 'side' | 'config'
		>
	>,
) {
	return buildInfiniteQueryOptions(
		{
			getQueryKey: getListCollectiblesQueryKey,
			requiredParams: [
				'chainId',
				'collectionAddress',
				'side',
				'config',
			] as const,
			fetcher: fetchListCollectibles,
			getPageInfo: (response) => response.page,
		},
		params,
	);
}
