import type { Order } from '@0xsequence/api-client';
import { isAddress } from 'viem';
import {
	buildQueryOptions,
	type GetHighestPriceOfferForCollectibleRequest,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';

export type HighestOfferQueryOptions =
	SdkQueryParams<GetHighestPriceOfferForCollectibleRequest>;

/**
 * Fetches the highest offer for a collectible from the marketplace API
 */
export async function fetchHighestOffer(
	params: WithRequired<
		HighestOfferQueryOptions,
		'chainId' | 'collectionAddress' | 'tokenId' | 'config'
	>,
): Promise<Order | undefined> {
	const { config, ...apiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const result =
		await marketplaceClient.getHighestPriceOfferForCollectible(apiParams);
	return result.order;
}

export function getHighestOfferQueryKey(params: HighestOfferQueryOptions) {
	return [
		'collectible',
		'market-highest-offer',
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? '',
			tokenId: params.tokenId ?? 0n,
			filter: params.filter,
		},
	] as const;
}

export function highestOfferQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			HighestOfferQueryOptions,
			'chainId' | 'collectionAddress' | 'tokenId' | 'config'
		>
	>,
): ReturnType<
	typeof buildQueryOptions<
		WithRequired<
			HighestOfferQueryOptions,
			'chainId' | 'collectionAddress' | 'tokenId' | 'config'
		>,
		Order | undefined,
		readonly ['chainId', 'collectionAddress', 'tokenId', 'config']
	>
> {
	return buildQueryOptions(
		{
			getQueryKey: getHighestOfferQueryKey,
			requiredParams: [
				'chainId',
				'collectionAddress',
				'tokenId',
				'config',
			] as const,
			fetcher: fetchHighestOffer,
			customValidation: (p) =>
				!!p.collectionAddress && isAddress(p.collectionAddress),
		},
		params,
	);
}
