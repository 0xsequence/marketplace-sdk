import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import { addDays } from 'date-fns/addDays';
import type { Hex } from 'viem';
import { type Currency, OrderbookKind } from '../../../../types';
import type { CollectionType, TransactionSteps } from '../../../_internal';
import type { BaseModalState, ModalCallbacks } from '../_internal/types';

type CreateListingState = BaseModalState & {
	collectibleId: string;
	collectionName: string;
	orderbookKind?: OrderbookKind;
	collectionType: CollectionType | undefined;
	listingPrice: {
		amountRaw: string;
		currency: Currency;
	};
	quantity: string;
	invalidQuantity: boolean;
	expiry: Date;
	steps: TransactionSteps;
	listingIsBeingProcessed: boolean;
};

export type OpenCreateListingModalArgs = {
	collectionAddress: Hex;
	chainId: number;
	collectibleId: string;
	orderbookKind?: OrderbookKind;
	callbacks?: ModalCallbacks;
};

const initialListingPrice = {
	amountRaw: '0',
	currency: {} as Currency,
};

const initialApproval = {
	exist: false,
	isExecuting: false,
	execute: () => Promise.resolve(),
};

const initialTransaction = {
	exist: false,
	isExecuting: false,
	execute: () => Promise.resolve(),
};

const initialSteps = {
	approval: { ...initialApproval },
	transaction: { ...initialTransaction },
};

const initialContext: CreateListingState = {
	isOpen: false,
	collectionAddress: '' as Hex,
	chainId: 0,
	collectibleId: '',
	orderbookKind: OrderbookKind.sequence_marketplace_v2,
	collectionName: '',
	collectionType: undefined,
	listingPrice: { ...initialListingPrice },
	quantity: '1',
	invalidQuantity: false,
	expiry: new Date(addDays(new Date(), 7).toJSON()),
	callbacks: undefined as ModalCallbacks | undefined,
	steps: { ...initialSteps },
	listingIsBeingProcessed: false,
};

