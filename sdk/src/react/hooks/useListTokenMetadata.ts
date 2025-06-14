'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../_internal';
import {
	type FetchListTokenMetadataParams,
	type ListTokenMetadataQueryOptions,
	listTokenMetadataQueryOptions,
} from '../queries/listTokenMetadata';
import { useConfig } from './useConfig';

export type UseListTokenMetadataParams = Optional<
	ListTokenMetadataQueryOptions,
	'config'
>;

/**
 * Hook to fetch token metadata from the metadata API
 *
 * Retrieves metadata for a batch of tokens from a specific contract.
 * Useful for getting token names, descriptions, images, and other attributes.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.contractAddress - The contract address containing the tokens
 * @param params.tokenIds - Array of token IDs to fetch metadata for
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing token metadata array
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useListTokenMetadata({
 *   chainId: 137,
 *   contractAddress: '0x...',
 *   tokenIds: ['1', '2', '3']
 * })
 * ```
 *
 * @example
 * With conditional fetching:
 * ```typescript
 * const { data, isLoading } = useListTokenMetadata({
 *   chainId: 1,
 *   contractAddress: '0x...',
 *   tokenIds: selectedTokenIds,
 *   query: {
 *     enabled: selectedTokenIds.length > 0
 *   }
 * })
 * ```
 */
export function useListTokenMetadata(params: UseListTokenMetadataParams) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = listTokenMetadataQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { listTokenMetadataQueryOptions };

export type { FetchListTokenMetadataParams, ListTokenMetadataQueryOptions };
