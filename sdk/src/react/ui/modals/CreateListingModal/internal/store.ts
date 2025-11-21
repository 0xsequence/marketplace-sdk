import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { Address } from 'viem';
import { OrderbookKind } from '../../../../../types';
import type { ModalCallbacks } from '../../_internal/types';

export type OpenCreateListingModalArgs = {
	collectionAddress: Address;
	chainId: number;
	collectibleId: string;
	orderbookKind?: OrderbookKind;
	callbacks?: ModalCallbacks;
};

/**
 * Minimal store state - only identity and raw user input
 * All derived state (parsed values, validation, selected objects) is computed in context
 */
type CreateListingModalState = OpenCreateListingModalArgs & {
	isOpen: boolean;
	// Raw user input only (not parsed or validated)
	priceInput: string; // "1.5" - NOT parsed to wei
	currencyAddress?: Address; // User's explicit selection (optional!)
	quantityInput: string; // "2" - NOT parsed to smallest unit
	expiryDays: number; // Number of days from now (7 = 7 days)
};

const initialContext: CreateListingModalState = {
	isOpen: false,
	collectionAddress: '' as Address,
	chainId: 0,
	collectibleId: '',
	orderbookKind: OrderbookKind.sequence_marketplace_v2,
	priceInput: '',
	currencyAddress: undefined,
	quantityInput: '1',
	expiryDays: 7,
	callbacks: undefined,
};

export const createListingModalStore = createStore({
	context: { ...initialContext },
	on: {
		open: (_context, event: OpenCreateListingModalArgs) => ({
			...initialContext,
			isOpen: true,
			...event,
			expiryDays: 7,
			priceInput: '',
			quantityInput: '1',
		}),
		close: () => ({ ...initialContext }),

		// Simple updates - no validation, no parsing
		updatePrice: (context, event: { value: string }) => ({
			...context,
			priceInput: event.value,
		}),
		selectCurrency: (context, event: { address: Address }) => ({
			...context,
			currencyAddress: event.address,
		}),
		updateQuantity: (context, event: { value: string }) => ({
			...context,
			quantityInput: event.value,
		}),
		updateExpiryDays: (context, event: { days: number }) => ({
			...context,
			expiryDays: event.days,
		}),
	},
});

// Public hook for opening/closing modal
export const useCreateListingModal = () => {
	const state = useSelector(createListingModalStore, (state) => state.context);

	return {
		...state,
		show: (args: OpenCreateListingModalArgs) =>
			createListingModalStore.send({ type: 'open', ...args }),
		close: () => createListingModalStore.send({ type: 'close' }),
	};
};

// Internal hook for context to access state
export const useCreateListingModalState = () => {
	const {
		isOpen,
		collectibleId,
		collectionAddress,
		chainId,
		orderbookKind,
		callbacks,
		priceInput,
		currencyAddress,
		quantityInput,
		expiryDays,
	} = useSelector(createListingModalStore, (state) => state.context);

	const closeModal = () => createListingModalStore.send({ type: 'close' });

	return {
		isOpen,
		collectibleId,
		collectionAddress,
		chainId,
		orderbookKind,
		callbacks,
		priceInput,
		currencyAddress,
		quantityInput,
		expiryDays,
		closeModal,
	};
};
