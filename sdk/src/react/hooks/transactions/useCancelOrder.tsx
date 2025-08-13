'use client';
import { useWaasFeeOptions } from '@0xsequence/connect';
import { useEffect, useState } from 'react';
import type * as types from '../../_internal';
import { useAutoSelectFeeOption } from '../utils/useAutoSelectFeeOption';
import { useCancelTransactionSteps } from './useCancelTransactionSteps';

interface UseCancelOrderArgs {
	collectionAddress: string;
	chainId: number;
	onSuccess?: ({ hash, orderId }: { hash?: string; orderId?: string }) => void;
	onError?: (error: Error) => void;
}

export type TransactionStep = {
	exist: boolean;
	isExecuting: boolean;
	execute: () => Promise<void>;
};

/**
 * Manages the cancellation of marketplace orders (listings and offers)
 *
 * This hook handles the complete order cancellation flow including fee selection
 * for WaaS wallets, transaction generation, and execution. It automatically manages
 * the transaction steps and provides real-time status updates.
 *
 * @param params - Configuration for order cancellation
 * @param params.collectionAddress - The NFT collection contract address
 * @param params.chainId - The blockchain network ID
 * @param params.onSuccess - Callback when cancellation succeeds
 * @param params.onError - Callback when cancellation fails
 *
 * @returns Order cancellation interface
 * @returns returns.cancelOrder - Function to initiate order cancellation
 * @returns returns.isExecuting - True while a cancellation is in progress
 * @returns returns.cancellingOrderId - ID of the order currently being cancelled
 *
 * @example
 * Basic usage:
 * ```typescript
 * const { cancelOrder, isExecuting } = useCancelOrder({
 *   collectionAddress: '0x...',
 *   chainId: 137,
 *   onSuccess: ({ orderId }) => {
 *     console.log(`Order ${orderId} cancelled`);
 *   },
 *   onError: (error) => {
 *     console.error('Cancellation failed:', error);
 *   }
 * });
 *
 * // Cancel an order
 * await cancelOrder({
 *   orderId: '123',
 *   marketplace: MarketplaceKind.sequence_marketplace_v2
 * });
 * ```
 *
 * @example
 * With UI feedback:
 * ```typescript
 * const { cancelOrder, isExecuting, cancellingOrderId } = useCancelOrder({
 *   collectionAddress: collection.address,
 *   chainId: collection.chainId
 * });
 *
 * return (
 *   <button
 *     onClick={() => cancelOrder({ orderId, marketplace })}
 *     disabled={isExecuting}
 *   >
 *     {cancellingOrderId === orderId ? 'Cancelling...' : 'Cancel Order'}
 *   </button>
 * );
 * ```
 *
 * @remarks
 * - Automatically handles WaaS fee option selection when required
 * - The hook manages transaction steps internally via `useCancelTransactionSteps`
 * - Only one cancellation can be processed at a time
 * - The `cancellingOrderId` helps track which specific order is being cancelled
 *
 * @see {@link useCancelTransactionSteps} - Lower-level hook for transaction steps
 * @see {@link useAutoSelectFeeOption} - Fee selection logic for WaaS
 * @see {@link MarketplaceKind} - Supported marketplace types
 */
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
					chainId,
				}
			: {
					id: '',
					options: undefined,
					chainId,
				},
		enabled: !!pendingFeeOptionConfirmation && !!cancellingOrderId,
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
