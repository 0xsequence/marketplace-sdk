import type { GetCollectionDetailRequest } from '@0xsequence/marketplace-api';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithRequired,
} from '../../_internal';

export type MarketCollectionDetailQueryOptions =
	SdkQueryParams<GetCollectionDetailRequest>;

/**
 * Fetches collection details from the marketplace API
 */
export async function fetchMarketCollectionDetail(
	params: WithRequired<
		MarketCollectionDetailQueryOptions,
		'collectionAddress' | 'chainId' | 'config'
	>,
) {
	const { config, ...apiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const result = await marketplaceClient.getCollectionDetail(apiParams);
	return result.collection;
}

export function getCollectionMarketDetailQueryKey(
	params: MarketCollectionDetailQueryOptions,
) {
	return [
		'collection',
		'market-detail',
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? '',
		},
	] as const;
}

export function collectionMarketDetailQueryOptions(
	params: MarketCollectionDetailQueryOptions,
) {
	return buildQueryOptions(
		{
			getQueryKey: getCollectionMarketDetailQueryKey,
			requiredParams: ['collectionAddress', 'chainId', 'config'] as const,
			fetcher: fetchMarketCollectionDetail,
		},
		params,
	);
}
