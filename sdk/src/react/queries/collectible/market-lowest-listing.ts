import type { MarketplaceAPI } from '@0xsequence/marketplace-api';
import type { SdkConfig } from '../../../types';
import {
	buildQueryOptions,
	type GetLowestPriceListingForCollectibleRequest,
	getMarketplaceClient,
	type WithOptionalParams,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchLowestListingParams
	extends GetLowestPriceListingForCollectibleRequest {
	config: SdkConfig;
	query?: StandardQueryOptions;
}

/**
 * Fetches the lowest listing for a collectible from the marketplace API
 */
export async function fetchLowestListing(
	params: FetchLowestListingParams,
): Promise<MarketplaceAPI.GetCollectibleLowestListingResponse['order'] | null> {
	const { chainId, config, ...additionalApiParams } = params;

	const marketplaceClient = getMarketplaceClient(config);

	const result = await marketplaceClient.getLowestPriceListingForCollectible({
		chainId,
		...additionalApiParams,
	});
	return result.order || null;
}

export type LowestListingQueryOptions =
	WithOptionalParams<FetchLowestListingParams>;

export function getLowestListingQueryKey(params: LowestListingQueryOptions) {
	return [
		'collectible',
		'market-lowest-listing',
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? '',
			tokenId: params.tokenId ?? 0n,
			filter: params.filter,
		},
	] as const;
}

export function lowestListingQueryOptions(params: LowestListingQueryOptions) {
	return buildQueryOptions(
		{
			getQueryKey: getLowestListingQueryKey,
			requiredParams: [
				'chainId',
				'collectionAddress',
				'tokenId',
				'config',
			] as const,
			fetcher: fetchLowestListing,
		},
		params,
	);
}
