import type { Page, SdkConfig } from '../../../types';
import type { CardType } from '../../../types/types';
import { compareAddress } from '../../../utils';
import type {
	ListCollectiblesRequest,
	ListCollectiblesResponse,
	WithOptionalInfiniteParams,
} from '../../_internal';
import {
	buildInfiniteQueryOptions,
	getMarketplaceClient,
} from '../../_internal';
import type { StandardInfiniteQueryOptions } from '../../types/query';
import { fetchMarketplaceConfig } from '../marketplace/config';

export interface FetchListCollectiblesParams extends ListCollectiblesRequest {
	cardType?: CardType;
	config: SdkConfig;
	query?: StandardInfiniteQueryOptions;
	enabled?: boolean;
}

/**
 * Fetches a list of collectibles with pagination support from the Marketplace API
 */
export async function fetchListCollectibles(
	params: FetchListCollectiblesParams,
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

export type ListCollectiblesQueryOptions =
	WithOptionalInfiniteParams<FetchListCollectiblesParams>;

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
	params: ListCollectiblesQueryOptions,
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
