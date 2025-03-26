import { useSelectPaymentModal } from '@0xsequence/kit-checkout';
import type { QueryKey } from '@tanstack/react-query';
import type { Hash, Hex } from 'viem';
import {
	type CheckoutOptions,
	type MarketplaceKind,
	StepType,
	WalletKind,
	balanceQueries,
	collectableKeys,
	getMarketplaceClient,
	getQueryClient,
} from '../../../../_internal';
import { useWallet } from '../../../../_internal/wallet/useWallet';
import { useConfig } from '../../../../hooks';
import type { ModalCallbacks } from '../../_internal/types';
import { buyModal$ } from '../store';
import { useFees } from './useFees';

interface UseBuyCollectableProps {
	chainId: string;
	collectionAddress: string;
	tokenId: string;
	callbacks?: ModalCallbacks;
	priceCurrencyAddress: string;
	setCheckoutModalIsLoading: (isLoading: boolean) => void;
	setCheckoutModalLoaded: (isLoaded: boolean) => void;
	customProviderCallback?: (args: { data: string; value: string }) => void;
}

type BuyCollectableReturn =
	| { status: 'loading'; buy: null; isLoading: true; isError: false }
	| { status: 'error'; buy: null; isLoading: false; isError: true }
	| {
			status: 'ready';
			isLoading: false;
			isError: false;
			buy: (input: {
				orderId: string;
				quantity: string;
				collectableDecimals: number;
				marketplace: MarketplaceKind;
				checkoutOptions: CheckoutOptions;
			}) => Promise<void>;
	  };

export const useBuyCollectable = ({
	chainId,
	collectionAddress,
	tokenId,
	callbacks,
	priceCurrencyAddress,
	setCheckoutModalIsLoading,
	setCheckoutModalLoaded,
	customProviderCallback,
}: UseBuyCollectableProps): BuyCollectableReturn => {
	const { openSelectPaymentModal } = useSelectPaymentModal();
	const config = useConfig();
	const marketplaceClient = getMarketplaceClient(Number(chainId), config);
	const fees = useFees({ chainId: Number(chainId), collectionAddress });
	const { wallet, isLoading, isError } = useWallet();

	if (isLoading) {
		return { status: 'loading', buy: null, isLoading, isError: false };
	}

	if (isError || !wallet) {
		return { status: 'error', buy: null, isLoading, isError: true };
	}

	const invalidateQueries = async (queriesToInvalidate: QueryKey[]) => {
		const queryClient = getQueryClient();
		for (const queryKey of queriesToInvalidate) {
			await queryClient.invalidateQueries({ queryKey });
		}
	};

	return {
		status: 'ready',
		isLoading,
		isError,
		buy: async (input) => {
			setCheckoutModalIsLoading(true);
			const { steps } = await marketplaceClient.generateBuyTransaction({
				collectionAddress,
				buyer: await wallet.address(),
				marketplace: input.marketplace,
				ordersData: [
					{
						orderId: input.orderId,
						quantity: input.quantity,
					},
				],
				additionalFees: [fees],
				walletType: WalletKind.unknown,
			});

			// these states are necessary to manage appearance of the quantity modal
			setCheckoutModalLoaded(true);
			setCheckoutModalIsLoading(false);

			const step = steps.find((step) => step.id === StepType.buy);

			if (!step) {
				throw new Error('Buy step not found');
			}
			const openSelectPaymentModalConfig = {
				chain: chainId,
				collectibles: [
					{
						tokenId: tokenId,
						quantity: input.quantity,
						decimals: input.collectableDecimals,
					},
				],
				currencyAddress: priceCurrencyAddress,
				price: step.price,
				targetContractAddress: step.to,
				txData: step.data as Hex,
				collectionAddress,
				recipientAddress: await wallet.address(),
				enableMainCurrencyPayment: true,
				enableSwapPayments: !!input.checkoutOptions.swap,
				creditCardProviders: customProviderCallback
					? ['custom']
					: input.checkoutOptions.nftCheckout || [],
				onSuccess: (hash: string) => {
					callbacks?.onSuccess?.({ hash: hash as Hash });
				},
				onError: callbacks?.onError,
				onClose: () => {
					invalidateQueries([
						collectableKeys.listings,
						collectableKeys.lowestListings,
						collectableKeys.listingsCount,
						collectableKeys.lists,
						collectableKeys.userBalances,
						balanceQueries.all,
						balanceQueries.collectionBalanceDetails,
					]);

					buyModal$.close();
				},
				...(customProviderCallback && {
					customProviderCallback: () => {
						customProviderCallback(step);
						buyModal$.close();
					},
				}),
			};

			openSelectPaymentModal(openSelectPaymentModalConfig);
		},
	};
};
