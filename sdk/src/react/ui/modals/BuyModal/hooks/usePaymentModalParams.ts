import type { SelectPaymentSettings } from '@0xsequence/checkout';
import type { TokenMetadata } from '@0xsequence/marketplace-api';
import { skipToken, useQuery } from '@tanstack/react-query';
import type { Address, Hash, Hex } from 'viem';
import type { CheckoutOptions, SdkConfig } from '../../../../../types';
import { decodeERC20Approval } from '../../../../../utils/decode/erc20';
import {
	type AdditionalFee,
	getMarketplaceClient,
	getQueryClient,
	getSequenceApiClient,
	type MarketplaceKind,
	type Step,
	StepType,
	type TransactionOnRampProvider,
	WalletKind,
} from '../../../../_internal';
import { useConfig } from '../../../../hooks';
import type { ModalCallbacks } from '../../_internal/types';
import {
	buyModalStore,
	isMarketProps,
	useBuyAnalyticsId,
	useBuyModalProps,
	useOnError,
	useOnSuccess,
} from '../store';
import { useMarketPlatformFee } from './useMarketPlatformFee';

interface GetBuyCollectableParams {
	chainId: number;
	config: SdkConfig;
	address: Address;
	collectionAddress: string;
	collectibleId: bigint;
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
	buyAnalyticsId: string;
	onRampProvider: TransactionOnRampProvider | undefined;
}

export const getBuyCollectableParams = async ({
	chainId,
	collectionAddress,
	collectibleId,
	callbacks,
	priceCurrencyAddress,
	customCreditCardProviderCallback,
	config,
	address,
	marketplace,
	orderId,
	quantity,
	collectable,
	checkoutOptions,
	fee,
	skipNativeBalanceCheck,
	nativeTokenAddress,
	buyAnalyticsId,
	onRampProvider,
}: GetBuyCollectableParams) => {
	const marketplaceClient = getMarketplaceClient(config);
	const { steps } = await marketplaceClient.generateBuyTransaction({
		chainId,
		collectionAddress,
		buyer: address,
		marketplace,
		ordersData: [
			{
				orderId,
				quantity: BigInt(quantity),
				tokenId: BigInt(collectibleId),
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
				// Checkout library expects string for tokenId
				tokenId: collectibleId.toString(),
				// Checkout library expects string for quantity display
				quantity: quantity.toString(),
				decimals: collectable.decimals,
			},
		],
		currencyAddress: priceCurrencyAddress,
		price: buyStep.price.toString(),
		targetContractAddress: buyStep.to,
		approvedSpenderAddress,
		txData: buyStep.data as Hex,
		collectionAddress,
		recipientAddress: address,
		creditCardProviders,
		onSuccess: (txHash?: string) => {
			if (txHash) {
				callbacks?.onSuccess?.({ hash: txHash as Hash });
			}
		},
		supplementaryAnalyticsInfo: {
			requestId: orderId,
			marketplaceKind: marketplace,
			buyAnalyticsId,
			marketplaceType: 'market',
		},
		onError: callbacks?.onError,
		onClose: () => {
			const queryClient = getQueryClient();
			queryClient.invalidateQueries({
				predicate: (query) => !query.meta?.persistent,
			});
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
		onRampProvider,
		successActionButtons: callbacks?.successActionButtons,
	} satisfies SelectPaymentSettings;
};

interface usePaymentModalParams {
	address: Address | undefined;
	quantity: number | undefined;
	marketplace: MarketplaceKind | undefined;
	collectable: TokenMetadata | undefined;
	checkoutOptions: CheckoutOptions | undefined;
	priceCurrencyAddress: string | undefined;
	enabled: boolean;
}

export const usePaymentModalParams = (args: usePaymentModalParams) => {
	const {
		address,
		marketplace,
		collectable,
		checkoutOptions,
		priceCurrencyAddress,
		quantity,
		enabled,
	} = args;

	const buyModalProps = useBuyModalProps();
	const {
		chainId,
		collectionAddress,
		skipNativeBalanceCheck,
		nativeTokenAddress,
		onRampProvider,
	} = buyModalProps;

	// Extract Marketplace-specific properties using type guard
	const collectibleId = isMarketProps(buyModalProps)
		? buyModalProps.collectibleId
		: 0n;
	const orderId = isMarketProps(buyModalProps) ? buyModalProps.orderId : '';
	const customCreditCardProviderCallback = isMarketProps(buyModalProps)
		? buyModalProps.customCreditCardProviderCallback
		: undefined;

	const config = useConfig();
	const fee = useMarketPlatformFee(
		isMarketProps(buyModalProps)
			? {
					chainId,
					collectionAddress,
				}
			: skipToken,
	);
	const onSuccess = useOnSuccess();
	const onError = useOnError();
	const buyAnalyticsId = useBuyAnalyticsId();

	const queryEnabled =
		!!address &&
		!!marketplace &&
		!!collectable &&
		!!checkoutOptions &&
		!!priceCurrencyAddress &&
		!!quantity &&
		enabled;

	return useQuery({
		queryKey: ['buyCollectableParams', buyModalProps, args, fee],
		queryFn: queryEnabled
			? () =>
					getBuyCollectableParams({
						chainId,
						config,
						address,
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
							onSuccess,
							onError,
							successActionButtons: buyModalProps.successActionButtons,
						},
						customCreditCardProviderCallback,
						skipNativeBalanceCheck,
						nativeTokenAddress,
						buyAnalyticsId,
						onRampProvider,
					})
			: skipToken,
		retry: false,
	});
};
