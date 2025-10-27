'use client';

import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import { readContract } from 'viem/actions';
import { usePublicClient } from 'wagmi';
import { EIP2981_ABI } from '../../../utils';
import { collectableKeys } from '../../_internal';

export interface RoyaltyInfo {
	percentage: bigint;
	recipient: Address;
}

export interface FetchRoyaltyParams {
	chainId: number;
	collectionAddress: Address;
	collectibleId: string;
	publicClient: any; // We'll get this from wagmi
}

export interface UseRoyaltyArgs {
	chainId: number;
	collectionAddress: Address;
	collectibleId: string;
	query?: {
		enabled?: boolean;
		refetchInterval?: number;
		staleTime?: number;
		gcTime?: number;
	};
}

/**
 * Fetches royalty information for a collectible using EIP-2981 standard
 */
async function fetchRoyalty(
	params: FetchRoyaltyParams,
): Promise<RoyaltyInfo | null> {
	const { collectionAddress, collectibleId, publicClient } = params;

	try {
		const result = await readContract(publicClient, {
			abi: EIP2981_ABI,
			address: collectionAddress,
			functionName: 'royaltyInfo',
			args: [BigInt(collectibleId), BigInt(100)],
		});

		const [recipient, percentage] = result;

		if (recipient && percentage) {
			return {
				percentage,
				recipient: recipient as Address,
			};
		}

		return null;
	} catch {
		// Contract doesn't support EIP-2981 or other error
		return null;
	}
}

function getRoyaltyQueryKey(params: Omit<FetchRoyaltyParams, 'publicClient'>) {
	return [
		...collectableKeys.royaltyPercentage,
		{
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			collectibleId: params.collectibleId,
		},
	] as const;
}

function royaltyQueryOptions(
	params: FetchRoyaltyParams,
	query?: UseRoyaltyArgs['query'],
) {
	const enabled = Boolean(
		params.collectionAddress &&
			params.chainId &&
			params.collectibleId &&
			params.publicClient &&
			(query?.enabled ?? true),
	);

	return queryOptions({
		queryKey: getRoyaltyQueryKey(params),
		queryFn: () => fetchRoyalty(params),
		enabled,
		...query,
	});
}

/**
 * Hook to fetch royalty information for a collectible
 *
 * Reads royalty information from the blockchain using the EIP-2981 standard.
 * This hook uses TanStack Query to manage the blockchain call and caching,
 * similar to other data fetching hooks in the SDK.
 *
 * @param args - Configuration parameters
 * @param args.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param args.collectionAddress - The collection contract address
 * @param args.collectibleId - The token ID within the collection
 * @param args.query - Optional TanStack Query configuration
 *
 * @returns Query result containing royalty information (percentage and recipient) or null
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { data, isLoading } = useRoyalty({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '1'
 * })
 *
 * if (data) {
 *   console.log('Royalty:', data.percentage, 'Recipient:', data.recipient)
 * }
 * ```
 *
 * @example
 * With custom query options:
 * ```typescript
 * const { data, isLoading } = useRoyalty({
 *   chainId: 1,
 *   collectionAddress: '0x...',
 *   collectibleId: '42',
 *   query: {
 *     refetchInterval: 60000,
 *     enabled: hasTokenId
 *   }
 * })
 * ```
 */
export function useRoyalty(args: UseRoyaltyArgs) {
	const { chainId, collectionAddress, collectibleId, query } = args;
	const publicClient = usePublicClient({ chainId });

	const queryOptions = royaltyQueryOptions(
		{
			chainId,
			collectionAddress,
			collectibleId,
			publicClient,
		},
		query,
	);

	return useQuery(queryOptions);
}

export { royaltyQueryOptions };
