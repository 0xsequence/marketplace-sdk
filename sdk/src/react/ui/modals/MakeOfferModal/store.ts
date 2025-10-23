import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import { addDays } from 'date-fns/addDays';
import type { Address } from 'viem';
import type { Currency, OrderbookKind, Price } from '../../../../types';
import type { BaseModalState, ModalCallbacks } from '../_internal/types';

export type OpenMakeOfferModalArgs = {
	collectionAddress: Address;
	chainId: number;
	collectibleId: string;
	orderbookKind?: OrderbookKind;
	callbacks?: ModalCallbacks;
};

// ✅ SellModal pattern: Minimal store with only essential persistent data
interface MakeOfferModalState extends BaseModalState {
	collectibleId: string;
	orderbookKind?: OrderbookKind;
	offerPrice: Price;
	offerPriceChanged: boolean;
	quantity: string;
	expiry: Date;
	// ❌ Removed UI validation state - should be derived in components
	// invalidQuantity: boolean;
	// insufficientBalance: boolean;
	// openseaLowestPriceCriteriaMet: boolean;
}

const initialContext: MakeOfferModalState = {
	isOpen: false,
	collectionAddress: '' as Address,
	chainId: 0,
	collectibleId: '',
	orderbookKind: undefined,
	callbacks: undefined,
	offerPrice: {
		amountRaw: '0',
		currency: {} as Currency,
	},
	offerPriceChanged: false,
	quantity: '1',
	expiry: addDays(new Date(), 7),
};

export const makeOfferModalStore = createStore({
	context: { ...initialContext },
	on: {
		open: (
			_context,
			event: {
				args: OpenMakeOfferModalArgs;
			},
		) => ({
			...initialContext, // Reset to initial state
			isOpen: true,
			collectionAddress: event.args.collectionAddress,
			chainId: event.args.chainId,
			collectibleId: event.args.collectibleId,
			orderbookKind: event.args.orderbookKind,
			callbacks: event.args.callbacks,
		}),

		close: () => ({
			...initialContext,
		}),

		updatePrice: (
			context,
			event: {
				price: Price;
			},
		) => ({
			...context,
			offerPrice: event.price,
			offerPriceChanged: true,
		}),

		updateCurrency: (
			context,
			event: {
				currency: Currency;
			},
		) => ({
			...context,
			offerPrice: {
				...context.offerPrice,
				currency: event.currency,
			},
		}),

		updateQuantity: (
			context,
			event: {
				quantity: string;
			},
		) => ({
			...context,
			quantity: event.quantity,
		}),

		updateExpiry: (
			context,
			event: {
				expiry: Date;
			},
		) => ({
			...context,
			expiry: event.expiry,
		}),
	},
});

// Selectors
export const useIsOpen = () =>
	useSelector(makeOfferModalStore, (state) => state.context.isOpen);

export const useMakeOfferModalState = () => {
	return useSelector(makeOfferModalStore, (state) => state.context);
};
