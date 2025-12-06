'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../_internal';
import {
	type FetchListTokenMetadataParams,
	type ListTokenMetadataQueryOptions,
	listTokenMetadataQueryOptions,
} from '../../queries/token/metadata';
import { useConfig } from '../config/useConfig';

export type UseTokenMetadataParams = Optional<
	ListTokenMetadataQueryOptions,
	'config'
>;

/**
 * Hook to fetch metadata for multiple tokens
 *
 * Retrieves metadata for a batch of tokens from a specific contract using the metadata API.
 * This hook is optimized for fetching multiple token metadata in a single request.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.contractAddress - The contract address containing the tokens
 * @param params.tokenIds - Array of token IDs to fetch metadata for
 * @param params.config - Optional SDK configuration (defaults from context)
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing an array of token metadata
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: metadata, isLoading } = useTokenMetadata({
 *   chainId: 137,
 *   contractAddress: '0x...',
 *   tokenIds: ['1', '2', '3']
 * })
 * ```
 *
 * @example
 * With query options:
 * ```typescript
 * const { data: metadata } = useTokenMetadata({
 *   chainId: 1,
 *   contractAddress: '0x...',
 *   tokenIds: selectedTokenIds,
 *   query: {
 *     enabled: selectedTokenIds.length > 0,
 *     staleTime: 10 * 60 * 1000 // 10 minutes
 *   }
 * })
 * ```
 */
export function useTokenMetadata(params: UseTokenMetadataParams) {
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
