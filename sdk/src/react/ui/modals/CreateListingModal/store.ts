import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import { addDays } from 'date-fns/addDays';
import type { Dnum } from 'dnum';
import * as dn from 'dnum';
import type { Hex } from 'viem';
import { type Currency, OrderbookKind } from '../../../../types';
import type { CollectionType, TransactionSteps } from '../../../_internal';
import type { ModalCallbacks } from '../_internal/types';

// Context type definition
type CreateListingContext = {
	isOpen: boolean;
	collectionAddress: Hex;
	chainId: number;
	collectibleId: string;
	collectionName: string;
	orderbookKind: OrderbookKind;
	collectionType: CollectionType | undefined;
	listingPrice: {
		amountRaw: string; // Legacy format for backward compatibility
		amount?: Dnum; // New DNUM format [bigint, decimals]
		currency: Currency;
	};
	quantity: string;
	invalidQuantity: boolean;
	expiry: Date;
	steps: TransactionSteps;
	listingIsBeingProcessed: boolean;
	callbacks?: ModalCallbacks;
};

// Event types
type CreateListingEvents = {
	open: {
		collectionAddress: Hex;
		chainId: number;
		collectibleId: string;
		orderbookKind?: OrderbookKind;
		callbacks?: ModalCallbacks;
	};
	close: Record<string, never>;
	updateListingPrice: {
		price: { amountRaw: string; currency: Currency };
	};
	updateListingPriceDnum: {
		amount: Dnum;
		currency: Currency;
	};
	updateCurrency: {
		currency: Currency;
	};
	updateQuantity: {
		quantity: string;
	};
	setInvalidQuantity: {
		invalid: boolean;
	};
	updateExpiry: {
		expiry: Date;
	};
	setListingProcessing: {
		processing: boolean;
	};
	updateSteps: {
		steps: Partial<TransactionSteps>;
	};
	setApprovalExecuting: {
		executing: boolean;
	};
	setTransactionExecuting: {
		executing: boolean;
	};
	updateCollectionData: {
		name?: string;
		type?: CollectionType;
	};
};

export type OpenCreateListingModalArgs = CreateListingEvents['open'];

// Helper functions for creating initial objects
const createInitialListingPrice = () => ({
	amountRaw: '0',
	currency: {} as Currency,
});

const createInitialApproval = () => ({
	exist: false,
	isExecuting: false,
	execute: () => Promise.resolve(),
});

const createInitialTransaction = () => ({
	exist: false,
	isExecuting: false,
	execute: () => Promise.resolve(),
});

const createInitialSteps = (): TransactionSteps => ({
	approval: createInitialApproval(),
	transaction: createInitialTransaction(),
});

// Initial context
const initialContext: CreateListingContext = {
	isOpen: false,
	collectionAddress: '' as Hex,
	chainId: 0,
	collectibleId: '',
	orderbookKind: OrderbookKind.sequence_marketplace_v2,
	collectionName: '',
	collectionType: undefined,
	listingPrice: createInitialListingPrice(),
	quantity: '1',
	invalidQuantity: false,
	expiry: new Date(addDays(new Date(), 7).toJSON()),
	callbacks: undefined,
	steps: createInitialSteps(),
	listingIsBeingProcessed: false,
};

// Store creation
export const createListingModalStore = createStore({
	context: { ...initialContext },
	on: {
		open: (context, event: CreateListingEvents['open']) => ({
			...context,
			collectionAddress: event.collectionAddress,
			chainId: event.chainId,
			collectibleId: event.collectibleId,
			orderbookKind:
				event.orderbookKind ?? OrderbookKind.sequence_marketplace_v2,
			callbacks: event.callbacks,
			isOpen: true,
		}),

		close: () => ({
			...initialContext,
			expiry: new Date(addDays(new Date(), 7).toJSON()), // Reset expiry to new date
		}),

		updateListingPrice: (
			context,
			event: CreateListingEvents['updateListingPrice'],
		) => ({
			...context,
			listingPrice: event.price,
		}),

		updateListingPriceDnum: (
			context,
			event: CreateListingEvents['updateListingPriceDnum'],
		) => ({
			...context,
			listingPrice: {
				...context.listingPrice,
				amount: event.amount,
				amountRaw: dn.toString(event.amount), // Keep legacy format in sync
				currency: event.currency,
			},
		}),

		updateCurrency: (context, event: CreateListingEvents['updateCurrency']) => {
			const newListingPrice = {
				...context.listingPrice,
				currency: event.currency,
			};

			// If we have a DNUM amount, update it with new decimals
			if (context.listingPrice.amount) {
				const newAmount = dn.setDecimals(
					context.listingPrice.amount,
					event.currency.decimals,
				);
				newListingPrice.amount = newAmount;
				newListingPrice.amountRaw = dn.toString(newAmount);
			}

			return {
				...context,
				listingPrice: newListingPrice,
			};
		},
		updateQuantity: (
			context,
			event: CreateListingEvents['updateQuantity'],
		) => ({
			...context,
			quantity: event.quantity,
		}),

		setInvalidQuantity: (
			context,
			event: CreateListingEvents['setInvalidQuantity'],
		) => ({
			...context,
			invalidQuantity: event.invalid,
		}),

		updateExpiry: (context, event: CreateListingEvents['updateExpiry']) => ({
			...context,
			expiry: event.expiry,
		}),

		setListingProcessing: (
			context,
			event: CreateListingEvents['setListingProcessing'],
		) => ({
			...context,
			listingIsBeingProcessed: event.processing,
		}),

		updateSteps: (context, event: CreateListingEvents['updateSteps']) => ({
			...context,
			steps: {
				...context.steps,
				...event.steps,
			},
		}),

		setApprovalExecuting: (
			context,
			event: CreateListingEvents['setApprovalExecuting'],
		) => ({
			...context,
			steps: {
				...context.steps,
				approval: {
					...context.steps.approval,
					isExecuting: event.executing,
				},
			},
		}),

		setTransactionExecuting: (
			context,
			event: CreateListingEvents['setTransactionExecuting'],
		) => ({
			...context,
			steps: {
				...context.steps,
				transaction: {
					...context.steps.transaction,
					isExecuting: event.executing,
				},
			},
		}),

		updateCollectionData: (
			context,
			event: CreateListingEvents['updateCollectionData'],
		) => ({
			...context,
			collectionName: event.name ?? context.collectionName,
			collectionType: event.type ?? context.collectionType,
		}),
	},
});

// Selector hooks
export const useIsOpen = () =>
	useSelector(createListingModalStore, (state) => state.context.isOpen);

export const useCreateListingState = () =>
	useSelector(createListingModalStore, (state) => state.context);

export const useListingPrice = () =>
	useSelector(createListingModalStore, (state) => state.context.listingPrice);

export const useListingPriceDnum = () =>
	useSelector(createListingModalStore, (state) => {
		const { listingPrice } = state.context;
		// Return DNUM if available, otherwise convert from legacy format
		return (
			listingPrice.amount ??
			dn.from(listingPrice.amountRaw, listingPrice.currency.decimals)
		);
	});

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

export const useListingProcessing = () =>
	useSelector(
		createListingModalStore,
		(state) => state.context.listingIsBeingProcessed,
	);

export const useCollectionData = () =>
	useSelector(createListingModalStore, (state) => ({
		name: state.context.collectionName,
		type: state.context.collectionType,
	}));

// Export types
export type { CreateListingContext, CreateListingEvents };
