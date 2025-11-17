import type { MarketplaceAPI } from '@0xsequence/marketplace-api';
import {
	buildQueryOptions,
	type GetLowestPriceListingForCollectibleRequest,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithRequired,
} from '../../_internal';

export type LowestListingQueryOptions =
	SdkQueryParams<GetLowestPriceListingForCollectibleRequest>;

/**
 * Fetches the lowest listing for a collectible from the marketplace API
 */
export async function fetchLowestListing(
	params: WithRequired<
		LowestListingQueryOptions,
		'chainId' | 'collectionAddress' | 'tokenId' | 'config'
	>,
): Promise<MarketplaceAPI.GetCollectibleLowestListingResponse['order'] | null> {
	const { config, ...apiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const result =
		await marketplaceClient.getLowestPriceListingForCollectible(apiParams);
	return result.order || null;
}

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
