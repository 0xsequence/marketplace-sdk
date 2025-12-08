import type {
	GetCountOfListingsForCollectibleRequest,
	OrderFilter,
} from '@0xsequence/api-client';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';

export interface FetchCountListingsForCollectibleParams
	extends GetCountOfListingsForCollectibleRequest {
	filter?: OrderFilter;
}

export type CountListingsForCollectibleQueryOptions =
	SdkQueryParams<FetchCountListingsForCollectibleParams>;

/**
 * Fetches count of listings for a collectible from the marketplace API
 */
export async function fetchCountListingsForCollectible(
	params: WithRequired<
		CountListingsForCollectibleQueryOptions,
		'chainId' | 'collectionAddress' | 'tokenId' | 'config'
	>,
) {
	const { config, ...apiParams } = params;
	const client = getMarketplaceClient(config);
	const result = await client.getCountOfListingsForCollectible(apiParams);
	return result.count;
}

export function getCountListingsForCollectibleQueryKey(
	params: CountListingsForCollectibleQueryOptions,
) {
	return [
		'collectible',
		'market-listings-count',
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? '',
			tokenId: params.tokenId ?? 0n,
			filter: params.filter,
		},
	] as const;
}

export function countListingsForCollectibleQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			CountListingsForCollectibleQueryOptions,
			'chainId' | 'collectionAddress' | 'tokenId' | 'config'
		>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getCountListingsForCollectibleQueryKey,
			requiredParams: [
				'chainId',
				'collectionAddress',
				'tokenId',
				'config',
			] as const,
			fetcher: fetchCountListingsForCollectible,
		},
		params,
	);
}
