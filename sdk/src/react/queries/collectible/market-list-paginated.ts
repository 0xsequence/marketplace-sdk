import type { Address } from 'viem';
import { isAddress } from 'viem';
import type {
	ListCollectiblesRequest,
	ListCollectiblesResponse,
} from '../../_internal';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithOptionalParams,
	type WithRequired,
} from '../../_internal';

export interface FetchListCollectiblesPaginatedParams
	extends Omit<ListCollectiblesRequest, 'page'> {
	collectionAddress: Address;
	page?: number;
	pageSize?: number;
}

export type ListCollectiblesPaginatedQueryOptions =
	SdkQueryParams<FetchListCollectiblesPaginatedParams>;

/**
 * Fetches a list of collectibles with pagination support from the Marketplace API
 */
export async function fetchListCollectiblesPaginated(
	params: WithRequired<
		ListCollectiblesPaginatedQueryOptions,
		'chainId' | 'collectionAddress' | 'side' | 'config'
	>,
): Promise<ListCollectiblesResponse> {
	const {
		collectionAddress,
		chainId,
		config,
		page = 1,
		pageSize = 30,
		...additionalApiParams
	} = params;
	const marketplaceClient = getMarketplaceClient(config);

	return await marketplaceClient.listCollectibles({
		collectionAddress,
		chainId,
		page: {
			page,
			pageSize,
		},
		...additionalApiParams,
	});
}

/**
 * Query key structure: [resource, operation, params]
 * @example ['collectible', 'market-list-paginated', { chainId, contractAddress, side, filter, page }]
 */
export function getListCollectiblesPaginatedQueryKey(
	params: ListCollectiblesPaginatedQueryOptions,
) {
	return [
		'collectible',
		'market-list-paginated',
		{
			chainId: params.chainId ?? 0,
			collectionAddress: params.collectionAddress ?? '',
			side: params.side,
			filter: params.filter,
			page: params.page,
			pageSize: params.pageSize,
		},
	] as const;
}

export function listCollectiblesPaginatedQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			ListCollectiblesPaginatedQueryOptions,
			'collectionAddress' | 'chainId' | 'side' | 'config'
		>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getListCollectiblesPaginatedQueryKey,
			requiredParams: [
				'collectionAddress',
				'chainId',
				'side',
				'config',
			] as const,
			fetcher: fetchListCollectiblesPaginated,
			customValidation: (p) =>
				!!p.collectionAddress && isAddress(p.collectionAddress),
		},
		params,
	);
}
