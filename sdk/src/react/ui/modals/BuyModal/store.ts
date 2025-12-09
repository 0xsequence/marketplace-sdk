import type { Step } from '@0xsequence/api-client';
import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { Address } from 'viem';
import type {
	CardType,
	CheckoutOptionsItem,
	MarketplaceKind,
} from '../../../../types';
import type { TransactionOnRampProvider } from '../../../_internal';
import type { useAnalytics } from '../../../_internal/databeat';
import { flattenAnalyticsArgs } from '../../../_internal/databeat/utils';
import type { ActionButton } from '../_internal/types';

export type CheckoutOptionsSalesContractProps = {
	chainId: number;
	salesContractAddress: Address;
	collectionAddress: Address;
	items: Array<CheckoutOptionsItem>;
};

export type PaymentModalProps = {
	tokenId: bigint;
	marketplace: MarketplaceKind;
	orderId: string;
	customCreditCardProviderCallback?: (buyStep: Step) => void;
};

export type BuyModalBaseProps = {
	chainId: number;
	skipNativeBalanceCheck?: boolean;
	nativeTokenAddress?: Address;
	customCreditCardProviderCallback?: PaymentModalProps['customCreditCardProviderCallback'];
	collectionAddress: Address;
	cardType?: CardType;
	successActionButtons?: ActionButton[];
	hideQuantitySelector?: boolean;
	onRampProvider?: TransactionOnRampProvider;
};

// Shop type modal props
export type ShopBuyModalProps = BuyModalBaseProps & {
	cardType: 'shop';
	salesContractAddress: Address;
	items: Array<Partial<CheckoutOptionsItem> & { tokenId?: bigint }>;
	quantityRemaining: bigint;
	salePrice: {
		amount: bigint;
		currencyAddress: Address;
	};
	unlimitedSupply?: boolean;
};

// Marketplace type modal props
export type MarketplaceBuyModalProps = BuyModalBaseProps & {
	cardType?: 'market';
	tokenId: bigint;
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

type SubModalState = 'idle' | 'opening' | 'open' | 'closed';

const initialContext: {
	isOpen: boolean;
	props: BuyModalProps | null;
	buyAnalyticsId: string;
	paymentModalState: SubModalState;
	quantity: number;
} = {
	isOpen: false,
	props: null,
	buyAnalyticsId: '',
	paymentModalState: 'idle',
	quantity: 1,
};

export const buyModalStore = createStore({
	context: { ...initialContext },
	on: {
		open: (
			context,
			event: {
				props: BuyModalProps;
				analyticsFn: ReturnType<typeof useAnalytics>;
			},
		) => {
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
				isOpen: true,
			};
		},

		close: (context) => ({
			...context,
			isOpen: false,
			paymentModalState: 'idle' as const,
			quantity: 1,
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

		closePaymentModal: (context) => ({
			...context,
			paymentModalState: 'closed' as const,
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

export const useBuyAnalyticsId = () =>
	useSelector(buyModalStore, (state) => state.context.buyAnalyticsId);

export const usePaymentModalState = () =>
	useSelector(buyModalStore, (state) => state.context.paymentModalState);

export const useQuantity = () =>
	useSelector(buyModalStore, (state) => state.context.quantity);
