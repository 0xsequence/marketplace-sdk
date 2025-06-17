'use client';

import { useQuery } from '@tanstack/react-query';
import type { Optional } from '../_internal';
import {
	type FetchGetTokenSuppliesMapParams,
	type GetTokenSuppliesMapQueryOptions,
	getTokenSuppliesMapQueryOptions,
} from '../queries/getTokenSuppliesMap';
import { useConfig } from './useConfig';

export type UseGetTokenSuppliesMapParams = Optional<
	GetTokenSuppliesMapQueryOptions,
	'config'
>;

/**
 * Hook to fetch token supplies map for multiple tokens
 *
 * Retrieves supply information for a batch of tokens from the indexer API.
 * Returns a mapping of token IDs to their supply information, useful for
 * determining token availability and supply counts.
 *
 * @param params - Configuration parameters
 * @param params.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param params.collectionAddress - The collection contract address
 * @param params.tokenIds - Array of token IDs to fetch supplies for
 * @param params.includeMetadata - Whether to include metadata in the response (default: false)
 * @param params.metadataOptions - Additional metadata options
 * @param params.query - Optional React Query configuration
 *
 * @returns Query result containing token supplies map
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useGetTokenSuppliesMap({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   tokenIds: ['1', '2', '3']
 * })
 *
 * if (isLoading) return <div>Loading supplies...</div>;
 *
 * return (
 *   <div>
 *     {Object.entries(data?.supplies || {}).map(([contractAddress, supplies]) => (
 *       <div key={contractAddress}>
 *         <h3>Contract: {contractAddress}</h3>
 *         {supplies.map(supply => (
 *           <div key={supply.tokenID}>
 *             Token {supply.tokenID}: {supply.supply} available
 *           </div>
 *         ))}
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 *
 * @example
 * With metadata included:
 * ```typescript
 * const { data, isLoading } = useGetTokenSuppliesMap({
 *   chainId: 1,
 *   collectionAddress: contractAddress,
 *   tokenIds: selectedTokens,
 *   includeMetadata: true,
 *   query: {
 *     enabled: Boolean(contractAddress && selectedTokens.length > 0)
 *   }
 * })
 * ```
 */
export function useGetTokenSuppliesMap(params: UseGetTokenSuppliesMapParams) {
	const defaultConfig = useConfig();

	const { config = defaultConfig, ...rest } = params;

	const queryOptions = getTokenSuppliesMapQueryOptions({
		config,
		...rest,
	});

	return useQuery({
		...queryOptions,
	});
}

export { getTokenSuppliesMapQueryOptions };

export type { FetchGetTokenSuppliesMapParams, GetTokenSuppliesMapQueryOptions };
