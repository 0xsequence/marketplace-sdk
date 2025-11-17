import type { Address, OrderFilter } from '@0xsequence/marketplace-api';
import type { SdkConfig } from '../../../types';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type WithOptionalParams,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchCountListingsForCollectibleParams {
	chainId: number;
	collectionAddress: Address;
	tokenId: bigint;
	config: SdkConfig;
	filter?: OrderFilter;
	query?: StandardQueryOptions;
}

/**
 * Fetches count of listings for a collectible from the marketplace API
 */
export async function fetchCountListingsForCollectible(
	params: FetchCountListingsForCollectibleParams,
) {
	const { chainId, collectionAddress, tokenId, config, filter } = params;

	const client = getMarketplaceClient(config);

	const result = await client.getCountOfListingsForCollectible({
		chainId,
		collectionAddress,
		tokenId,
		filter,
	});
	return result.count;
}

export type CountListingsForCollectibleQueryOptions =
	WithOptionalParams<FetchCountListingsForCollectibleParams>;

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
	params: CountListingsForCollectibleQueryOptions,
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
