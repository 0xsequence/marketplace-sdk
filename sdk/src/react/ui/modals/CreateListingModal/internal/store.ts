import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { Address } from 'viem';

export type OpenCreateListingModalArgs = {
	collectionAddress: Address;
	chainId: number;
	tokenId: bigint;
};

type CreateListingModalState = OpenCreateListingModalArgs & {
	isOpen: boolean;
	priceInput: string;
	currencyAddress?: Address;
	quantityInput: string;
	expiryDays: number;
	isPriceTouched: boolean;
	isQuantityTouched: boolean;
};

const initialContext: CreateListingModalState = {
	isOpen: false,
	collectionAddress: '' as Address,
	chainId: 0,
	tokenId: 0n,
	priceInput: '',
	currencyAddress: undefined,
	quantityInput: '1',
	expiryDays: 7,
	isPriceTouched: false,
	isQuantityTouched: false,
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
			isPriceTouched: false,
			isQuantityTouched: false,
		}),
		close: () => ({ ...initialContext }),

		updatePrice: (context, event: { value: string }) => {
			const isBlurNormalization =
				context.priceInput === '' && event.value === '0';
			const valueChanged = context.priceInput !== event.value;
			const shouldMarkTouched = valueChanged && !isBlurNormalization;

			return {
				...context,
				priceInput: event.value,
				isPriceTouched: shouldMarkTouched ? true : context.isPriceTouched,
			};
		},
		touchPrice: (context) => ({
			...context,
			isPriceTouched: true,
		}),
		selectCurrency: (context, event: { address: Address }) => ({
			...context,
			currencyAddress: event.address,
		}),
		updateQuantity: (context, event: { value: string }) => ({
			...context,
			quantityInput: event.value,
			isQuantityTouched: true,
		}),
		touchQuantity: (context) => ({
			...context,
			isQuantityTouched: true,
		}),
		updateExpiryDays: (context, event: { days: number }) => ({
			...context,
			expiryDays: event.days,
		}),
	},
});

export const useCreateListingModal = () => {
	const state = useSelector(createListingModalStore, (state) => state.context);

	return {
		...state,
		show: (args: OpenCreateListingModalArgs) =>
			createListingModalStore.send({ type: 'open', ...args }),
		close: () => createListingModalStore.send({ type: 'close' }),
	};
};

export const useCreateListingModalState = () => {
	const {
		isOpen,
		tokenId,
		collectionAddress,
		chainId,
		priceInput,
		currencyAddress,
		quantityInput,
		expiryDays,
		isPriceTouched,
		isQuantityTouched,
	} = useSelector(createListingModalStore, (state) => state.context);

	const closeModal = () => createListingModalStore.send({ type: 'close' });
	const updatePriceInput = (value: string) =>
		createListingModalStore.send({ type: 'updatePrice', value });
	const touchPriceInput = () =>
		createListingModalStore.send({ type: 'touchPrice' });
	const updateCurrency = (address: Address) =>
		createListingModalStore.send({ type: 'selectCurrency', address });
	const updateQuantityInput = (value: string) =>
		createListingModalStore.send({ type: 'updateQuantity', value });
	const touchQuantityInput = () =>
		createListingModalStore.send({ type: 'touchQuantity' });
	const updateExpiryDays = (days: number) =>
		createListingModalStore.send({ type: 'updateExpiryDays', days });

	return {
		isOpen,
		tokenId,
		collectionAddress,
		chainId,
		priceInput,
		currencyAddress,
		quantityInput,
		expiryDays,
		isPriceTouched,
		isQuantityTouched,
		closeModal,
		updatePriceInput,
		touchPriceInput,
		updateCurrency,
		updateQuantityInput,
		touchQuantityInput,
		updateExpiryDays,
	};
};
