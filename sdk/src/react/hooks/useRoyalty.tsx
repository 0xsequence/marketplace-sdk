'use client';

import { useReadContract } from 'wagmi';
import { z } from 'zod';
import { EIP2981_ABI } from '../../utils';
import { AddressSchema, QueryArgSchema, collectableKeys } from '../_internal';

const UseRoyaltySchema = z.object({
	chainId: z.number(),
	collectionAddress: AddressSchema,
	collectibleId: z.string(),
	query: QueryArgSchema.optional(),
});

export type UseRoyaltyArgs = z.infer<typeof UseRoyaltySchema>;

/**
 * Hook to fetch royalty information for a collectible
 *
 * Reads royalty information from the blockchain using the EIP-2981 standard.
 * This hook queries the contract directly to get royalty percentage and recipient
 * address for a specific token.
 *
 * @param args - Configuration parameters
 * @param args.chainId - The chain ID (must be number, e.g., 1 for Ethereum, 137 for Polygon)
 * @param args.collectionAddress - The collection contract address
 * @param args.collectibleId - The token ID within the collection
 * @param args.query - Optional React Query configuration
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
	const scopeKey = `${collectableKeys.royaltyPercentage.join('.')}-${chainId}-${collectionAddress}-${collectibleId}`;

	const contractResult = useReadContract({
		scopeKey: scopeKey,
		abi: EIP2981_ABI,
		address: collectionAddress,
		functionName: 'royaltyInfo',
		args: [BigInt(collectibleId), BigInt(100)],
		chainId,
		query: query,
	});

	const [recipient, percentage] = contractResult.data ?? [];
	const formattedData =
		recipient && percentage
			? {
					percentage,
					recipient,
				}
			: null;

	return {
		...contractResult,
		data: formattedData,
	};
}
