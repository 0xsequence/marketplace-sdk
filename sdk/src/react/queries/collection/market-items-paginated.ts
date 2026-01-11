import type { Address } from '@0xsequence/api-client';
import { isAddress } from 'viem';
import type {
	ListOrdersWithCollectiblesRequest,
	ListOrdersWithCollectiblesResponse,
	WithOptionalParams,
} from '../../_internal';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type SdkQueryParams,
	type WithRequired,
} from '../../_internal';

export interface FetchListItemsOrdersForCollectionPaginatedParams
	extends Omit<ListOrdersWithCollectiblesRequest, 'page'> {
	collectionAddress: Address;
	page?: number;
	pageSize?: number;
}

export type ListItemsOrdersForCollectionPaginatedQueryOptions =
	SdkQueryParams<FetchListItemsOrdersForCollectionPaginatedParams>;

/**
 * Fetches a list of items orders for a collection with pagination support from the Marketplace API
 */
export async function fetchListItemsOrdersForCollectionPaginated(
	params: WithRequired<
		ListItemsOrdersForCollectionPaginatedQueryOptions,
		'chainId' | 'collectionAddress' | 'side' | 'config'
	>,
): Promise<ListOrdersWithCollectiblesResponse> {
	const {
		collectionAddress,
		chainId,
		config,
		page = 1,
		pageSize = 30,
		...additionalApiParams
	} = params;
	const marketplaceClient = getMarketplaceClient(config);

	return await marketplaceClient.listOrdersWithCollectibles({
		collectionAddress,
		chainId,
		page: {
			page,
			pageSize,
		},
		...additionalApiParams,
	});
}

export function getListItemsOrdersForCollectionPaginatedQueryKey(
	params: ListItemsOrdersForCollectionPaginatedQueryOptions,
) {
	return ['order', 'collection-items-paginated', params] as const;
}

export function listItemsOrdersForCollectionPaginatedQueryOptions(
	params: WithOptionalParams<
		WithRequired<
			ListItemsOrdersForCollectionPaginatedQueryOptions,
			'collectionAddress' | 'chainId' | 'config' | 'side'
		>
	>,
) {
	return buildQueryOptions(
		{
			getQueryKey: getListItemsOrdersForCollectionPaginatedQueryKey,
			requiredParams: [
				'collectionAddress',
				'chainId',
				'config',
				'side',
			] as const,
			fetcher: fetchListItemsOrdersForCollectionPaginated,
			customValidation: (p) =>
				!!p.collectionAddress && isAddress(p.collectionAddress),
		},
		params,
	);
}
