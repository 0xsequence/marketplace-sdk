import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { Hex } from 'viem';
import type { Order, TransactionSteps } from '../../../_internal';
import type { BaseModalState, ModalCallbacks } from '../_internal/types';

export type OpenSellModalArgs = {
	collectionAddress: Hex;
	chainId: number;
	tokenId: string;
	order: Order;
	callbacks?: ModalCallbacks;
};

type SellModalState = BaseModalState & {
	tokenId: string;
	order?: Order;
	steps: TransactionSteps;
	sellIsBeingProcessed: boolean;
};

const initialSteps: TransactionSteps = {
	approval: {
		exist: false,
		isExecuting: false,
		execute: () => Promise.resolve(),
	},
	transaction: {
		exist: false,
		isExecuting: false,
		execute: () => Promise.resolve(),
	},
};

const initialContext: SellModalState = {
	isOpen: false,
	collectionAddress: '' as Hex,
	chainId: 0,
	tokenId: '',
	order: undefined,
	callbacks: undefined,
	sellIsBeingProcessed: false,
	steps: { ...initialSteps },
};

export const sellModalStore = createStore({
	context: initialContext,
	on: {
		open: (context, event: OpenSellModalArgs) => ({
			...context,
			isOpen: true,
			collectionAddress: event.collectionAddress,
			chainId: event.chainId,
			tokenId: event.tokenId,
			order: event.order,
			callbacks: event.callbacks,
		}),
		close: () => ({
			...initialContext,
		}),
		setSellIsBeingProcessed: (context, event: { isProcessing: boolean }) => ({
			...context,
			sellIsBeingProcessed: event.isProcessing,
		}),
		setSteps: (context, event: { steps: TransactionSteps }) => ({
			...context,
			steps: event.steps,
		}),
		setApprovalExecuting: (context, event: { isExecuting: boolean }) => ({
			...context,
			steps: {
				...context.steps,
				approval: {
					...context.steps.approval,
					isExecuting: event.isExecuting,
				},
			},
		}),
		setTransactionExecuting: (context, event: { isExecuting: boolean }) => ({
			...context,
			steps: {
				...context.steps,
				transaction: {
					...context.steps.transaction,
					isExecuting: event.isExecuting,
				},
			},
		}),
	},
});

// Selector hooks
export const useIsOpen = () =>
	useSelector(sellModalStore, (state) => state.context.isOpen);

export const useModalState = () =>
	useSelector(sellModalStore, (state) => state.context);

export const useOrder = () =>
	useSelector(sellModalStore, (state) => state.context.order);

export const useSteps = () =>
	useSelector(sellModalStore, (state) => state.context.steps);

export const useSellIsBeingProcessed = () =>
	useSelector(sellModalStore, (state) => state.context.sellIsBeingProcessed);

