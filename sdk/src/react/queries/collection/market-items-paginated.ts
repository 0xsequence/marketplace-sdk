import type { Address } from 'viem';
import type { Page, SdkConfig } from '../../../types';
import type {
	ListOrdersWithCollectiblesRequest,
	ListOrdersWithCollectiblesResponse,
} from '../../_internal';
import {
	buildQueryOptions,
	getMarketplaceClient,
	type WithOptionalParams,
} from '../../_internal';

export interface FetchListItemsOrdersForCollectionPaginatedParams
	extends Omit<
		ListOrdersWithCollectiblesRequest,
		'chainId' | 'contractAddress' | 'page'
	> {
	chainId: number;
	collectionAddress: Address;
	page?: number;
	pageSize?: number;
	config: SdkConfig;
}

/**
 * Fetches a list of items orders for a collection with pagination support from the Marketplace API
 */
export async function fetchListItemsOrdersForCollectionPaginated(
	params: FetchListItemsOrdersForCollectionPaginatedParams,
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

export type ListItemsOrdersForCollectionPaginatedQueryOptions =
	WithOptionalParams<FetchListItemsOrdersForCollectionPaginatedParams>;

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
