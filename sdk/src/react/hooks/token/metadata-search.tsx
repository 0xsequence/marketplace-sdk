'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import type { Optional } from '../../_internal';
import {
	type SearchTokenMetadataQueryOptions,
	searchTokenMetadataQueryOptions,
} from '../../queries/token/metadata-search';
import { tokenSuppliesQueryOptions } from '../../queries/token/supplies';
import { useConfig } from '../config/useConfig';

export type UseTokenMetadataSearchParams = Optional<
	SearchTokenMetadataQueryOptions,
	'config'
> & {
	/**
	 * If true, only return minted tokens (tokens with supply > 0)
	 */
	onlyMinted?: boolean;
};

/**
 * Hook to search token metadata using filters with infinite pagination support
 *
 * Searches for tokens in a collection based on text and property filters.
 * Supports filtering by attributes, ranges, and text search.
 * Can optionally filter to only show minted tokens (tokens with supply > 0).
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.filter - Filter criteria for the search
 * @param params.filter.text - Optional text search query
 * @param params.filter.properties - Optional array of property filters
 * @param params.page - Optional pagination parameters
 * @param params.query - Optional React Query configuration
 * @param params.onlyMinted - If true, only return minted tokens (tokens with supply > 0)
 *
 * @returns Infinite query result containing matching token metadata with pagination support
 *
 * @example
 * Basic text search with pagination:
 * ```typescript
 * const { data, isLoading, fetchNextPage, hasNextPage } = useTokenMetadataSearch({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   filter: {
 *     text: 'dragon'
 *   }
 * })
 * ```
 *
 * @example
 * Property filters:
 * ```typescript
 * const { data, fetchNextPage } = useTokenMetadataSearch({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   filter: {
 *     properties: [
 *       {
 *         name: 'Rarity',
 *         type: PropertyType.STRING,
 *         values: ['Legendary', 'Epic']
 *       },
 *       {
 *         name: 'Level',
 *         type: PropertyType.INT,
 *         min: 50,
 *         max: 100
 *       }
 *     ]
 *   }
 * })
 * ```
 *
 * @example
 * Search only minted tokens:
 * ```typescript
 * const { data, fetchNextPage } = useTokenMetadataSearch({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   onlyMinted: true,
 *   filter: {
 *     text: 'dragon'
 *   }
 * })
 * ```
 */
export function useTokenMetadataSearch(params: UseTokenMetadataSearchParams) {
	const defaultConfig = useConfig();
	const { config = defaultConfig, onlyMinted, ...rest } = params;

	// Get token supplies to check which tokens are minted if onlyMinted is true
	const {
		data: suppliesData,
		hasNextPage: hasNextSuppliesPage,
		isFetching: isSuppliesFetching,
		isLoading: isSuppliesLoading,
		error: suppliesError,
		fetchNextPage: fetchNextSuppliesPage,
	} = useInfiniteQuery(
		tokenSuppliesQueryOptions({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config,
			includeMetadata: true,
			query: {
				enabled:
					onlyMinted &&
					!!params.collectionAddress &&
					(params.query?.enabled ?? true),
			},
		}),
	);

	const queryOptions = searchTokenMetadataQueryOptions({
		config,
		...rest,
	});

	const result = useInfiniteQuery({
		...queryOptions,
		// If onlyMinted is true, only enable the metadata query when token supplies query succeeds
		enabled: onlyMinted
			? !isSuppliesLoading && !suppliesError && queryOptions.enabled
			: queryOptions.enabled,
	});

	// If onlyMinted is true and we have a supplies error, return that error state
	if (onlyMinted && suppliesError) {
		return {
			...result,
			isError: true,
			error: suppliesError,
			data: undefined,
		};
	}

	if (!onlyMinted) {
		return {
			...result,
			data: result.data
				? {
						tokenMetadata: result.data.pages.flatMap(
							(page) => page.tokenMetadata,
						),
						page: result.data.pages[result.data.pages.length - 1]?.page,
					}
				: undefined,
		};
	}

	const mintedTokenIds = new Set(
		suppliesData?.pages
			.flatMap((page) => page.supplies)
			?.filter((supply) => supply.supply > 0n)
			.map((supply) => supply.tokenId) ?? [],
	);

	// Filter minted tokens from all metadata pages
	const filteredTokenMetadata = result.data?.pages
		.flatMap((page) => page.tokenMetadata)
		.filter((metadata) => mintedTokenIds.has(BigInt(metadata.tokenId)));

	const lastPage = result.data?.pages[result.data.pages.length - 1]?.page;

	const shouldFetchNextMetadataPage =
		result.hasNextPage &&
		(filteredTokenMetadata?.length ?? 0) < (mintedTokenIds?.size ?? 0);

	const fetchNextPage = async () => {
		if (hasNextSuppliesPage && !isSuppliesFetching) {
			await fetchNextSuppliesPage();
		}
	};

	return {
		...result,
		hasNextPage: shouldFetchNextMetadataPage || hasNextSuppliesPage,
		data: result.data
			? {
					tokenMetadata: filteredTokenMetadata ?? [],
					page: lastPage,
				}
			: undefined,
		isLoading: result.isLoading || isSuppliesLoading,
		isFetching: result.isFetching || isSuppliesFetching,
		error: result.error || suppliesError,
		fetchNextPage,
	};
}
