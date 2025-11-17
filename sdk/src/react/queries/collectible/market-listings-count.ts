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
	collectibleId: bigint;
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
	const { chainId, collectionAddress, collectibleId, config, filter } = params;

	const client = getMarketplaceClient(config);

	const result = await client.getCountOfListingsForCollectible({
		chainId,
		collectionAddress,
		tokenId: collectibleId,
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
			tokenId: params.collectibleId ?? 0n,
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
				'collectibleId',
				'config',
			] as const,
			fetcher: fetchCountListingsForCollectible,
		},
		params,
	);
}
