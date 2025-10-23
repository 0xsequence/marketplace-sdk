import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { Address, Hash } from 'viem';
import type { CardType } from '../../../../types';
import type {
	CheckoutOptionsItem,
	MarketplaceKind,
	Step,
} from '../../../_internal';
import type { useAnalytics } from '../../../_internal/databeat';
import { flattenAnalyticsArgs } from '../../../_internal/databeat/utils';
import type { ActionButton } from '../_internal/types';

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
	cardType?: CardType;
	customCreditCardProviderCallback?: PaymentModalProps['customCreditCardProviderCallback'];
	successActionButtons?: ActionButton[];
	hideQuantitySelector?: boolean;
};

// Shop type modal props
export type ShopBuyModalProps = BuyModalBaseProps & {
	cardType: 'shop';
	salesContractAddress: Address;
	items: Array<Partial<CheckoutOptionsItem> & { tokenId?: string }>;
	quantityDecimals: number;
	quantityRemaining: number;
	salePrice: {
		amount: string;
		currencyAddress: Address;
	};
	unlimitedSupply?: boolean;
};

// Marketplace type modal props
export type MarketplaceBuyModalProps = BuyModalBaseProps & {
	cardType?: 'market';
	collectibleId: string;
	marketplace: MarketplaceKind;
	orderId: string;
};

export type BuyModalProps = ShopBuyModalProps | MarketplaceBuyModalProps;

// Type guard functions
export function isShopProps(props: BuyModalProps): props is ShopBuyModalProps {
	return props.cardType === 'shop';
}

export function isMarketProps(
	props: BuyModalProps,
): props is MarketplaceBuyModalProps {
	// Default to MARKET type for backward compatibility
	return !props.cardType || props.cardType === 'market';
}

export type onSuccessCallback = ({
	hash,
	orderId,
}: {
	hash?: Hash;
	orderId?: string;
}) => void;
export type onErrorCallback = (error: Error) => void;

type ModalState = 'idle' | 'opening' | 'open' | 'processing' | 'closing';
type SubModalState = 'idle' | 'opening' | 'open' | 'closed';

const initialContext = {
	isOpen: false,
	props: null as BuyModalProps | null,
	buyAnalyticsId: '',
	onError: (() => {}) as onErrorCallback,
	onSuccess: (() => {}) as onSuccessCallback,
	quantity: null as number | null,
	modalState: 'idle' as ModalState,
	paymentModalState: 'idle' as SubModalState,
	checkoutModalState: 'idle' as SubModalState,
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
				analyticsFn: ReturnType<typeof useAnalytics>;
			},
		) => {
			// Prevent duplicate opens
			if (context.modalState !== 'idle') {
				return context;
			}
			const buyAnalyticsId = crypto.randomUUID();

			const { analyticsProps, analyticsNums } = flattenAnalyticsArgs(
				event.props,
			);

			event.analyticsFn.trackBuyModalOpened({
				props: {
					buyAnalyticsId,
					collectionAddress: event.props.collectionAddress,
					...analyticsProps,
				},
				nums: {
					chainId: event.props.chainId,
					...analyticsNums,
				},
			});
			return {
				...context,
				props: event.props,
				buyAnalyticsId,
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
			quantity: null,
			modalState: 'idle' as const,
			paymentModalState: 'idle' as const,
			checkoutModalState: 'idle' as const,
		}),

		setQuantity: (context, event: { quantity: number }) => ({
			...context,
			quantity: event.quantity,
		}),

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
			paymentModalState: 'open' as const,
		}),

		paymentModalClosed: (context) => ({
			...context,
			paymentModalState: 'closed' as const,
		}),

		openCheckoutModal: (context) => {
			if (context.checkoutModalState !== 'idle') {
				return context;
			}
			return {
				...context,
				checkoutModalState: 'opening' as const,
			};
		},

		checkoutModalOpened: (context) => ({
			...context,
			checkoutModalState: 'open' as const,
		}),

		checkoutModalClosed: (context) => ({
			...context,
			checkoutModalState: 'closed' as const,
		}),
	},
});

export const useIsOpen = () =>
	useSelector(buyModalStore, (state) => state.context.isOpen);

export const useBuyModalProps = () => {
	const props = useSelector(buyModalStore, (state) => state.context.props);
	if (!props) {
		throw new Error(
			'BuyModal props not initialized. Make sure to call show() first.',
		);
	}
	return props;
};

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

export const useBuyAnalyticsId = () =>
	useSelector(buyModalStore, (state) => state.context.buyAnalyticsId);
