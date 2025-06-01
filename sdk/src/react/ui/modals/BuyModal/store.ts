import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { Address, Hash } from 'viem';
import type { MarketplaceType } from '../../../../types';
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
	marketplaceType: MarketplaceType;
	quantityDecimals: number;
	quantityRemaining: number;
};

// Shop type modal props
export type ShopBuyModalProps = BuyModalBaseProps & {
	marketplaceType: 'shop';
	salesContractAddress: Address;
	items: Array<Partial<CheckoutOptionsItem> & { tokenId?: string }>;
	customProviderCallback?: CheckoutOptionsSalesContractProps['customProviderCallback'];
	salePrice: {
		amount: string;
		currencyAddress: Address;
	};
};

// Marketplace type modal props
export type MarketplaceBuyModalProps = BuyModalBaseProps & {
	marketplaceType: 'market';
	collectibleId: string;
	marketplace: MarketplaceKind;
	orderId: string;
	customCreditCardProviderCallback?: PaymentModalProps['customCreditCardProviderCallback'];
};

// Union type for either shop or marketplace
export type BuyModalProps = ShopBuyModalProps | MarketplaceBuyModalProps;

// Type guard functions
export function isShopProps(props: BuyModalProps): props is ShopBuyModalProps {
	return props.marketplaceType === 'shop';
}

export function isMarketProps(
	props: BuyModalProps,
): props is MarketplaceBuyModalProps {
	return props.marketplaceType === 'market';
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
	// Add state to prevent race conditions
	modalState: 'idle' as 'idle' | 'opening' | 'open' | 'processing' | 'closing',
	paymentModalState: 'idle' as 'idle' | 'opening' | 'opened' | 'closed',
	checkoutModalState: 'idle' as 'idle' | 'opening' | 'opened' | 'closed',
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
		) => {
			// Prevent duplicate opens
			if (context.modalState !== 'idle') {
				return context;
			}
			return {
				...context,
				props: event.props,
				onError: event.onError ?? context.onError,
				onSuccess: event.onSuccess ?? context.onSuccess,
				isOpen: true,
				modalState: 'opening' as const,
			};
		},

		modalOpened: (context) => ({
			...context,
			modalState: 'open' as const,
		}),

		close: (context) => ({
			...context,
			isOpen: false,
			quantity: undefined,
			modalState: 'idle' as const,
			paymentModalState: 'idle' as const,
			checkoutModalState: 'idle' as const,
		}),

		setQuantity: (context, event: { quantity: number }) => ({
			...context,
			quantity: event.quantity,
		}),

		// Payment modal state management
		openPaymentModal: (context) => {
			if (context.paymentModalState !== 'idle') {
				return context; // Prevent duplicate opens
			}
			return {
				...context,
				paymentModalState: 'opening' as const,
			};
		},

		paymentModalOpened: (context) => ({
			...context,
			paymentModalState: 'opened' as const,
		}),

		paymentModalClosed: (context) => ({
			...context,
			paymentModalState: 'closed' as const,
		}),

		// Checkout modal state management
		openCheckoutModal: (context) => {
			if (context.checkoutModalState !== 'idle') {
				return context; // Prevent duplicate opens
			}
			return {
				...context,
				checkoutModalState: 'opening' as const,
			};
		},

		checkoutModalOpened: (context) => ({
			...context,
			checkoutModalState: 'opened' as const,
		}),

		checkoutModalClosed: (context) => ({
			...context,
			checkoutModalState: 'closed' as const,
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

export const useModalState = () =>
	useSelector(buyModalStore, (state) => state.context.modalState);

export const usePaymentModalState = () =>
	useSelector(buyModalStore, (state) => state.context.paymentModalState);

export const useCheckoutModalState = () =>
	useSelector(buyModalStore, (state) => state.context.checkoutModalState);
