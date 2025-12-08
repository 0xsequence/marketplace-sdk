import type { Order } from '@0xsequence/api-client';
import {
	buildQueryOptions,
	type GetLowestPriceListingForCollectibleRequest,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';

export type LowestListingQueryOptions =
	SdkQueryParams<GetLowestPriceListingForCollectibleRequest>;

export async function fetchLowestListing(
	params: WithRequired<
		LowestListingQueryOptions,
		'chainId' | 'collectionAddress' | 'tokenId' | 'config'
	>,
): Promise<Order | undefined> {
	const { config, ...apiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const result =
		await marketplaceClient.getLowestPriceListingForCollectible(apiParams);
	return result.order;
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

export function lowestListingQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			LowestListingQueryOptions,
			'chainId' | 'collectionAddress' | 'tokenId' | 'config'
		>
	>,
): ReturnType<
	typeof buildQueryOptions<
		WithRequired<
			LowestListingQueryOptions,
			'chainId' | 'collectionAddress' | 'tokenId' | 'config'
		>,
		Order | undefined,
		readonly ['chainId', 'collectionAddress', 'tokenId', 'config']
	>
> {
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
