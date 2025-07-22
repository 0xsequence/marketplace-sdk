import { createAtom } from '@xstate/store';
import type { Hex } from 'viem';
import type { Order, Step } from '../../../../_internal';

export type SellTransactionStatus =
	| 'idle'
	| 'checking_approval'
	| 'awaiting_approval'
	| 'approving'
	| 'approved'
	| 'executing_sell'
	| 'completed'
	| 'failed';

export interface SellTransactionState {
	status: SellTransactionStatus;
	order: Order | null;
	approvalStep: Step | null;
	transactionHash: Hex | null;
	orderId: string | null;
	error: Error | null;
}

export interface CheckApprovalParams {
	chainId: number;
	collectionAddress: Hex;
	tokenId: string;
	order: Order;
	walletAddress: Hex;
}

export interface ApprovalParams {
	chainId: number;
	step: Step;
}

export interface SellParams {
	chainId: number;
	collectionAddress: Hex;
	order: Order;
	walletAddress: Hex;
}

export function createSellTransaction(initialOrder?: Order) {
	const state = createAtom<SellTransactionState>({
		status: 'idle',
		order: initialOrder || null,
		approvalStep: null,
		transactionHash: null,
		orderId: null,
		error: null,
	});

	const setStatus = (status: SellTransactionStatus) => {
		state.set((prev) => ({ ...prev, status }));
	};

	const setError = (error: Error) => {
		state.set((prev) => ({
			...prev,
			status: 'failed',
			error,
		}));
	};

	const setApprovalStep = (step: Step | null) => {
		state.set((prev) => ({ ...prev, approvalStep: step }));
	};

	const setTransactionResult = (hash: Hex, orderId: string) => {
		state.set((prev) => ({
			...prev,
			transactionHash: hash,
			orderId,
			status: 'completed',
		}));
	};

	const reset = () => {
		state.set({
			status: 'idle',
			order: null,
			approvalStep: null,
			transactionHash: null,
			orderId: null,
			error: null,
		});
	};

	return {
		state,
		setStatus,
		setError,
		setApprovalStep,
		setTransactionResult,
		reset,
	};
}

// Create a combined atom that derives state from multiple sources
export function createSellTransactionFlow() {
	const transaction = createSellTransaction();

	// Derived state for UI
	const isProcessing = createAtom(() => {
		const status = transaction.state.get().status;
		return ['checking_approval', 'approving', 'executing_sell'].includes(
			status,
		);
	});

	const canExecuteSell = createAtom(() => {
		const status = transaction.state.get().status;
		return status === 'approved' || status === 'idle';
	});

	const requiresApproval = createAtom(() => {
		const { status, approvalStep } = transaction.state.get();
		return status === 'awaiting_approval' && approvalStep !== null;
	});

	return {
		transaction,
		isProcessing,
		canExecuteSell,
		requiresApproval,
	};
}
