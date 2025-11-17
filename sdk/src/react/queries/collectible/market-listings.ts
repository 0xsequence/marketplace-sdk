import type {
	ListCollectibleListingsResponse,
	ListListingsForCollectibleRequest,
} from '@0xsequence/marketplace-api';
import type { SdkConfig } from '../../../types';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type WithOptionalParams,
} from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchListListingsForCollectibleParams
	extends Omit<ListListingsForCollectibleRequest, 'tokenId'> {
	collectibleId: bigint;
	config: SdkConfig;
	query?: StandardQueryOptions;
}

/**
 * Fetches listings for a specific collectible from the Marketplace API
 */
export async function fetchListListingsForCollectible(
	params: FetchListListingsForCollectibleParams,
): Promise<ListCollectibleListingsResponse> {
	const { chainId, collectibleId, config, ...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);

	return await marketplaceClient.listListingsForCollectible({
		chainId,
		tokenId: collectibleId,
		...additionalApiParams,
	});
}

export type ListListingsForCollectibleQueryOptions =
	WithOptionalParams<FetchListListingsForCollectibleParams>;

export function getListListingsForCollectibleQueryKey(
	params: ListListingsForCollectibleQueryOptions,
) {
	return [
		'collectible',
		'market-listings',
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? '',
			tokenId: params.collectibleId ?? 0n,
			filter: params.filter,
			page: params.page,
		},
	] as const;
}

export function listListingsForCollectibleQueryOptions(
	params: ListListingsForCollectibleQueryOptions,
) {
	return buildQueryOptions(
		{
			getQueryKey: getListListingsForCollectibleQueryKey,
			requiredParams: [
				'chainId',
				'collectionAddress',
				'collectibleId',
				'config',
			] as const,
			fetcher: fetchListListingsForCollectible,
		},
		params,
	);
}
