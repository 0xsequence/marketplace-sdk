import { useState, useEffect } from 'react';
import { useCancelTransactionSteps } from './useCancelTransactionSteps';
import type { MarketplaceKind } from '../../types';
import { useWaasFeeOptions } from '@0xsequence/kit';
import { useAutoSelectFeeOption } from './useAutoSelectFeeOption';

interface UseCancelOrderArgs {
	collectionAddress: string;
	chainId: string;
	onSuccess?: ({ hash, orderId }: { hash?: string; orderId?: string }) => void;
	onError?: (error: Error) => void;
}

export type TransactionStep = {
	exist: boolean;
	isExecuting: boolean;
	execute: () => Promise<void>;
};

export const useCancelOrder = ({
	collectionAddress,
	chainId,
	onSuccess,
	onError,
}: UseCancelOrderArgs) => {
	const [steps, setSteps] = useState<TransactionStep>({
		exist: false,
		isExecuting: false,
		execute: () => Promise.resolve(),
	});
	const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
		null,
	);

	const [pendingFeeOptionConfirmation, confirmPendingFeeOption] =
		useWaasFeeOptions();

	const autoSelectFeeOptionResult = useAutoSelectFeeOption({
		pendingFeeOptionConfirmation: pendingFeeOptionConfirmation
			? {
					id: pendingFeeOptionConfirmation.id,
					options: pendingFeeOptionConfirmation.options?.map((opt) => ({
						...opt,
						token: {
							...opt.token,
							contractAddress: opt.token.contractAddress || null,
							decimals: opt.token.decimals || 0,
							tokenID: opt.token.tokenID || null,
						},
					})),
					chainId: Number(chainId),
				}
			: {
					id: '',
					options: undefined,
					chainId: Number(chainId),
				},
	});

	useEffect(() => {
		const handleFeeOptionSelection = async () => {
			if (!pendingFeeOptionConfirmation) return;

			const { selectedOption, error } = await autoSelectFeeOptionResult;

			if (error) {
				console.error('Error selecting fee option:', error);
				onError?.(new Error(`Failed to select fee option: ${error}`));
				return;
			}

			if (
				selectedOption?.token.contractAddress &&
				pendingFeeOptionConfirmation.id
			) {
				confirmPendingFeeOption(
					pendingFeeOptionConfirmation.id,
					selectedOption.token.contractAddress,
				);
			}
		};

		handleFeeOptionSelection();
	}, [
		pendingFeeOptionConfirmation,
		autoSelectFeeOptionResult,
		confirmPendingFeeOption,
		onError,
	]);

	const { cancelOrder: cancelOrderBase } = useCancelTransactionSteps({
		collectionAddress,
		chainId,
		onSuccess: (result) => {
			setCancellingOrderId(null);
			onSuccess?.(result);
		},
		onError: (error) => {
			setCancellingOrderId(null);
			onError?.(error);
		},
		setSteps,
	});

	const cancelOrder = async (params: {
		orderId: string;
		marketplace: MarketplaceKind;
	}) => {
		setCancellingOrderId(params.orderId);
		return cancelOrderBase(params);
	};

	return {
		cancelOrder,
		isExecuting: steps.isExecuting,
		cancellingOrderId,
	};
};
