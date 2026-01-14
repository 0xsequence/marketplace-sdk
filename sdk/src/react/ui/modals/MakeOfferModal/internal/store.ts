import type { Address } from '@0xsequence/api-client';
import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import { useMarketplaceConfig } from '../../../hooks';

export type OpenMakeOfferModalArgs = {
	collectionAddress: Address;
	chainId: number;
	tokenId: bigint;
};

type MakeOfferModalState = OpenMakeOfferModalArgs & {
	isOpen: boolean;
	priceInput: string;
	currencyAddress?: Address;
	quantityInput: string;
	expiryDays: number;
	isPriceTouched: boolean;
	isQuantityTouched: boolean;
};

const initialContext: MakeOfferModalState = {
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

export const makeOfferModalStore = createStore({
	context: { ...initialContext },
	on: {
		open: (_context, event: OpenMakeOfferModalArgs) => ({
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

export const useMakeOfferModal = () => {
	const state = useSelector(makeOfferModalStore, (state) => state.context);

	return {
		...state,
		show: (args: OpenMakeOfferModalArgs) =>
			makeOfferModalStore.send({ type: 'open', ...args }),
		close: () => makeOfferModalStore.send({ type: 'close' }),
	};
};

export const useMakeOfferModalState = () => {
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
	} = useSelector(makeOfferModalStore, (state) => state.context);

	const { data: marketplaceConfig } = useMarketplaceConfig();
	const orderbookKind = marketplaceConfig?.market.collections.find(
		(collection) => collection.itemsAddress === collectionAddress,
	)?.destinationMarketplace;

	const closeModal = () => makeOfferModalStore.send({ type: 'close' });
	const updatePriceInput = (value: string) =>
		makeOfferModalStore.send({ type: 'updatePrice', value });
	const touchPriceInput = () =>
		makeOfferModalStore.send({ type: 'touchPrice' });
	const updateCurrency = (address: Address) =>
		makeOfferModalStore.send({ type: 'selectCurrency', address });
	const updateQuantityInput = (value: string) =>
		makeOfferModalStore.send({ type: 'updateQuantity', value });
	const touchQuantityInput = () =>
		makeOfferModalStore.send({ type: 'touchQuantity' });
	const updateExpiryDays = (days: number) =>
		makeOfferModalStore.send({ type: 'updateExpiryDays', days });

	return {
		isOpen,
		tokenId,
		collectionAddress,
		chainId,
		orderbookKind,
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
