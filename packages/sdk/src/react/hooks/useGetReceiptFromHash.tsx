import { useCallback } from 'react';
import type { Hex } from 'viem';
import { usePublicClient } from 'wagmi';

/**
 * @returns a function to wait for a transaction receipt and the receipt
 * @description This hook is used to wait for a transaction receipt and the receipt
 * @example
 * const { waitForReceipt } = useGetReceiptFromHash();
 * const receipt = await waitForReceipt(transactionHash);
 */
export const useGetReceiptFromHash = (): {
    waitForReceipt: (transactionHash: Hex) => Promise<any>;
} => {
	const publicClient = usePublicClient();

	const waitForReceipt = useCallback(
		async (transactionHash: Hex): Promise<any> => {
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
