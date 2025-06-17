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
 * Hook to fetch token metadata for multiple tokens
 *
 * Retrieves metadata information for a batch of tokens from the metadata API.
 * This is useful for getting detailed token information including names, images,
 * attributes, and other metadata properties.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.contractAddress - The contract address containing the tokens
 * @param params.tokenIds - Array of token IDs to fetch metadata for
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing array of token metadata
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useListTokenMetadata({
 *   chainId: 137,
 *   contractAddress: '0x...',
 *   tokenIds: ['1', '2', '3']
 * })
 *
 * if (isLoading) return <div>Loading metadata...</div>;
 *
 * return (
 *   <div>
 *     {data?.map(token => (
 *       <div key={token.tokenId}>
 *         <img src={token.image} alt={token.name} />
 *         <h3>{token.name}</h3>
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 *
 * @example
 * With conditional loading:
 * ```typescript
 * const { data, isLoading } = useListTokenMetadata({
 *   chainId: 1,
 *   contractAddress: contractAddress,
 *   tokenIds: selectedTokens,
 *   query: {
 *     enabled: Boolean(contractAddress && selectedTokens.length > 0)
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
