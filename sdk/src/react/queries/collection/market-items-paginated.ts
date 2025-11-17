import type { Address } from 'viem';
import type { Page } from '../../../types';
import type {
	ListOrdersWithCollectiblesRequest,
	ListOrdersWithCollectiblesResponse,
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

	const pageParams: Page = {
		page,
		pageSize,
	};

	const apiArgs: ListOrdersWithCollectiblesRequest = {
		collectionAddress,
		chainId,
		page: pageParams,
		...additionalApiParams,
	};

	return await marketplaceClient.listOrdersWithCollectibles(apiArgs);
}

export function getListItemsOrdersForCollectionPaginatedQueryKey(
	params: ListItemsOrdersForCollectionPaginatedQueryOptions,
) {
	return ['order', 'collection-items-paginated', params] as const;
}

export function listItemsOrdersForCollectionPaginatedQueryOptions(
	params: ListItemsOrdersForCollectionPaginatedQueryOptions,
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
		},
		params,
	);
}
