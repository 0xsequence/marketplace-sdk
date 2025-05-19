import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { Address, Hash } from 'viem';
import type {
	CheckoutOptionsItem,
	MarketplaceKind,
	Step,
} from '../../../_internal';

export type CheckoutOptionsSalesContractProps = {
	chainId: number;
	salesContractAddress: Address;
	collectionAddress: Address;
	items: Array<CheckoutOptionsItem>;
	customProviderCallback?: (
		onSuccess: (txHash: string) => void,
		onError: (error: Error) => void,
		onClose: () => void,
	) => void;
};

export type PaymentModalProps = {
	collectibleId: string;
	marketplace: MarketplaceKind;
	orderId: string;
	customCreditCardProviderCallback?: (buyStep: Step) => void;
};

export type BuyModalBaseProps = {
	chainId: number;
	collectionAddress: Address;
	skipNativeBalanceCheck?: boolean;
	nativeTokenAddress?: Address;
	salesType: 'primary' | 'secondary';
	customCreditCardProviderCallback?: PaymentModalProps['customCreditCardProviderCallback'];
	quantityDecimals: number;
	quantityRemaining: string;
};

export type BasePrimaryBuyModalProps = BuyModalBaseProps & {
	salesType: 'primary';
	salesContractAddress: Address;
	salePrice: {
		amount: string;
		currencyAddress: Address;
	};
};

export type Primary1155BuyModalProps = BasePrimaryBuyModalProps & {
	collectionType: 'erc1155';
	items: Array<CheckoutOptionsItem>;
};

export type Primary721BuyModalProps = BasePrimaryBuyModalProps & {
	collectionType: 'erc721';
	numberOfItems: number;
};

export type PrimaryBuyModalProps =
	| Primary1155BuyModalProps
	| Primary721BuyModalProps;

export type SecondaryBuyModalProps = BuyModalBaseProps & {
	salesType: 'secondary';
	collectibleId: string;
	marketplace: MarketplaceKind;
	orderId: string;
};

export type BuyModalProps = PrimaryBuyModalProps | SecondaryBuyModalProps;

export type onSuccessCallback = ({
	hash,
	orderId,
}: {
	hash?: Hash;
	orderId?: string;
}) => void;
export type onErrorCallback = (error: Error) => void;

const initialContext = {
	isOpen: false,
	props: null as unknown as BuyModalProps,
	onError: (() => {}) as onErrorCallback,
	onSuccess: (() => {}) as onSuccessCallback,
	quantity: undefined as number | undefined,
};

export const buyModalStore = createStore({
	context: { ...initialContext },
	on: {
		open: (
			context,
			event: {
				props: BuyModalProps;
				onError?: onErrorCallback;
				onSuccess?: onSuccessCallback;
			},
		) => ({
			...context,
			props: event.props,
			onError: event.onError ?? context.onError,
			onSuccess: event.onSuccess ?? context.onSuccess,
			isOpen: true,
		}),

		close: (context) => ({
			...context,
			isOpen: false,
			quantity: undefined,
		}),

		setQuantity: (context, event: { quantity: number }) => ({
			...context,
			quantity: event.quantity,
		}),
	},
});

export const useIsOpen = () =>
	useSelector(buyModalStore, (state) => state.context.isOpen);

export const useBuyModalProps = () =>
	useSelector(buyModalStore, (state) => state.context.props);

export const useOnError = () =>
	useSelector(buyModalStore, (state) => state.context.onError);

export const useOnSuccess = () =>
	useSelector(buyModalStore, (state) => state.context.onSuccess);

export const useQuantity = () =>
	useSelector(buyModalStore, (state) => state.context.quantity);
