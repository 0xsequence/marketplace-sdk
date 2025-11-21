'use client';

/**
 * Portions of this code adapted from @0xsequence/connect
 * Original source: https://github.com/0xsequence/sequence.js
 * License: Apache-2.0
 *
 * Key pattern adapted: Intercepting the WaaS connector's feeConfirmationHandler
 * to provide fee selection UI within the marketplace SDK.
 */

import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useConnectors } from 'wagmi';
import type {
	FeeOption,
	WaasFeeOptionConfirmation,
} from '../../../types/waas-types';

type UseExecuteWithFeeArgs = {
	/** Chain ID where the transaction will execute */
	chainId: number;
	/** Callback when transaction succeeds */
	onSuccess?: (data: unknown) => void;
	/** Callback when transaction fails */
	onError?: (error: Error) => void;
};

type ExecuteWithFeeVariables = {
	/** The transaction function to execute */
	transactionFn: () => Promise<unknown>;
	/** The selected fee option */
	selectedFeeOption: FeeOption;
};

/**
 * Hook to execute transactions with WaaS fee selection using React Query's useMutation.
 *
 * This hook intercepts the WaaS connector's fee confirmation handler to provide
 * a seamless fee selection experience. Uses `useMutation` for clean mutation state management.
 *
 * @example
 * ```tsx
 * function TransferModal() {
 *   const { data } = useRequiresFeeSelection({ chainId: 137 });
 *   const [selectedOption, setSelectedOption] = useState<FeeOption | null>(null);
 *
 *   const { mutate, isPending, pendingConfirmation } = useExecuteWithFee({
 *     chainId: 137,
 *     onSuccess: () => toast.success('Transfer complete!'),
 *     onError: (err) => toast.error(err.message),
 *   });
 *
 *   const handleTransfer = () => {
 *     if (!selectedOption) return;
 *
 *     mutate({
 *       transactionFn: () => writeContract({ ... }),
 *       selectedFeeOption: selectedOption,
 *     });
 *   };
 *
 *   if (pendingConfirmation) {
 *     return <SelectFeeUI options={pendingConfirmation.options} />;
 *   }
 *
 *   return <button onClick={handleTransfer}>Transfer</button>;
 * }
 * ```
 */
export function useExecuteWithFee({
	chainId,
	onSuccess,
	onError,
}: UseExecuteWithFeeArgs) {
	const connectors = useConnectors();
	const [pendingConfirmation, setPendingConfirmation] =
		useState<WaasFeeOptionConfirmation | null>(null);

	// Store the confirmation callback in a ref to avoid re-creating the handler
	const confirmationCallbackRef = useRef<
		((contractAddress: string) => void) | null
	>(null);

	// Find the WaaS connector
	const waasConnector = connectors.find(
		(connector) => connector.id === 'sequence-waas',
	);

	// Set up the fee confirmation handler
	useEffect(() => {
		if (!waasConnector) return;

		// Get the WaaS provider from the connector
		// Type assertion: sequenceWaasProvider exists at runtime but isn't in type definitions
		const waasProvider = (waasConnector as any).sequenceWaasProvider as {
			feeConfirmationHandler?: {
				confirmFeeOption?: (
					id: string,
					options: FeeOption[],
					txs: unknown,
					chainId: number,
				) => Promise<string>;
			};
		};
		if (!waasProvider) return;

		// Store the original handler to restore on cleanup
		const originalHandler = waasProvider.feeConfirmationHandler;

		// Intercept the fee confirmation handler
		waasProvider.feeConfirmationHandler = {
			async confirmFeeOption(
				id: string,
				options: FeeOption[],
				_txs: unknown,
				feeChainId: number,
			): Promise<string> {
				// Only handle confirmations for our chain
				if (feeChainId !== chainId) {
					return (
						originalHandler?.confirmFeeOption?.(
							id,
							options,
							_txs,
							feeChainId,
						) ||
						options[0]?.token.contractAddress ||
						''
					);
				}

				// Store pending confirmation for UI
				setPendingConfirmation({
					id,
					options,
					chainId: feeChainId,
				});

				// Return a promise that resolves when the user selects a fee option
				return new Promise<string>((resolve) => {
					confirmationCallbackRef.current = (contractAddress: string) => {
						resolve(contractAddress);
						setPendingConfirmation(null);
						confirmationCallbackRef.current = null;
					};
				});
			},
		};

		// Cleanup: restore original handler
		return () => {
			if (waasProvider.feeConfirmationHandler) {
				waasProvider.feeConfirmationHandler = originalHandler;
			}
		};
	}, [waasConnector, chainId]);

	// Use React Query's useMutation for transaction execution
	const mutation = useMutation({
		mutationFn: async ({
			transactionFn,
			selectedFeeOption,
		}: ExecuteWithFeeVariables) => {
			// Start the transaction - this will trigger the fee confirmation handler
			const transactionPromise = transactionFn();

			// Wait a bit for the confirmation handler to be called
			await new Promise((resolve) => setTimeout(resolve, 100));

			// Confirm the selected fee option
			if (confirmationCallbackRef.current) {
				confirmationCallbackRef.current(
					selectedFeeOption.token.contractAddress ||
						'0x0000000000000000000000000000000000000000',
				);
			}

			// Wait for transaction to complete
			return await transactionPromise;
		},
		onSuccess,
		onError: (error: Error) => {
			onError?.(error);
		},
	});

	return {
		// Expose mutation methods with clearer names
		execute: mutation.mutate,
		executeAsync: mutation.mutateAsync,
		// Use isPending instead of isExecuting (React Query v5 naming)
		isExecuting: mutation.isPending,
		error: mutation.error,
		pendingConfirmation,
		// Expose full mutation object for advanced use cases
		mutation,
	};
}
