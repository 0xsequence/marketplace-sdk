'use client';

import type { QueryKey } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import type { Address, Hex } from 'viem';
import { getErrorMessage } from '../../../utils';
import type { Step } from '../../_internal/api/marketplace.gen';
import type { TransactionType } from '../../_internal/types';
import { useTransactionStatusModal } from '../../ui/modals/_internal/components/transactionStatusModal';
import type { ModalCallbacks } from '../../ui/modals/_internal/types';
import { waitForTransactionReceipt } from '../../utils/waitForTransactionReceipt';
import { useConfig } from '../config/useConfig';
import { useProcessStep } from './useProcessStep';

interface TransactionResult {
	hash?: Hex;
	orderId?: string;
	type: 'transaction' | 'signature';
}

interface UseModalTransactionConfig {
	chainId: number;
	transactionType: TransactionType;
	callbacks?: ModalCallbacks;
	closeModal: () => void;
	queriesToInvalidate?: QueryKey[];
	// Required fields for transaction status modal
	collectionAddress: Address;
	collectibleId: string;
}

interface UseModalTransactionResult {
	execute: (steps: Step[]) => void;
	executeAsync: (steps: Step[]) => Promise<TransactionResult>;
	error: Error | null;
	isPending: boolean;
	isSuccess: boolean;
	reset: () => void;
	// Enhanced error message with wagmi/viem types
	errorMessage: string | null;
	// Pre-built props for ErrorDisplay component
	errorProps: {
		title: string;
		message: string;
		error: Error;
		onDismiss: () => void;
	} | null;
}

export const useModalTransaction = ({
	chainId,
	transactionType,
	callbacks,
	closeModal,
	queriesToInvalidate = [],
	collectionAddress,
	collectibleId,
}: UseModalTransactionConfig): UseModalTransactionResult => {
	const sdkConfig = useConfig();
	const { processStep } = useProcessStep();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();

	const { mutate, mutateAsync, error, isPending, isSuccess, reset } =
		useMutation<TransactionResult, Error, Step[]>({
			mutationFn: async (steps: Step[]) => {
				let hash: Hex | undefined;
				let orderId: string | undefined;
				let resultType: 'transaction' | 'signature' = 'transaction';

				// Process all steps sequentially
				for (const step of steps) {
					const result = await processStep(step, chainId);

					if (result.type === 'transaction') {
						hash = result.hash;
						resultType = 'transaction';
					} else if (result.type === 'signature') {
						orderId = result.orderId;
						resultType = 'signature';
					}
				}

				// Wait for transaction receipt if we have a hash
				if (hash) {
					await waitForTransactionReceipt({
						txHash: hash,
						chainId,
						sdkConfig,
					});
				}

				return {
					hash,
					orderId,
					type: resultType,
				};
			},
			onError: (error: Error) => {
				// Trigger callback if provided
				callbacks?.onError?.(error);
			},
			onSuccess: (result: TransactionResult) => {
				// Close the modal first
				closeModal();

				// Show transaction status modal with result
				showTransactionStatusModal({
					type: transactionType,
					chainId,
					hash: result.hash,
					orderId: result.orderId,
					callbacks,
					queriesToInvalidate,
					collectionAddress,
					collectibleId,
				});

				// Trigger success callback if provided
				callbacks?.onSuccess?.({
					hash: result.hash,
					orderId: result.orderId,
				});
			},
		});

	const errorMessage = error ? getErrorMessage(error) : null;

	const errorProps =
		error && errorMessage
			? {
					title: 'Transaction failed',
					message: errorMessage,
					error,
					onDismiss: reset, // Reset clears the error
				}
			: null;

	return {
		execute: mutate,
		executeAsync: mutateAsync,
		error,
		isPending,
		isSuccess,
		reset,
		errorMessage,
		errorProps,
	};
};
