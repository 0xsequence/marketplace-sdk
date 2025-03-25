'use client';
import { useWaasFeeOptions } from '@0xsequence/connect';
import { useEffect, useState } from 'react';
import type { MarketplaceKind } from '../../types';
import { useAutoSelectFeeOption } from './useAutoSelectFeeOption';
import { useCancelTransactionSteps } from './useCancelTransactionSteps';

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
	const autoSelectOptionPromise = useAutoSelectFeeOption({
		pendingFeeOptionConfirmation: {
			id: pendingFeeOptionConfirmation?.id || '',
			options: pendingFeeOptionConfirmation?.options
				? pendingFeeOptionConfirmation.options.map((option) => ({
						...option,
						token: {
							...option.token,
							contractAddress: option.token.contractAddress ?? null,
							decimals: option.token.decimals ?? 0,
							tokenID: option.token.tokenID ?? null,
						},
					}))
				: [],
			chainId: Number(chainId),
		},
		enabled:
			!!pendingFeeOptionConfirmation?.options &&
			!!pendingFeeOptionConfirmation?.id,
	});

	useEffect(() => {
		autoSelectOptionPromise.then((res) => {
			if (pendingFeeOptionConfirmation?.id && res.selectedOption) {
				confirmPendingFeeOption(
					pendingFeeOptionConfirmation.id,
					res.selectedOption.token.contractAddress,
				);
			}
		});
	}, [
		autoSelectOptionPromise,
		confirmPendingFeeOption,
		pendingFeeOptionConfirmation,
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
