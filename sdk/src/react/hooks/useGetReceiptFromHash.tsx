import { useCallback } from 'react';
import type { Hex } from 'viem';
import { usePublicClient } from 'wagmi';

/**
 * Hook to get transaction receipt from hash
 *
 * Provides a function to wait for a transaction receipt using a transaction hash.
 * This is a wagmi-based hook for direct blockchain interaction.
 *
 * @returns Object containing waitForReceipt function
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { waitForReceipt } = useGetReceiptFromHash();
 *
 * // Wait for transaction receipt
 * const receipt = await waitForReceipt('0x123...');
 * console.log('Transaction status:', receipt.status);
 * ```
 *
 * @example
 * In transaction flow:
 * ```typescript
 * const { waitForReceipt } = useGetReceiptFromHash();
 *
 * const handleTransaction = async () => {
 *   try {
 *     const hash = await writeContract({ ... });
 *     const receipt = await waitForReceipt(hash);
 *     if (receipt.status === 'success') {
 *       console.log('Transaction confirmed!');
 *     }
 *   } catch (error) {
 *     console.error('Transaction failed:', error);
 *   }
 * };
 * ```
 */
export const useGetReceiptFromHash = () => {
	const publicClient = usePublicClient();

	const waitForReceipt = useCallback(
		async (transactionHash: Hex) => {
			if (!publicClient) {
				throw new Error('Public client not found');
			}

			const receipt = await publicClient.waitForTransactionReceipt({
				hash: transactionHash,
			});
			return receipt;
		},
		[publicClient],
	);

	return {
		waitForReceipt,
	};
};
