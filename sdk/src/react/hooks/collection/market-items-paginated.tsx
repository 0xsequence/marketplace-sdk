'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../_internal';
import {
	type FetchListItemsOrdersForCollectionPaginatedParams,
	type fetchListItemsOrdersForCollectionPaginated,
	type ListItemsOrdersForCollectionPaginatedQueryOptions,
	listItemsOrdersForCollectionPaginatedQueryOptions,
} from '../../queries/collection/market-items-paginated';
import { useConfig } from '../config/useConfig';

export type UseCollectionMarketItemsPaginatedParams = Optional<
	ListItemsOrdersForCollectionPaginatedQueryOptions,
	'config'
>;

/**
 * Hook to fetch all listings for a collection with pagination support
 *
 * Fetches active listings (sales) for all tokens in a collection from the marketplace
 * with support for filtering and pagination. Unlike the infinite query version,
 * this hook fetches a specific page of results.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.side - Order side (listing or bid)
 * @param params.filter - Optional filtering parameters (marketplace, currencies, etc.)
 * @param params.page - Page number to fetch (default: 1)
 * @param params.pageSize - Number of items per page (default: 30)
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing listings data for the specific page
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useCollectionMarketItemsPaginated({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   side: OrderSide.listing,
 *   page: 1,
 *   pageSize: 20
 * })
 * ```
 *
 * @example
 * With filtering:
 * ```typescript
 * const { data } = useCollectionMarketItemsPaginated({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   side: OrderSide.listing,
 *   page: 2,
 *   pageSize: 50,
 *   filter: {
 *     marketplace: [MarketplaceKind.sequence_marketplace_v2],
 *     currencies: ['0x...']
 *   }
 * })
 * ```
 *
 * @example
 * Controlled pagination:
 * ```typescript
 * const [currentPage, setCurrentPage] = useState(1);
 * const { data, isLoading } = useCollectionMarketItemsPaginated({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   side: OrderSide.listing,
 *   page: currentPage,
 *   pageSize: 25
 * });
 *
 * const hasMorePages = data?.page?.more;
 * ```
 */
export function useCollectionMarketItemsPaginated(
	params: UseCollectionMarketItemsPaginatedParams,
) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = listItemsOrdersForCollectionPaginatedQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { listItemsOrdersForCollectionPaginatedQueryOptions };

export type {
	FetchListItemsOrdersForCollectionPaginatedParams,
	ListItemsOrdersForCollectionPaginatedQueryOptions,
};

// Legacy exports for backward compatibility during migration
export type UseListItemsOrdersForCollectionPaginatedArgs =
	UseListItemsOrdersForCollectionPaginatedParams;
export type UseListItemsOrdersForCollectionPaginatedReturn = Awaited<
	ReturnType<typeof fetchListItemsOrdersForCollectionPaginated>
>;
export type UseListItemsOrdersForCollectionPaginatedParams =
	UseCollectionMarketItemsPaginatedParams;