// For backward compatibility with the old API
export const sellModal = {
	open: (args: OpenSellModalArgs) =>
		sellModalStore.send({ type: 'open', ...args }),
	close: () => sellModalStore.send({ type: 'close' }),
	collectionAddress: {
		set: (address: Hex) => {
			const current = sellModalStore.getSnapshot().context;
			sellModalStore.send({
				type: 'open',
				collectionAddress: address,
				chainId: current.chainId,
				tokenId: current.tokenId,
				order: current.order || ({} as Order),
				callbacks: current.callbacks,
			});
		},
		get: () => sellModalStore.getSnapshot().context.collectionAddress,
	},
	chainId: {
		set: (chainId: number) => {
			const current = sellModalStore.getSnapshot().context;
			sellModalStore.send({
				type: 'open',
				collectionAddress: current.collectionAddress,
				chainId,
				tokenId: current.tokenId,
				order: current.order || ({} as Order),
				callbacks: current.callbacks,
			});
		},
		get: () => sellModalStore.getSnapshot().context.chainId,
	},
	tokenId: {
		set: (tokenId: string) => {
			const current = sellModalStore.getSnapshot().context;
			sellModalStore.send({
				type: 'open',
				collectionAddress: current.collectionAddress,
				chainId: current.chainId,
				tokenId,
				order: current.order || ({} as Order),
				callbacks: current.callbacks,
			});
		},
		get: () => sellModalStore.getSnapshot().context.tokenId,
	},
	order: {
		set: (order: Order | undefined) => {
			if (order) {
				const current = sellModalStore.getSnapshot().context;
				sellModalStore.send({
					type: 'open',
					collectionAddress: current.collectionAddress,
					chainId: current.chainId,
					tokenId: current.tokenId,
					order,
					callbacks: current.callbacks,
				});
			}
		},
		get: () => sellModalStore.getSnapshot().context.order,
	},
	callbacks: {
		set: (callbacks: ModalCallbacks | undefined) => {
			const current = sellModalStore.getSnapshot().context;
			if (current.order) {
				sellModalStore.send({
					type: 'open',
					collectionAddress: current.collectionAddress,
					chainId: current.chainId,
					tokenId: current.tokenId,
					order: current.order,
					callbacks,
				});
			}
		},
		get: () => sellModalStore.getSnapshot().context.callbacks,
	},
	sellIsBeingProcessed: {
		set: (isProcessing: boolean) =>
			sellModalStore.send({ type: 'setSellIsBeingProcessed', isProcessing }),
		get: () => sellModalStore.getSnapshot().context.sellIsBeingProcessed,
	},
	steps: {
		set: (steps: TransactionSteps) =>
			sellModalStore.send({ type: 'setSteps', steps }),
		get: () => sellModalStore.getSnapshot().context.steps,
		peek: () => sellModalStore.getSnapshot().context.steps,
		onChange: (callback: (steps: TransactionSteps) => void) => {
			return sellModalStore.subscribe((state) => {
				callback(state.context.steps);
			});
		},
		delete: () => {
			// Not applicable for steps
		},
		assign: (partial: Partial<TransactionSteps>) => {
			const current = sellModalStore.getSnapshot().context.steps;
			sellModalStore.send({
				type: 'setSteps',
				steps: { ...current, ...partial },
			});
		},
		approval: {
			exist: {
				get: () => sellModalStore.getSnapshot().context.steps.approval.exist,
				set: (exist: boolean) => {
					const current = sellModalStore.getSnapshot().context.steps;
					sellModalStore.send({
						type: 'setSteps',
						steps: {
							...current,
							approval: { ...current.approval, exist },
						},
					});
				},
			},
			isExecuting: {
				set: (isExecuting: boolean) =>
					sellModalStore.send({ type: 'setApprovalExecuting', isExecuting }),
				get: () =>
					sellModalStore.getSnapshot().context.steps.approval.isExecuting,
			},
		},
		transaction: {
			exist: {
				get: () => sellModalStore.getSnapshot().context.steps.transaction.exist,
				set: (exist: boolean) => {
					const current = sellModalStore.getSnapshot().context.steps;
					sellModalStore.send({
						type: 'setSteps',
						steps: {
							...current,
							transaction: { ...current.transaction, exist },
						},
					});
				},
			},
			isExecuting: {
				set: (isExecuting: boolean) =>
					sellModalStore.send({ type: 'setTransactionExecuting', isExecuting }),
				get: () =>
					sellModalStore.getSnapshot().context.steps.transaction.isExecuting,
			},
		},
	},
	isOpen: {
		get: () => sellModalStore.getSnapshot().context.isOpen,
		set: (isOpen: boolean) => {
			if (isOpen) {
				const current = sellModalStore.getSnapshot().context;
				if (current.order) {
					sellModalStore.send({
						type: 'open',
						collectionAddress: current.collectionAddress,
						chainId: current.chainId,
						tokenId: current.tokenId,
						order: current.order,
						callbacks: current.callbacks,
					});
				}
			} else {
				sellModalStore.send({ type: 'close' });
			}
		},
	},
	get: () => sellModalStore.getSnapshot().context,
};

// Export the old name for backward compatibility
export const sellModal$ = sellModal;
