'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../_internal';
import {
	type FetchListCollectiblesPaginatedParams,
	type fetchListCollectiblesPaginated,
	type ListCollectiblesPaginatedQueryOptions,
	listCollectiblesPaginatedQueryOptions,
} from '../../queries/collectible/market-list-paginated';
import { useConfig } from '../config/useConfig';

export type UseCollectibleMarketListPaginatedParams = Optional<
	ListCollectiblesPaginatedQueryOptions,
	'config'
>;

/**
 * Hook to fetch a list of collectibles with pagination support
 *
 * Fetches collectibles from the marketplace with support for filtering and pagination.
 * Unlike the infinite query version, this hook fetches a specific page of results.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.side - Order side (listing or bid)
 * @param params.filter - Optional filtering parameters
 * @param params.page - Page number to fetch (default: 1)
 * @param params.pageSize - Number of items per page (default: 30)
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing collectibles data for the specific page
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useCollectibleMarketListPaginated({
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
 * const { data } = useCollectibleMarketListPaginated({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   side: OrderSide.listing,
 *   page: 2,
 *   pageSize: 50,
 *   filter: {
 *     searchText: 'rare',
 *     includeEmpty: false
 *   }
 * })
 * ```
 *
 * @example
 * Controlled pagination:
 * ```typescript
 * const [currentPage, setCurrentPage] = useState(1);
 * const { data, isLoading } = useCollectibleMarketListPaginated({
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
export function useCollectibleMarketListPaginated(
	params: UseCollectibleMarketListPaginatedParams,
) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = listCollectiblesPaginatedQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { listCollectiblesPaginatedQueryOptions };

export type {
	FetchListCollectiblesPaginatedParams,
	ListCollectiblesPaginatedQueryOptions,
};

// Legacy exports for backward compatibility during migration
export type UseListCollectiblesPaginatedArgs =
	UseCollectibleMarketListPaginatedParams;
export type UseListCollectiblesPaginatedParams =
	UseCollectibleMarketListPaginatedParams;
export type UseListCollectiblesPaginatedReturn = Awaited<
	ReturnType<typeof fetchListCollectiblesPaginated>
>;
