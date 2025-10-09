import { queryOptions } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { Page, SdkConfig } from '../../../types';
import type {
	ListOrdersWithCollectiblesArgs,
	ListOrdersWithCollectiblesReturn,
	ValuesOptional,
} from '../../_internal';
import { collectionKeys, getMarketplaceClient } from '../../_internal';
import type { StandardQueryOptions } from '../../types/query';

export interface FetchListItemsOrdersForCollectionPaginatedParams
	extends Omit<
		ListOrdersWithCollectiblesArgs,
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
): Promise<ListOrdersWithCollectiblesReturn> {
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

	const apiArgs: ListOrdersWithCollectiblesArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		page: pageParams,
		...additionalApiParams,
	};

	return await marketplaceClient.listOrdersWithCollectibles(apiArgs);
}

export type ListItemsOrdersForCollectionPaginatedQueryOptions =
	ValuesOptional<FetchListItemsOrdersForCollectionPaginatedParams> & {
		query?: StandardQueryOptions;
	};

export function listItemsOrdersForCollectionPaginatedQueryOptions(
	params: ListItemsOrdersForCollectionPaginatedQueryOptions,
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.config &&
			params.side &&
			(params.query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: [...collectionKeys.collectionItemsOrders, 'paginated', params],
		queryFn: () =>
			fetchListItemsOrdersForCollectionPaginated({
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				chainId: params.chainId!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				collectionAddress: params.collectionAddress!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				config: params.config!,
				// biome-ignore lint/style/noNonNullAssertion: The enabled check above ensures these are not undefined
				side: params.side!,
				filter: params.filter,
				page: params.page,
				pageSize: params.pageSize,
			}),
		...params.query,
		enabled,
	});
}
