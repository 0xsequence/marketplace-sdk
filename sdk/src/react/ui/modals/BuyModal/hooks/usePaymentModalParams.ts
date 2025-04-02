import type { SelectPaymentSettings } from '@0xsequence/checkout';
import { skipToken, useQuery } from '@tanstack/react-query';
import type { Hash, Hex } from 'viem';
import type { SdkConfig } from '../../../../..';
import { decodeERC20Approval } from '../../../../../utils/decode/erc20';
import {
	type AdditionalFee,
	type CheckoutOptions,
	type MarketplaceKind,
	StepType,
	WalletKind,
	getMarketplaceClient,
	getQueryClient,
} from '../../../../_internal';
import type { WalletInstance } from '../../../../_internal/wallet/wallet';
import { useConfig } from '../../../../hooks';
import type { ModalCallbacks } from '../../_internal/types';
import {
	buyModalStore,
	useBuyModalProps,
	useOnError,
	useOnSuccess,
} from '../store';
import { useFees } from './useFees';

interface GetBuyCollectableParams {
	chainId: number;
	config: SdkConfig;
	wallet: WalletInstance;
	collectionAddress: string;
	collectibleId: string;
	marketplace: MarketplaceKind;
	orderId: string;
	quantity: number;
	collectableDecimals: number;
	checkoutOptions: CheckoutOptions;
	fee: AdditionalFee;
	callbacks?: ModalCallbacks;
	priceCurrencyAddress: string;
	customProviderCallback?: (args: { data: string; value: string }) => void;
}

export const getBuyCollectableParams = async ({
	chainId,
	collectionAddress,
	collectibleId,
	callbacks,
	priceCurrencyAddress,
	customProviderCallback,
	config,
	wallet,
	marketplace,
	orderId,
	quantity,
	collectableDecimals,
	checkoutOptions,
	fee,
}: GetBuyCollectableParams) => {
	const marketplaceClient = getMarketplaceClient(chainId, config);
	const { steps } = await marketplaceClient.generateBuyTransaction({
		collectionAddress,
		buyer: await wallet.address(),
		marketplace: marketplace,
		ordersData: [
			{
				orderId: orderId,
				quantity: quantity.toString(),
				tokenId: collectibleId,
			},
		],
		additionalFees: [fee],
		walletType: WalletKind.unknown,
	});

	const buyStep = steps.find((step) => step.id === StepType.buy);
	const approveStep = steps.find((step) => step.id === StepType.tokenApproval);

	const approvedSpenderAddress = approveStep
		? decodeERC20Approval(approveStep.data as Hex).spender
		: undefined;

	if (!buyStep) {
		throw new Error('Buy step not found');
	}

	return {
		chain: chainId,
		collectibles: [
			{
				tokenId: collectibleId,
				quantity: quantity.toString(),
				decimals: collectableDecimals,
			},
		],
		currencyAddress: priceCurrencyAddress,
		price: buyStep.price,
		targetContractAddress: buyStep.to,
		approvedSpenderAddress,
		txData: buyStep.data as Hex,
		collectionAddress,
		recipientAddress: await wallet.address(),
		enableMainCurrencyPayment: true,
		enableSwapPayments: !!checkoutOptions.swap,
		creditCardProviders: customProviderCallback
			? ['custom']
			: checkoutOptions.nftCheckout || [],
		onSuccess: (hash: string) => {
			callbacks?.onSuccess?.({ hash: hash as Hash });
		},
		supplementaryAnalyticsInfo: {
			orderId: orderId,
			marketplaceKind: marketplace,
		},
		onError: callbacks?.onError,
		onClose: () => {
			const queryClient = getQueryClient();
			queryClient.invalidateQueries();
			buyModalStore.send({ type: 'close' });
		},
		...(customProviderCallback && {
			customProviderCallback: () => {
				customProviderCallback(buyStep);
				buyModalStore.send({ type: 'close' });
			},
		}),
	} satisfies SelectPaymentSettings;
};

interface usePaymentModalParams {
	wallet: WalletInstance | undefined | null;
	quantity: number | undefined;
	marketplace: MarketplaceKind | undefined;
	collectableDecimals: number | undefined;
	checkoutOptions: CheckoutOptions | undefined;
	priceCurrencyAddress: string | undefined;
	customProviderCallback?: (args: { data: string; value: string }) => void;
}

export const usePaymentModalParams = (args: usePaymentModalParams) => {
	const {
		wallet,
		marketplace,
		collectableDecimals,
		checkoutOptions,
		priceCurrencyAddress,
		customProviderCallback,
		quantity,
	} = args;

	const { chainId, collectionAddress, collectibleId, orderId } =
		useBuyModalProps();
	const config = useConfig();
	const fee = useFees({
		chainId,
		collectionAddress,
	});
	const onSuccess = useOnSuccess();
	const onError = useOnError();

	const enabled =
		!!wallet &&
		!!marketplace &&
		!!collectableDecimals &&
		!!checkoutOptions &&
		!!priceCurrencyAddress &&
		!!quantity;

	return useQuery({
		queryKey: ['buyCollectableParams', args, quantity, fee],
		queryFn: enabled
			? () =>
					getBuyCollectableParams({
						chainId,
						config,
						wallet,
						collectionAddress,
						collectibleId,
						marketplace,
						orderId,
						quantity,
						collectableDecimals,
						checkoutOptions,
						fee,
						priceCurrencyAddress,
						callbacks: {
							onSuccess: onSuccess,
							onError: onError,
						},
						customProviderCallback,
					})
			: skipToken,
	});
};
