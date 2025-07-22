import { createStore } from '@xstate/store';
import type { Hex } from 'viem';
import type { FeeOption } from '../../../../../types/waas-types';
import type { Order } from '../../../../_internal';

export type SellModalStatus =
	| 'idle'
	| 'checking_approval'
	| 'awaiting_approval'
	| 'approving'
	| 'ready_to_sell'
	| 'selecting_fees'
	| 'executing'
	| 'completed'
	| 'error';

export interface SellModalContext {
	isOpen: boolean;

	collectionAddress: Hex | null;
	chainId: number | null;
	tokenId: string | null;
	order: Order | null;

	// Transaction State
	status: SellModalStatus;
	approvalRequired: boolean;

	// WaaS Fee Options
	feeOptionsVisible: boolean;
	selectedFeeOption: FeeOption | null;

	// Error Handling
	error: Error | null;

	onSuccess: ((result: { hash?: Hex; orderId?: string }) => void) | null;
	onError: ((error: Error) => void) | null;
}

const initialContext: SellModalContext = {
	isOpen: false,
	collectionAddress: null,
	chainId: null,
	tokenId: null,
	order: null,
	status: 'idle',
	approvalRequired: false,
	feeOptionsVisible: false,
	selectedFeeOption: null,
	error: null,
	onSuccess: null,
	onError: null,
};

export const sellModalStore = createStore({
	context: initialContext,

	on: {
		open: (
			context,
			event: {
				collectionAddress: Hex;
				chainId: number;
				tokenId: string;
				order: Order;
				onSuccess?: (result: { hash?: Hex; orderId?: string }) => void;
				onError?: (error: Error) => void;
			},
			enqueue,
		) => {
			enqueue.emit.modalOpened({ orderId: event.order.orderId });

			return {
				...context,
				isOpen: true,
				collectionAddress: event.collectionAddress,
				chainId: event.chainId,
				tokenId: event.tokenId,
				order: event.order,
				onSuccess: event.onSuccess || null,
				onError: event.onError || null,
				status: 'idle' as const,
				error: null,
			};
		},

		close: (_context, _, enqueue) => {
			enqueue.emit.modalClosed();
			return initialContext;
		},

		checkApprovalStart: (context) => ({
			...context,
			status: 'checking_approval' as const,
			error: null,
		}),

		approvalRequired: (context, _event: { step: any }) => ({
			...context,
			status: 'awaiting_approval' as const,
			approvalRequired: true,
		}),

		approvalNotRequired: (context) => ({
			...context,
			status: 'ready_to_sell' as const,
			approvalRequired: false,
		}),

		startApproval: (context, _, enqueue) => {
			if (context.order) {
				enqueue.emit.approvalStarted({
					tokenAddress: context.order.priceCurrencyAddress || '',
				});
			}

			return {
				...context,
				status: 'approving' as const,
			};
		},

		approvalCompleted: (context) => ({
			...context,
			status: 'ready_to_sell' as const,
			approvalRequired: false,
		}),

		// Fee Selection (WaaS)
		showFeeOptions: (context) => ({
			...context,
			status: 'selecting_fees' as const,
			feeOptionsVisible: true,
		}),

		selectFeeOption: (context, event: { option: FeeOption }) => ({
			...context,
			selectedFeeOption: event.option,
		}),

		hideFeeOptions: (context) => ({
			...context,
			feeOptionsVisible: false,
			status: 'ready_to_sell' as const,
		}),

		startSell: (context, _, enqueue) => {
			if (context.order) {
				enqueue.emit.transactionStarted({
					orderId: context.order.orderId,
				});
			}

			return {
				...context,
				status: 'executing' as const,
				error: null,
			};
		},

		sellCompleted: (
			context,
			event: { hash?: Hex; orderId?: string },
			enqueue,
		) => {
			if (context.onSuccess) {
				enqueue.effect(() => {
					context.onSuccess?.({
						hash: event.hash,
						orderId: event.orderId,
					});
				});
			}

			enqueue.emit.transactionCompleted({
				hash: event.hash,
				orderId: event.orderId || context.order?.orderId || '',
			});

			return {
				...context,
				status: 'completed' as const,
			};
		},

		errorOccurred: (context, event: { error: Error }, enqueue) => {
			if (context.onError) {
				enqueue.effect(() => {
					context.onError?.(event.error);
				});
			}

			enqueue.emit.transactionFailed({
				error: event.error,
			});

			return {
				...context,
				status: 'error' as const,
				error: event.error,
			};
		},

		clearError: (context) => ({
			...context,
			error: null,
			status: 'idle' as const,
		}),
	},

	emits: {
		modalOpened: (_payload: { orderId: string }) => {},
		approvalStarted: (_payload: { tokenAddress: string }) => {},
		transactionStarted: (_payload: { orderId: string }) => {},
		transactionCompleted: (_payload: { hash?: Hex; orderId: string }) => {},
		transactionFailed: (_payload: { error: Error }) => {},
		modalClosed: () => {},
	},
});
