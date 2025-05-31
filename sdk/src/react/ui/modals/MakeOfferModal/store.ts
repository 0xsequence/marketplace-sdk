import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import { addDays } from 'date-fns/addDays';
import type { Hex } from 'viem';
import { type Currency, OrderbookKind, type Price } from '../../../../types';
import type { CollectionType, TransactionSteps } from '../../../_internal';
import type { BaseModalState, ModalCallbacks } from '../_internal/types';

type MakeOfferState = BaseModalState & {
	orderbookKind?: OrderbookKind;
	collectibleId: string;
	offerPrice: Price;
	offerPriceChanged: boolean;
	quantity: string;
	expiry: Date;
	invalidQuantity: boolean;
	collectionType?: CollectionType;
	steps: TransactionSteps;
	offerIsBeingProcessed: boolean;
};

export type OpenMakeOfferModalArgs = {
	collectionAddress: Hex;
	chainId: number;
	collectibleId: string;
	orderbookKind?: OrderbookKind;
	callbacks?: ModalCallbacks;
};

const initialOfferPrice = {
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

const initialContext: MakeOfferState = {
	isOpen: false,
	collectionAddress: '' as Hex,
	chainId: 0,
	collectibleId: '',
	orderbookKind: OrderbookKind.sequence_marketplace_v2,
	offerPrice: { ...initialOfferPrice },
	offerPriceChanged: false,
	quantity: '1',
	invalidQuantity: false,
	expiry: new Date(addDays(new Date(), 7).toJSON()),
	collectionType: undefined,
	callbacks: undefined as ModalCallbacks | undefined,
	steps: { ...initialSteps },
	offerIsBeingProcessed: false,
};

export const makeOfferModalStore = createStore({
	context: initialContext,
	on: {
		open: (context, event: OpenMakeOfferModalArgs) => ({
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
		setOfferPrice: (
			context,
			event: { amountRaw: string; currency: Currency },
		) => ({
			...context,
			offerPrice: {
				amountRaw: event.amountRaw,
				currency: event.currency,
			},
			offerPriceChanged: true,
		}),
		setOfferPriceChanged: (context, event: { changed: boolean }) => ({
			...context,
			offerPriceChanged: event.changed,
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
		setCollectionType: (
			context,
			event: { collectionType: CollectionType },
		) => ({
			...context,
			collectionType: event.collectionType,
		}),
		setOfferIsBeingProcessed: (context, event: { isProcessing: boolean }) => ({
			...context,
			offerIsBeingProcessed: event.isProcessing,
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
	useSelector(makeOfferModalStore, (state) => state.context.isOpen);

export const useModalState = () =>
	useSelector(makeOfferModalStore, (state) => state.context);

export const useOfferPrice = () =>
	useSelector(makeOfferModalStore, (state) => state.context.offerPrice);

export const useOfferPriceChanged = () =>
	useSelector(makeOfferModalStore, (state) => state.context.offerPriceChanged);

export const useQuantity = () =>
	useSelector(makeOfferModalStore, (state) => state.context.quantity);

export const useInvalidQuantity = () =>
	useSelector(makeOfferModalStore, (state) => state.context.invalidQuantity);

export const useExpiry = () =>
	useSelector(makeOfferModalStore, (state) => state.context.expiry);

export const useSteps = () =>
	useSelector(makeOfferModalStore, (state) => state.context.steps);

export const useOfferIsBeingProcessed = () =>
	useSelector(
		makeOfferModalStore,
		(state) => state.context.offerIsBeingProcessed,
	);

// For backward compatibility with the old API
export const makeOfferModal = {
	open: (args: OpenMakeOfferModalArgs) =>
		makeOfferModalStore.send({ type: 'open', ...args }),
	close: () => makeOfferModalStore.send({ type: 'close' }),
	collectionAddress: {
		set: (address: Hex) => {
			const current = makeOfferModalStore.getSnapshot().context;
			makeOfferModalStore.send({
				type: 'open',
				collectionAddress: address,
				chainId: current.chainId,
				collectibleId: current.collectibleId,
				orderbookKind: current.orderbookKind,
				callbacks: current.callbacks,
			});
		},
		get: () => makeOfferModalStore.getSnapshot().context.collectionAddress,
	},
	chainId: {
		set: (chainId: number) => {
			const current = makeOfferModalStore.getSnapshot().context;
			makeOfferModalStore.send({
				type: 'open',
				collectionAddress: current.collectionAddress,
				chainId,
				collectibleId: current.collectibleId,
				orderbookKind: current.orderbookKind,
				callbacks: current.callbacks,
			});
		},
		get: () => makeOfferModalStore.getSnapshot().context.chainId,
	},
	collectibleId: {
		set: (id: string) => {
			const current = makeOfferModalStore.getSnapshot().context;
			makeOfferModalStore.send({
				type: 'open',
				collectionAddress: current.collectionAddress,
				chainId: current.chainId,
				collectibleId: id,
				orderbookKind: current.orderbookKind,
				callbacks: current.callbacks,
			});
		},
		get: () => makeOfferModalStore.getSnapshot().context.collectibleId,
	},
	orderbookKind: {
		set: (kind: OrderbookKind | undefined) => {
			const current = makeOfferModalStore.getSnapshot().context;
			makeOfferModalStore.send({
				type: 'open',
				collectionAddress: current.collectionAddress,
				chainId: current.chainId,
				collectibleId: current.collectibleId,
				orderbookKind: kind,
				callbacks: current.callbacks,
			});
		},
		get: () => makeOfferModalStore.getSnapshot().context.orderbookKind,
	},
	callbacks: {
		set: (callbacks: ModalCallbacks | undefined) => {
			const current = makeOfferModalStore.getSnapshot().context;
			makeOfferModalStore.send({
				type: 'open',
				collectionAddress: current.collectionAddress,
				chainId: current.chainId,
				collectibleId: current.collectibleId,
				orderbookKind: current.orderbookKind,
				callbacks,
			});
		},
		get: () => makeOfferModalStore.getSnapshot().context.callbacks,
	},
	offerPrice: {
		set: (price: Price) =>
			makeOfferModalStore.send({ type: 'setOfferPrice', ...price }),
		get: () => makeOfferModalStore.getSnapshot().context.offerPrice,
		amountRaw: {
			set: (amountRaw: string) => {
				const current = makeOfferModalStore.getSnapshot().context;
				makeOfferModalStore.send({
					type: 'setOfferPrice',
					amountRaw,
					currency: current.offerPrice.currency,
				});
			},
			get: () => makeOfferModalStore.getSnapshot().context.offerPrice.amountRaw,
		},
		currency: {
			set: (currency: Currency) => {
				const current = makeOfferModalStore.getSnapshot().context;
				makeOfferModalStore.send({
					type: 'setOfferPrice',
					amountRaw: current.offerPrice.amountRaw,
					currency,
				});
			},
			get: () => makeOfferModalStore.getSnapshot().context.offerPrice.currency,
			contractAddress: {
				get: () =>
					makeOfferModalStore.getSnapshot().context.offerPrice.currency
						.contractAddress,
			},
			decimals: {
				get: () =>
					makeOfferModalStore.getSnapshot().context.offerPrice.currency
						.decimals,
			},
			imageUrl: {
				get: () =>
					makeOfferModalStore.getSnapshot().context.offerPrice.currency
						.imageUrl,
			},
		},
	},
	offerPriceChanged: {
		set: (changed: boolean) =>
			makeOfferModalStore.send({ type: 'setOfferPriceChanged', changed }),
		get: () => makeOfferModalStore.getSnapshot().context.offerPriceChanged,
	},
	quantity: {
		set: (quantity: string) =>
			makeOfferModalStore.send({ type: 'setQuantity', quantity }),
		get: () => makeOfferModalStore.getSnapshot().context.quantity,
	},
	invalidQuantity: {
		set: (invalid: boolean) =>
			makeOfferModalStore.send({ type: 'setInvalidQuantity', invalid }),
		get: () => makeOfferModalStore.getSnapshot().context.invalidQuantity,
	},
	expiry: {
		set: (expiry: Date) =>
			makeOfferModalStore.send({ type: 'setExpiry', expiry }),
		get: () => makeOfferModalStore.getSnapshot().context.expiry,
	},
	collectionType: {
		set: (collectionType: CollectionType | undefined) => {
			if (collectionType) {
				makeOfferModalStore.send({ type: 'setCollectionType', collectionType });
			}
		},
		get: () => makeOfferModalStore.getSnapshot().context.collectionType,
	},
	offerIsBeingProcessed: {
		set: (isProcessing: boolean) =>
			makeOfferModalStore.send({
				type: 'setOfferIsBeingProcessed',
				isProcessing,
			}),
		get: () => makeOfferModalStore.getSnapshot().context.offerIsBeingProcessed,
	},
	steps: {
		set: (steps: TransactionSteps) =>
			makeOfferModalStore.send({ type: 'setSteps', steps }),
		get: () => makeOfferModalStore.getSnapshot().context.steps,
		peek: () => makeOfferModalStore.getSnapshot().context.steps,
		onChange: (callback: (steps: TransactionSteps) => void) => {
			return makeOfferModalStore.subscribe((state) => {
				callback(state.context.steps);
			});
		},
		delete: () => {
			// Not applicable for steps
		},
		assign: (partial: Partial<TransactionSteps>) => {
			const current = makeOfferModalStore.getSnapshot().context.steps;
			makeOfferModalStore.send({
				type: 'setSteps',
				steps: { ...current, ...partial },
			});
		},
		approval: {
			exist: {
				get: () =>
					makeOfferModalStore.getSnapshot().context.steps.approval.exist,
				set: (exist: boolean) => {
					const current = makeOfferModalStore.getSnapshot().context.steps;
					makeOfferModalStore.send({
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
					makeOfferModalStore.send({
						type: 'setApprovalExecuting',
						isExecuting,
					}),
				get: () =>
					makeOfferModalStore.getSnapshot().context.steps.approval.isExecuting,
			},
		},
		transaction: {
			exist: {
				get: () =>
					makeOfferModalStore.getSnapshot().context.steps.transaction.exist,
				set: (exist: boolean) => {
					const current = makeOfferModalStore.getSnapshot().context.steps;
					makeOfferModalStore.send({
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
					makeOfferModalStore.send({
						type: 'setTransactionExecuting',
						isExecuting,
					}),
				get: () =>
					makeOfferModalStore.getSnapshot().context.steps.transaction
						.isExecuting,
			},
		},
	},
	isOpen: {
		get: () => makeOfferModalStore.getSnapshot().context.isOpen,
	},
	get: () => makeOfferModalStore.getSnapshot().context,
	set: (state: Partial<MakeOfferState>) => {
		const current = makeOfferModalStore.getSnapshot().context;
		// Handle partial updates
		if (
			state.collectionAddress !== undefined ||
			state.chainId !== undefined ||
			state.collectibleId !== undefined ||
			state.orderbookKind !== undefined ||
			state.callbacks !== undefined
		) {
			makeOfferModalStore.send({
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
		if (state.offerPrice !== undefined) {
			makeOfferModalStore.send({ type: 'setOfferPrice', ...state.offerPrice });
		}
		if (state.offerPriceChanged !== undefined) {
			makeOfferModalStore.send({
				type: 'setOfferPriceChanged',
				changed: state.offerPriceChanged,
			});
		}
		if (state.quantity !== undefined) {
			makeOfferModalStore.send({
				type: 'setQuantity',
				quantity: state.quantity,
			});
		}
		if (state.invalidQuantity !== undefined) {
			makeOfferModalStore.send({
				type: 'setInvalidQuantity',
				invalid: state.invalidQuantity,
			});
		}
		if (state.expiry !== undefined) {
			makeOfferModalStore.send({ type: 'setExpiry', expiry: state.expiry });
		}
		if (state.collectionType !== undefined) {
			makeOfferModalStore.send({
				type: 'setCollectionType',
				collectionType: state.collectionType,
			});
		}
		if (state.offerIsBeingProcessed !== undefined) {
			makeOfferModalStore.send({
				type: 'setOfferIsBeingProcessed',
				isProcessing: state.offerIsBeingProcessed,
			});
		}
		if (state.steps !== undefined) {
			makeOfferModalStore.send({ type: 'setSteps', steps: state.steps });
		}
	},
};

// Export the old name for backward compatibility
export const makeOfferModal$ = makeOfferModal;
