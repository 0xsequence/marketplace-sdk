import type { CheckoutOptions } from '@0xsequence/api-client';
import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';
import type { Address, Hash } from 'viem';
import type {
	CardType,
	CheckoutOptionsItem,
	MarketplaceKind,
} from '../../../../types';
import type { TransactionOnRampProvider } from '../../../_internal';
import type { useAnalytics } from '../../../_internal/databeat';
import { flattenAnalyticsArgs } from '../../../_internal/databeat/utils';
import type { ActionButton } from '../_internal/types';

export const CheckoutMode = {
	crypto: 'crypto',
	sequenceCheckout: 'sequence-checkout',
	trails: 'trails',
} as const;

export type CheckoutModeString =
	(typeof CheckoutMode)[keyof typeof CheckoutMode];

export type CheckoutMode =
	| 'crypto'
	| 'trails'
	| 'sequence-checkout'
	| {
			mode: 'sequence-checkout';
			options: CheckoutOptions;
	  };

export function getSequenceCheckoutOptions(
	checkoutMode: CheckoutMode,
): CheckoutOptions | undefined {
	return typeof checkoutMode === 'object' ? checkoutMode.options : undefined;
}

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
};

export type BuyModalBaseProps = {
	chainId: number;
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
	quantityDecimals: number;
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

export type onSuccessCallback = ({
	hash,
	orderId,
}: {
	hash?: Hash;
	orderId?: string;
}) => void;
export type onErrorCallback = (error: Error) => void;

const initialContext: {
	isOpen: boolean;
	props: BuyModalProps | null;
	buyAnalyticsId: string;
	onError: onErrorCallback;
	onSuccess: onSuccessCallback;
	checkoutMode: CheckoutMode;
} = {
	isOpen: false,
	props: null,
	buyAnalyticsId: '',
	onError: () => {},
	onSuccess: () => {},
	checkoutMode: 'crypto',
};

export const buyModalStore = createStore({
	context: { ...initialContext },
	on: {
		open: (
			context,
			event: {
				props: BuyModalProps;
				checkoutMode?: CheckoutMode;
				onError?: onErrorCallback;
				onSuccess?: onSuccessCallback;
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
				checkoutMode: event.checkoutMode ?? context.checkoutMode,
				onError: event.onError ?? context.onError,
				onSuccess: event.onSuccess ?? context.onSuccess,
				isOpen: true,
			};
		},

		close: (context) => ({
			...context,
			isOpen: false,
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

export const useBuyAnalyticsId = () =>
	useSelector(buyModalStore, (state) => state.context.buyAnalyticsId);

export const useCheckoutMode = () =>
	useSelector(buyModalStore, (state) => state.context.checkoutMode);
