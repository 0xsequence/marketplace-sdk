import { useSelectPaymentModal } from '@0xsequence/kit-checkout';
import type { Hash, Hex } from 'viem';
import type { ModalCallbacks } from '../../_internal/types';
import {
	balanceQueries,
	type CheckoutOptions,
	collectableKeys,
	getMarketplaceClient,
	getQueryClient,
	type MarketplaceKind,
	WalletKind,
} from '../../../../_internal';
import { buyModal$ } from '../store';
import { useFees } from './useFees';
import { useConfig } from '../../../../hooks';
import { useWallet } from '../../../../_internal/wallet/useWallet';

interface UseBuyCollectableProps {
	chainId: string;
	collectionAddress: string;
	tokenId: string;
	callbacks?: ModalCallbacks;
	priceCurrencyAddress: string;
	setCheckoutModalIsLoading: (isLoading: boolean) => void;
	setCheckoutModalLoaded: (isLoaded: boolean) => void;
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

			const step = steps[0];

			openSelectPaymentModal({
				chain: chainId,
				collectibles: [
					{
						tokenId: tokenId,
						quantity: input.quantity,
						decimals: input.collectableDecimals,
					},
				],
				currencyAddress: priceCurrencyAddress,
				price: step.value,
				targetContractAddress: step.to,
				txData: step.data as Hex,
				collectionAddress,
				recipientAddress: await wallet.address(),
				enableMainCurrencyPayment: true,
				enableSwapPayments: !!input.checkoutOptions.swap,
				creditCardProviders: input.checkoutOptions.nftCheckout || [],
				onSuccess: (hash: string) => {
					invalidateQueries([
						collectableKeys.listings,
						collectableKeys.listingsCount,
						collectableKeys.lists,
						collectableKeys.userBalances,
						balanceQueries.all,
					]);
					callbacks?.onSuccess?.({ hash: hash as Hash });
				},
				onError: callbacks?.onError,
				onClose: () => {
					buyModal$.close();
				},
			});
		},
	};
};
