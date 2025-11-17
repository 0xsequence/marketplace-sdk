import type { Address, OrderFilter } from '@0xsequence/marketplace-api';
import type { SdkConfig } from '../../../types';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type WithOptionalParams,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchCountOffersForCollectibleParams {
	chainId: number;
	collectionAddress: Address;
	tokenId: bigint;
	config: SdkConfig;
	filter?: OrderFilter;
	query?: StandardQueryOptions;
}

/**
 * Fetches count of offers for a collectible from the marketplace API
 */
export async function fetchCountOffersForCollectible(
	params: FetchCountOffersForCollectibleParams,
) {
	const { chainId, collectionAddress, tokenId, config, filter } = params;

	const client = getMarketplaceClient(config);

	const result = await client.getCountOfOffersForCollectible({
		chainId,
		collectionAddress,
		tokenId,
		filter,
	});
	return result.count;
}

export type CountOffersForCollectibleQueryOptions =
	WithOptionalParams<FetchCountOffersForCollectibleParams>;

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
	params: CountOffersForCollectibleQueryOptions,
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
		},
		params,
	);
}
