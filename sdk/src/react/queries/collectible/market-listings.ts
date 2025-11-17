import type {
	ListCollectibleListingsResponse,
	ListListingsForCollectibleRequest,
} from '@0xsequence/marketplace-api';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithRequired,
} from '../../_internal';

export type ListListingsForCollectibleQueryOptions = SdkQueryParams<
	Omit<ListListingsForCollectibleRequest, 'tokenId'> & {
		collectibleId: bigint;
	}
>;

/**
 * Fetches listings for a specific collectible from the Marketplace API
 */
export async function fetchListListingsForCollectible(
	params: WithRequired<
		ListListingsForCollectibleQueryOptions,
		'chainId' | 'collectionAddress' | 'collectibleId' | 'config'
	>,
): Promise<ListCollectibleListingsResponse> {
	const { chainId, collectibleId, config, ...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);

	return await marketplaceClient.listListingsForCollectible({
		chainId,
		tokenId: collectibleId,
		...additionalApiParams,
	});
}

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