export const createListingModalStore = createStore({
	context: initialContext,
	on: {
		open: (context, event: OpenCreateListingModalArgs) => ({
			...context,
			isOpen: true,
			collectionAddress: event.collectionAddress,
			chainId: event.chainId,
			collectibleId: event.collectibleId,
			orderbookKind: event.orderbookKind || context.orderbookKind,
			callbacks: event.callbacks,
		}),
		close: () => ({
			...initialContext,
		}),
		setCollectionName: (context, event: { name: string }) => ({
			...context,
			collectionName: event.name,
		}),
		setCollectionType: (
			context,
			event: { collectionType: CollectionType },
		) => ({
			...context,
			collectionType: event.collectionType,
		}),
		setListingPrice: (
			context,
			event: { amountRaw: string; currency: Currency },
		) => ({
			...context,
			listingPrice: {
				amountRaw: event.amountRaw,
				currency: event.currency,
			},
		}),
		setQuantity: (context, event: { quantity: string }) => ({
			...context,
			quantity: event.quantity,
		}),
		setInvalidQuantity: (context, event: { invalid: boolean }) => ({
			...context,
			invalidQuantity: event.invalid,
		}),
		setExpiry: (context, event: { expiry: Date }) => ({
			...context,
			expiry: event.expiry,
		}),
		setListingIsBeingProcessed: (
			context,
			event: { isProcessing: boolean },
		) => ({
			...context,
			listingIsBeingProcessed: event.isProcessing,
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
	useSelector(createListingModalStore, (state) => state.context.isOpen);

export const useModalState = () =>
	useSelector(createListingModalStore, (state) => state.context);

export const useListingPrice = () =>
	useSelector(createListingModalStore, (state) => state.context.listingPrice);

export const useQuantity = () =>
	useSelector(createListingModalStore, (state) => state.context.quantity);

export const useInvalidQuantity = () =>
	useSelector(
		createListingModalStore,
		(state) => state.context.invalidQuantity,
	);

export const useExpiry = () =>
	useSelector(createListingModalStore, (state) => state.context.expiry);

export const useSteps = () =>
	useSelector(createListingModalStore, (state) => state.context.steps);

export const useListingIsBeingProcessed = () =>
	useSelector(
		createListingModalStore,
		(state) => state.context.listingIsBeingProcessed,
	);

// For backward compatibility with the old API
export const createListingModal = {
	open: (args: OpenCreateListingModalArgs) =>
		createListingModalStore.send({ type: 'open', ...args }),
	close: () => createListingModalStore.send({ type: 'close' }),
	collectionAddress: {
		set: (address: Hex) => {
			const current = createListingModalStore.getSnapshot().context;
			createListingModalStore.send({
				type: 'open',
				collectionAddress: address,
				chainId: current.chainId,
				collectibleId: current.collectibleId,
				orderbookKind: current.orderbookKind,
				callbacks: current.callbacks,
			});
		},
		get: () => createListingModalStore.getSnapshot().context.collectionAddress,
	},
	chainId: {
		set: (chainId: number) => {
			const current = createListingModalStore.getSnapshot().context;
			createListingModalStore.send({
				type: 'open',
				collectionAddress: current.collectionAddress,
				chainId,
				collectibleId: current.collectibleId,
				orderbookKind: current.orderbookKind,
				callbacks: current.callbacks,
			});
		},
		get: () => createListingModalStore.getSnapshot().context.chainId,
	},
	collectibleId: {
		set: (id: string) => {
			const current = createListingModalStore.getSnapshot().context;
			createListingModalStore.send({
				type: 'open',
				collectionAddress: current.collectionAddress,
				chainId: current.chainId,
				collectibleId: id,
				orderbookKind: current.orderbookKind,
				callbacks: current.callbacks,
			});
		},
		get: () => createListingModalStore.getSnapshot().context.collectibleId,
	},
	orderbookKind: {
		set: (kind: OrderbookKind | undefined) => {
			const current = createListingModalStore.getSnapshot().context;
			createListingModalStore.send({
				type: 'open',
				collectionAddress: current.collectionAddress,
				chainId: current.chainId,
				collectibleId: current.collectibleId,
				orderbookKind: kind,
				callbacks: current.callbacks,
			});
		},
		get: () => createListingModalStore.getSnapshot().context.orderbookKind,
	},
	callbacks: {
		set: (callbacks: ModalCallbacks | undefined) => {
			const current = createListingModalStore.getSnapshot().context;
			createListingModalStore.send({
				type: 'open',
				collectionAddress: current.collectionAddress,
				chainId: current.chainId,
				collectibleId: current.collectibleId,
				orderbookKind: current.orderbookKind,
				callbacks,
			});
		},
		get: () => createListingModalStore.getSnapshot().context.callbacks,
	},
	collectionName: {
		set: (name: string) =>
			createListingModalStore.send({ type: 'setCollectionName', name }),
		get: () => createListingModalStore.getSnapshot().context.collectionName,
	},
	collectionType: {
		set: (collectionType: CollectionType | undefined) => {
			if (collectionType) {
				createListingModalStore.send({
					type: 'setCollectionType',
					collectionType,
				});
			}
		},
		get: () => createListingModalStore.getSnapshot().context.collectionType,
	},
	listingPrice: {
		set: (price: { amountRaw: string; currency: Currency }) =>
			createListingModalStore.send({ type: 'setListingPrice', ...price }),
		get: () => createListingModalStore.getSnapshot().context.listingPrice,
		amountRaw: {
			set: (amountRaw: string) => {
				const current = createListingModalStore.getSnapshot().context;
				createListingModalStore.send({
					type: 'setListingPrice',
					amountRaw,
					currency: current.listingPrice.currency,
				});
			},
			get: () =>
				createListingModalStore.getSnapshot().context.listingPrice.amountRaw,
		},
		currency: {
			set: (currency: Currency) => {
				const current = createListingModalStore.getSnapshot().context;
				createListingModalStore.send({
					type: 'setListingPrice',
					amountRaw: current.listingPrice.amountRaw,
					currency,
				});
			},
			get: () =>
				createListingModalStore.getSnapshot().context.listingPrice.currency,
			contractAddress: {
				get: () =>
					createListingModalStore.getSnapshot().context.listingPrice.currency
						.contractAddress,
			},
			decimals: {
				get: () =>
					createListingModalStore.getSnapshot().context.listingPrice.currency
						.decimals,
			},
			imageUrl: {
				get: () =>
					createListingModalStore.getSnapshot().context.listingPrice.currency
						.imageUrl,
			},
		},
	},
	quantity: {
		set: (quantity: string) =>
			createListingModalStore.send({ type: 'setQuantity', quantity }),
		get: () => createListingModalStore.getSnapshot().context.quantity,
	},
	invalidQuantity: {
		set: (invalid: boolean) =>
			createListingModalStore.send({ type: 'setInvalidQuantity', invalid }),
		get: () => createListingModalStore.getSnapshot().context.invalidQuantity,
	},
	expiry: {
		set: (expiry: Date) =>
			createListingModalStore.send({ type: 'setExpiry', expiry }),
		get: () => createListingModalStore.getSnapshot().context.expiry,
	},
	listingIsBeingProcessed: {
		set: (isProcessing: boolean) =>
			createListingModalStore.send({
				type: 'setListingIsBeingProcessed',
				isProcessing,
			}),
		get: () =>
			createListingModalStore.getSnapshot().context.listingIsBeingProcessed,
	},
	steps: {
		set: (steps: TransactionSteps) =>
			createListingModalStore.send({ type: 'setSteps', steps }),
		get: () => createListingModalStore.getSnapshot().context.steps,
		peek: () => createListingModalStore.getSnapshot().context.steps,
		onChange: (callback: (steps: TransactionSteps) => void) => {
			return createListingModalStore.subscribe((state) => {
				callback(state.context.steps);
			});
		},
		delete: () => {
			// Not applicable for steps
		},
		assign: (partial: Partial<TransactionSteps>) => {
			const current = createListingModalStore.getSnapshot().context.steps;
			createListingModalStore.send({
				type: 'setSteps',
				steps: { ...current, ...partial },
			});
		},
		approval: {
			exist: {
				get: () =>
					createListingModalStore.getSnapshot().context.steps.approval.exist,
				set: (exist: boolean) => {
					const current = createListingModalStore.getSnapshot().context.steps;
					createListingModalStore.send({
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
					createListingModalStore.send({
						type: 'setApprovalExecuting',
						isExecuting,
					}),
				get: () =>
					createListingModalStore.getSnapshot().context.steps.approval
						.isExecuting,
			},
		},
		transaction: {
			exist: {
				get: () =>
					createListingModalStore.getSnapshot().context.steps.transaction.exist,
				set: (exist: boolean) => {
					const current = createListingModalStore.getSnapshot().context.steps;
					createListingModalStore.send({
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
					createListingModalStore.send({
						type: 'setTransactionExecuting',
						isExecuting,
					}),
				get: () =>
					createListingModalStore.getSnapshot().context.steps.transaction
						.isExecuting,
			},
		},
	},
	isOpen: {
		get: () => createListingModalStore.getSnapshot().context.isOpen,
	},
	get: () => createListingModalStore.getSnapshot().context,
	set: (state: Partial<CreateListingState>) => {
		const current = createListingModalStore.getSnapshot().context;
		// Handle partial updates
		if (
			state.collectionAddress !== undefined ||
			state.chainId !== undefined ||
			state.collectibleId !== undefined ||
			state.orderbookKind !== undefined ||
			state.callbacks !== undefined
		) {
			createListingModalStore.send({
				type: 'open',
				collectionAddress: state.collectionAddress || current.collectionAddress,
				chainId: state.chainId || current.chainId,
				collectibleId: state.collectibleId || current.collectibleId,
				orderbookKind:
					state.orderbookKind !== undefined
						? state.orderbookKind
						: current.orderbookKind,
				callbacks:
					state.callbacks !== undefined ? state.callbacks : current.callbacks,
			});
		}
		if (state.collectionName !== undefined) {
			createListingModalStore.send({
				type: 'setCollectionName',
				name: state.collectionName,
			});
		}
		if (state.collectionType !== undefined) {
			createListingModalStore.send({
				type: 'setCollectionType',
				collectionType: state.collectionType,
			});
		}
		if (state.listingPrice !== undefined) {
			createListingModalStore.send({
				type: 'setListingPrice',
				...state.listingPrice,
			});
		}
		if (state.quantity !== undefined) {
			createListingModalStore.send({
				type: 'setQuantity',
				quantity: state.quantity,
			});
		}
		if (state.invalidQuantity !== undefined) {
			createListingModalStore.send({
				type: 'setInvalidQuantity',
				invalid: state.invalidQuantity,
			});
		}
		if (state.expiry !== undefined) {
			createListingModalStore.send({ type: 'setExpiry', expiry: state.expiry });
		}
		if (state.listingIsBeingProcessed !== undefined) {
			createListingModalStore.send({
				type: 'setListingIsBeingProcessed',
				isProcessing: state.listingIsBeingProcessed,
			});
		}
		if (state.steps !== undefined) {
			createListingModalStore.send({ type: 'setSteps', steps: state.steps });
		}
	},
};

// Export the old name for backward compatibility
export const createListingModal$ = createListingModal;
