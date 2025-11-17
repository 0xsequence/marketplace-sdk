import type { GetCollectionDetailRequest } from '@0xsequence/marketplace-api';
import type { SdkConfig } from '../../../types';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type WithOptionalParams,
} from '../../_internal';

export interface FetchMarketCollectionDetailParams
	extends GetCollectionDetailRequest {
	config: SdkConfig;
}

/**
 * Fetches collection details from the marketplace API
 */
export async function fetchMarketCollectionDetail(
	params: FetchMarketCollectionDetailParams,
) {
	const { chainId, config, ...additionalApiParams } = params;

	const marketplaceClient = getMarketplaceClient(config);

	const apiArgs: GetCollectionDetailRequest = {
		chainId,
		...additionalApiParams,
	};

	const result = await marketplaceClient.getCollectionDetail(apiArgs);
	return result.collection;
}

export type MarketCollectionDetailQueryOptions =
	WithOptionalParams<FetchMarketCollectionDetailParams>;

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
