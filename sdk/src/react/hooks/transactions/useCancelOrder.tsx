'use client';
import { useWaasFeeOptions } from '@0xsequence/connect';
import { useEffect, useState } from 'react';
import type { Address } from 'viem';
import type * as types from '../../_internal';
import { useCancelTransactionSteps } from './useCancelTransactionSteps';

interface UseCancelOrderArgs {
	collectionAddress: Address;
	chainId: number;
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

	// TODO: Implement WaaS fee handling using useWaasFeeStep pattern
	useEffect(() => {
		// Auto-confirm fee option if available
		if (
			pendingFeeOptionConfirmation?.id &&
			pendingFeeOptionConfirmation.options.length > 0
		) {
			const firstOption = pendingFeeOptionConfirmation.options[0];
			if (firstOption.token.contractAddress) {
				confirmPendingFeeOption(
					pendingFeeOptionConfirmation.id,
					firstOption.token.contractAddress,
				);
			}
		}
	}, [confirmPendingFeeOption, pendingFeeOptionConfirmation]);

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
		marketplace: types.MarketplaceKind;
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
