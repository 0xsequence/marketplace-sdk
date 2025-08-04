'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import type { Optional } from '../../../_internal';
import {
	type SearchTokenMetadataQueryOptions,
	searchTokenMetadataQueryOptions,
} from '../../../queries/searchTokenMetadata';
import { useConfig } from '../../config/useConfig';
import { useTokenSupplies } from './useTokenSupplies';

export type UseSearchMintedTokenMetadataParams = Optional<
	SearchTokenMetadataQueryOptions,
	'config'
>;

/**
 * Hook to search only minted token metadata using filters with infinite pagination support
 *
 * Searches for minted tokens in a collection based on text and property filters.
 * This hook combines useSearchTokenMetadata with useTokenSupplies to ensure only
 * minted tokens are returned. Unminted tokens are filtered out by checking their supply.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.filter - Filter criteria for the search
 * @param params.filter.text - Optional text search query
 * @param params.filter.properties - Optional array of property filters
 * @param params.page - Optional pagination parameters
 * @param params.query - Optional React Query configuration
 *
 * @returns Infinite query result containing matching minted token metadata with pagination support
 *
 * @example
 * Basic text search with pagination:
 * ```typescript
 * const { data, isLoading, fetchNextPage, hasNextPage } = useSearchMintedTokenMetadata({
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
 * const { data, fetchNextPage } = useSearchMintedTokenMetadata({
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
 */
export function useSearchMintedTokenMetadata(
	params: UseSearchMintedTokenMetadataParams,
) {
	const defaultConfig = useConfig();
	const {
		config = defaultConfig,
		chainId,
		collectionAddress,
		...rest
	} = params;

	// Get token supplies to check which tokens are minted
	const {
		data: suppliesData,
		hasNextPage: hasNextSuppliesPage,
		isFetching: isSuppliesFetching,
		isLoading: isSuppliesLoading,
		error: suppliesError,
		fetchNextPage: fetchNextSuppliesPage,
	} = useTokenSupplies({
		chainId,
		collectionAddress,
		includeMetadata: true,
		query: {
			enabled: params.query?.enabled ?? true,
		},
	});

	const tokenMetadataQueryOptions = searchTokenMetadataQueryOptions({
		config,
		chainId,
		collectionAddress,
		...rest,
	});

	const {
		data: metadataData,
		hasNextPage: hasNextMetadataPage,
		isFetching: isMetadataFetching,
		isLoading: isMetadataLoading,
		error: metadataError,
	} = useInfiniteQuery({
		...tokenMetadataQueryOptions,
	});

	const mintedTokenIds = new Set(
		suppliesData?.pages
			.flatMap((page) => page.tokenIDs)
			?.filter((token) => BigInt(token.supply) > 0n)
			.map((token) => token.tokenID) ?? [],
	);

	// Filter minted tokens from all metadata pages
	const filteredTokenMetadata = metadataData?.pages
		.flatMap((page) => page.tokenMetadata)
		.filter((metadata) => mintedTokenIds.has(metadata.tokenId));

	const lastPage = metadataData?.pages[metadataData.pages.length - 1]?.page;

	const shouldFetchNextMetadataPage =
		hasNextMetadataPage &&
		(filteredTokenMetadata?.length ?? 0) < (mintedTokenIds?.size ?? 0);

	const fetchNextPage = async () => {
		if (hasNextSuppliesPage && !isSuppliesFetching) {
			await fetchNextSuppliesPage();
		}
	};

	return {
		...metadataData,
		hasNextPage: shouldFetchNextMetadataPage || hasNextSuppliesPage,
		data: metadataData
			? {
					tokenMetadata: filteredTokenMetadata ?? [],
					page: lastPage,
				}
			: undefined,
		isLoading: isMetadataLoading || isSuppliesLoading,
		isFetching: isMetadataFetching || isSuppliesFetching,
		error: metadataError || suppliesError,
		fetchNextPage,
	};
}
