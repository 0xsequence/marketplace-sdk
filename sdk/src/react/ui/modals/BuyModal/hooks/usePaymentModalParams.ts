import type { SelectPaymentSettings } from '@0xsequence/checkout';
import type { TokenMetadata } from '@0xsequence/metadata';
import { skipToken, useQuery } from '@tanstack/react-query';
import type { Hash, Hex } from 'viem';
import type { SdkConfig, Step } from '../../../../..';
import { decodeERC20Approval } from '../../../../../utils/decode/erc20';
import {
	type AdditionalFee,
	type CheckoutOptions,
	type MarketplaceKind,
	StepType,
	WalletKind,
	getMarketplaceClient,
	getQueryClient,
	getSequenceApiClient,
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
	collectable: TokenMetadata;
	checkoutOptions: CheckoutOptions;
	fee: AdditionalFee;
	callbacks: ModalCallbacks | undefined;
	priceCurrencyAddress: string;
	customCreditCardProviderCallback: ((buyStep: Step) => void) | undefined;
	skipNativeBalanceCheck: boolean | undefined;
	nativeTokenAddress: string | undefined;
}

export const getBuyCollectableParams = async ({
	chainId,
	collectionAddress,
	collectibleId,
	callbacks,
	priceCurrencyAddress,
	customCreditCardProviderCallback,
	config,
	wallet,
	marketplace,
	orderId,
	quantity,
	collectable,
	checkoutOptions,
	fee,
	skipNativeBalanceCheck,
	nativeTokenAddress,
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

	const creditCardProviders = customCreditCardProviderCallback
		? ['custom']
		: checkoutOptions.nftCheckout || [];

	const isTransakSupported = creditCardProviders.includes('transak');

	let transakContractId: string | undefined;

	if (isTransakSupported) {
		const sequenceApiClient = getSequenceApiClient(config);
		const transakContractIdResponse =
			await sequenceApiClient.checkoutOptionsGetTransakContractID({
				chainId,
				contractAddress: buyStep.to,
			});

		if (transakContractIdResponse.contractId !== '') {
			transakContractId = transakContractIdResponse.contractId;
		}
	}

	return {
		chain: chainId,
		collectibles: [
			{
				tokenId: collectibleId,
				quantity: quantity.toString(),
				decimals: collectable.decimals,
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
		creditCardProviders,
		onSuccess: (hash: string) => {
			callbacks?.onSuccess?.({ hash: hash as Hash });
		},
		supplementaryAnalyticsInfo: {
			requestId: orderId,
			marketplaceKind: marketplace,
		},
		onError: callbacks?.onError,
		onClose: () => {
			const queryClient = getQueryClient();
			queryClient.invalidateQueries();
			buyModalStore.send({ type: 'close' });
		},
		skipNativeBalanceCheck,
		nativeTokenAddress,
		...(customCreditCardProviderCallback && {
			customProviderCallback: () => {
				customCreditCardProviderCallback(buyStep);
				buyModalStore.send({ type: 'close' });
			},
		}),
		...(transakContractId && {
			transakConfig: {
				contractId: transakContractId,
			},
		}),
	} satisfies SelectPaymentSettings;
};

interface usePaymentModalParams {
	wallet: WalletInstance | undefined | null;
	quantity: number | undefined;
	marketplace: MarketplaceKind | undefined;
	collectable: TokenMetadata | undefined;
	checkoutOptions: CheckoutOptions | undefined;
	priceCurrencyAddress: string | undefined;
}

export const usePaymentModalParams = (args: usePaymentModalParams) => {
	const {
		wallet,
		marketplace,
		collectable,
		checkoutOptions,
		priceCurrencyAddress,
		quantity,
	} = args;

	const buyModalProps = useBuyModalProps();
	const {
		chainId,
		collectionAddress,
		collectibleId,
		orderId,
		customCreditCardProviderCallback,
		skipNativeBalanceCheck,
		nativeTokenAddress,
	} = buyModalProps;

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
		!!collectable &&
		!!checkoutOptions &&
		!!priceCurrencyAddress &&
		!!quantity;

	return useQuery({
		queryKey: ['buyCollectableParams', buyModalProps, args, fee],
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
						collectable,
						checkoutOptions,
						fee,
						priceCurrencyAddress,
						callbacks: {
							onSuccess: onSuccess,
							onError: onError,
						},
						customCreditCardProviderCallback,
						skipNativeBalanceCheck,
						nativeTokenAddress,
					})
			: skipToken,
	});
};
