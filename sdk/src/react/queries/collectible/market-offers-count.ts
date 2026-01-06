import type {
	GetCountOfOffersForCollectibleRequest,
	OrderFilter,
} from '@0xsequence/api-client';
import { isAddress } from 'viem';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';

export interface FetchCountOffersForCollectibleParams
	extends GetCountOfOffersForCollectibleRequest {
	filter?: OrderFilter;
}

export type CountOffersForCollectibleQueryOptions =
	SdkQueryParams<FetchCountOffersForCollectibleParams>;

/**
 * Fetches count of offers for a collectible from the marketplace API
 */
export async function fetchCountOffersForCollectible(
	params: WithRequired<
		CountOffersForCollectibleQueryOptions,
		'chainId' | 'collectionAddress' | 'tokenId' | 'config'
	>,
) {
	const { config, ...apiParams } = params;
	const client = getMarketplaceClient(config);
	const result = await client.getCountOfOffersForCollectible(apiParams);
	return result.count;
}

export function getCountOffersForCollectibleQueryKey(
	params: CountOffersForCollectibleQueryOptions,
) {
	return [
		'collectible',
		'market-offers-count',
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? '',
			tokenId: params.tokenId ?? 0n,
			filter: params.filter,
		},
	] as const;
}

export function countOffersForCollectibleQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			CountOffersForCollectibleQueryOptions,
			'chainId' | 'collectionAddress' | 'tokenId' | 'config'
		>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getCountOffersForCollectibleQueryKey,
			requiredParams: [
				'chainId',
				'collectionAddress',
				'tokenId',
				'config',
			] as const,
			fetcher: fetchCountOffersForCollectible,
			customValidation: (p) =>
				!!p.collectionAddress && isAddress(p.collectionAddress),
		},
		params,
	);
}
