'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../../_internal';
import {
	type CollectibleQueryOptions,
	collectibleQueryOptions,
	type FetchCollectibleParams,
} from '../../queries/collectible/metadata';
import { useConfig } from '../config/useConfig';

export type UseCollectibleMetadataParams = Optional<
	CollectibleQueryOptions,
	'config'
>;

/**
 * Hook to fetch metadata for a specific collectible
 *
 * This hook retrieves metadata for an individual NFT from a collection,
 * including properties like name, description, image, attributes, etc.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.contractAddress - The collection contract address
 * @param params.tokenId - The token ID of the collectible
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing the collectible metadata
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data: collectible, isLoading } = useCollectibleMetadata({
 *   chainId: 137,
 *   contractAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
 *   tokenId: '12345'
 * })
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data } = useCollectibleMetadata({
 *   chainId: 137,
 *   contractAddress: '0x631998e91476da5b870d741192fc5cbc55f5a52e',
 *   tokenId: '12345',
 *   query: {
 *     enabled: Boolean(contractAddress && tokenId),
 *     staleTime: 30_000
 *   }
 * })
 * ```
 */
export function useCollectibleMetadata(params: UseCollectibleMetadataParams) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = collectibleQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { collectibleQueryOptions };

export type { FetchCollectibleParams, CollectibleQueryOptions };
