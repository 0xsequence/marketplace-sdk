import type { Step, TokenMetadata } from '@0xsequence/api-client';
import type {
	SelectPaymentSettings,
	TransactionOnRampProvider,
} from '@0xsequence/checkout';
import { skipToken, useQuery } from '@tanstack/react-query';
import type { Address, Hash, Hex } from 'viem';
import {
	StepType,
	WalletKind,
} from '../../../../../../../../../api/src/adapters/marketplace/marketplace.gen';
import type {
	AdditionalFee,
	MarketplaceKind,
	SdkConfig,
} from '../../../../../../../types';
import { decodeERC20Approval } from '../../../../../../../utils/decode/erc20';
import {
	getMarketplaceClient,
	getQueryClient,
} from '../../../../../../_internal';
import { useConfig } from '../../../../../hooks';
import type { ModalCallbacks } from '../../../../_internal/types';
import { useMarketPlatformFee } from '../../../hooks/useMarketPlatformFee';
import { useBuyModalContext } from '../../../internal/buyModalContext';
import {
	buyModalStore,
	getSequenceCheckoutOptions,
	isMarketProps,
	useBuyAnalyticsId,
	useBuyModalProps,
	useOnError,
	useOnSuccess,
} from '../../../store';

interface GetBuyCollectableParams {
	chainId: number;
	config: SdkConfig;
	address: Address;
	collectionAddress: string;
	tokenId: bigint | undefined;
	marketplace: MarketplaceKind;
	orderId: string;
	quantity: number;
	collectable: TokenMetadata;
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
	tokenId,
	callbacks,
	priceCurrencyAddress,
	customCreditCardProviderCallback,
	config,
	address,
	marketplace,
	orderId,
	quantity,
	collectable,
	fee,
	skipNativeBalanceCheck,
	nativeTokenAddress,
	buyAnalyticsId,
	onRampProvider,
}: GetBuyCollectableParams) => {
	const marketplaceClient = getMarketplaceClient(config);
	const { checkoutMode } = useBuyModalContext();
	const checkoutOptions = getSequenceCheckoutOptions(checkoutMode);
	const { steps } = await marketplaceClient.generateBuyTransaction({
		chainId,
		collectionAddress,
		buyer: address,
		marketplace,
		ordersData: [
			{
				orderId,
				quantity: BigInt(quantity),
				tokenId: BigInt(tokenId ?? 0),
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
		: checkoutOptions?.nftCheckout || [];

	return {
		chain: chainId,
		collectibles: [
			{
				tokenId: tokenId?.toString() ?? '',
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
				customCreditCardProviderCallback(buyStep as Step);
				buyModalStore.send({ type: 'close' });
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
	priceCurrencyAddress: string | undefined;
	enabled: boolean;
}

export const usePaymentModalParams = (args: usePaymentModalParams) => {
	const {
		address,
		marketplace,
		collectable,
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
	const tokenId = isMarketProps(buyModalProps)
		? buyModalProps.tokenId
		: undefined;
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
						tokenId,
						marketplace,
						orderId,
						quantity,
						collectable,
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
