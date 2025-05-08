import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { Address, Hash } from 'viem';
import type {
	CheckoutOptionsItem,
	MarketplaceKind,
	Step,
} from '../../../_internal';
import { MarketplaceType } from '../../../_internal';

export type CheckoutOptionsSalesContractProps = {
	chainId: number;
	salesContractAddress: Address;
	collectionAddress: Address;
	items: Array<CheckoutOptionsItem>;
	accountAddress: Address;
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
	marketplaceType: MarketplaceType;
};

// Shop type modal props
export type ShopBuyModalProps = BuyModalBaseProps & {
	marketplaceType: MarketplaceType.SHOP;
	salesContractAddress: Address;
	items: Array<CheckoutOptionsItem>;
	customProviderCallback?: CheckoutOptionsSalesContractProps['customProviderCallback'];
};

// Marketplace type modal props
export type MarketplaceBuyModalProps = BuyModalBaseProps & {
	marketplaceType: MarketplaceType.MARKET;
	collectibleId: string;
	marketplace: MarketplaceKind;
	orderId: string;
	customCreditCardProviderCallback?: PaymentModalProps['customCreditCardProviderCallback'];
};

// Union type for either shop or marketplace
export type BuyModalProps = ShopBuyModalProps | MarketplaceBuyModalProps;

// Type guard functions
export function isShopProps(props: BuyModalProps): props is ShopBuyModalProps {
	return props.marketplaceType === MarketplaceType.SHOP;
}

export function isMarketplaceProps(
	props: BuyModalProps,
): props is MarketplaceBuyModalProps {
	return props.marketplaceType === MarketplaceType.MARKET;
}

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
