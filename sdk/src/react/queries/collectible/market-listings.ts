import type {
	ListCollectibleListingsResponse,
	ListListingsForCollectibleRequest,
} from '@0xsequence/api-client';
import { isAddress } from 'viem';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';

export type ListListingsForCollectibleQueryOptions =
	SdkQueryParams<ListListingsForCollectibleRequest>;

/**
 * Fetches listings for a specific collectible from the Marketplace API
 */
export async function fetchListListingsForCollectible(
	params: WithRequired<
		ListListingsForCollectibleQueryOptions,
		'chainId' | 'collectionAddress' | 'tokenId' | 'config'
	>,
): Promise<ListCollectibleListingsResponse> {
	const { config, ...apiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);

	return await marketplaceClient.listListingsForCollectible(apiParams);
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
			tokenId: params.tokenId ?? 0n,
			filter: params.filter,
			page: params.page,
		},
	] as const;
}

export function listListingsForCollectibleQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			ListListingsForCollectibleQueryOptions,
			'chainId' | 'collectionAddress' | 'tokenId' | 'config'
		>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getListListingsForCollectibleQueryKey,
			requiredParams: [
				'chainId',
				'collectionAddress',
				'tokenId',
				'config',
			] as const,
			fetcher: fetchListListingsForCollectible,
			customValidation: (p) =>
				!!p.collectionAddress && isAddress(p.collectionAddress),
		},
		params,
	);
}
