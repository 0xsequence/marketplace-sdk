import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { EIP2981_ABI } from '../../utils';
import { collectableKeys } from '../_internal';

/**
 * Arguments for fetching royalty information
 */
export interface UseRoyaltyArgs {
	/** The blockchain network ID (e.g., 1 for Ethereum mainnet, 137 for Polygon) */
	chainId: number;
	/** The contract address of the NFT collection */
	collectionAddress: Address;
	/** The specific token ID within the collection */
	collectibleId: string;
	/** Query configuration options */
	query?: {
		/** Whether the query should be enabled/disabled */
		enabled?: boolean;
	};
}

/**
 * Hook to fetch royalty information for a specific collectable
 *
 * Reads the EIP-2981 royalty standard to get the royalty percentage and recipient
 * address for a specific NFT. This information is used to calculate creator royalties
 * when the NFT is sold on marketplaces.
 *
 * @param args - Configuration object containing collection and token details
 * @returns Wagmi contract read result with royalty data (percentage and recipient)
 *
 * @example
 * ```tsx
 * const { data: royalty, isLoading, error } = useRoyalty({
 *   chainId: 137,
 *   collectionAddress: '0x...',
 *   collectibleId: '123'
 * });
 *
 * if (isLoading) return <div>Loading royalty info...</div>;
 * if (error) return <div>Error loading royalty</div>;
 * if (!royalty) return <div>No royalty info available</div>;
 *
 * return (
 *   <div>
 *     <p>Royalty: {royalty.percentage.toString()}%</p>
 *     <p>Recipient: {royalty.recipient}</p>
 *   </div>
 * );
 * ```
 */
export const useRoyalty = (args: UseRoyaltyArgs) => {
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
};
