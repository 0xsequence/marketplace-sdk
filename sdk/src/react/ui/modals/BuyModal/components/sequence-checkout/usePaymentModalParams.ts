import type { Address, Step } from '@0xsequence/api-client';
import type {
	SelectPaymentSettings,
	TransactionOnRampProvider,
} from '@0xsequence/checkout';
import { skipToken, useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';
import { useAccount } from 'wagmi';
import { StepType } from '../../../../../../../../api/src/adapters/marketplace/marketplace.gen';
import type { CheckoutMode, MarketplaceKind } from '../../../../../../types';
import { decodeERC20Approval } from '../../../../../../utils/decode/erc20';
import { getQueryClient } from '../../../../../_internal';
import type { ActionButton } from '../../../_internal/types';
import { useBuyModalContext } from '../../internal/buyModalContext';
import {
	buyModalStore,
	isMarketProps,
	useBuyAnalyticsId,
	useBuyModalProps,
} from '../../store';

interface GetBuyCollectableParams {
	address: Address;
	chainId: number;
	collectionAddress: string;
	tokenId: bigint | undefined;
	marketplaceKind: MarketplaceKind | undefined;
	orderId: string;
	quantity: number;
	priceCurrencyAddress: string;
	customCreditCardProviderCallback: ((buyStep: Step) => void) | undefined;
	skipNativeBalanceCheck: boolean | undefined;
	nativeTokenAddress: string | undefined;
	buyAnalyticsId: string;
	onRampProvider: TransactionOnRampProvider | undefined;
	checkoutMode: CheckoutMode | undefined;
	steps: Step[] | undefined;
	marketplaceType: 'market' | 'shop';
	successActionButtons?: ActionButton[];
}

export const getBuyCollectableParams = async ({
	address,
	chainId,
	collectionAddress,
	tokenId,
	successActionButtons,
	priceCurrencyAddress,
	customCreditCardProviderCallback,
	marketplaceKind,
	orderId,
	quantity,
	skipNativeBalanceCheck,
	nativeTokenAddress,
	buyAnalyticsId,
	onRampProvider,
	checkoutMode,
	steps,
	marketplaceType,
	// eslint-disable-next-line @typescript-eslint/require-await -- Called with await for interface consistency
}: GetBuyCollectableParams) => {
	const checkoutOptions =
		typeof checkoutMode === 'object' ? checkoutMode.options : undefined;

	const buyStep = steps?.find((step) => step.id === StepType.buy);
	const approveStep = steps?.find((step) => step.id === StepType.tokenApproval);

	const approvedSpenderAddress = approveStep
		? decodeERC20Approval(approveStep.data as Hex).spender
		: undefined;

	if (!buyStep) {
		throw new Error('Buy step not found');
	}

	const creditCardProviders = customCreditCardProviderCallback
		? ['custom']
		: checkoutOptions?.nftCheckout || [];

	const supplementaryAnalyticsInfo = (
		marketplaceType === 'market'
			? {
					requestId: orderId,
					...(marketplaceKind && { marketplaceKind }),
					buyAnalyticsId,
				}
			: {
					marketplaceType: 'shop',
				}
	) as Record<string, string>;

	const totalPrice = BigInt(buyStep.price) * BigInt(quantity);

	return {
		chain: chainId,
		collectibles: [
			{
				tokenId: tokenId?.toString() ?? '',
				quantity: quantity.toString(),
			},
		],
		currencyAddress: priceCurrencyAddress,
		price: totalPrice.toString(),
		targetContractAddress: buyStep.to,
		approvedSpenderAddress,
		txData: buyStep.data as Hex,
		collectionAddress,
		recipientAddress: address,
		creditCardProviders,
		supplementaryAnalyticsInfo,
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
		onRampProvider,
		successActionButtons,
	} satisfies SelectPaymentSettings;
};

interface usePaymentModalParams {
	quantity: number | undefined;
	marketplaceKind: MarketplaceKind | undefined;
	priceCurrencyAddress: string | undefined;
	steps: Step[] | undefined;
	marketplaceType: 'market' | 'shop';
}

export const usePaymentModalParams = (args: usePaymentModalParams) => {
	const {
		marketplaceKind,
		priceCurrencyAddress,
		quantity,
		steps,
		marketplaceType,
	} = args;

	const buyModalProps = useBuyModalProps();
	const { checkoutMode } = useBuyModalContext();
	const {
		chainId,
		collectionAddress,
		skipNativeBalanceCheck,
		nativeTokenAddress,
		onRampProvider,
		successActionButtons,
	} = buyModalProps;

	// Extract Marketplace-specific properties using type guard
	const tokenId = isMarketProps(buyModalProps)
		? buyModalProps.tokenId
		: buyModalProps.item.tokenId;
	const orderId = isMarketProps(buyModalProps) ? buyModalProps.orderId : '';
	const customCreditCardProviderCallback = isMarketProps(buyModalProps)
		? buyModalProps.customCreditCardProviderCallback
		: undefined;

	const buyAnalyticsId = useBuyAnalyticsId();
	const { address } = useAccount();

	const queryEnabled =
		!!address &&
		!!priceCurrencyAddress &&
		!!quantity &&
		!!steps &&
		(marketplaceType === 'market' ? !!marketplaceKind : true);

	return useQuery({
		queryKey: ['buyCollectableParams', buyModalProps, args],
		queryFn: queryEnabled
			? () =>
					getBuyCollectableParams({
						chainId,
						address,
						collectionAddress,
						tokenId,
						marketplaceKind,
						orderId,
						quantity,
						priceCurrencyAddress,
						successActionButtons,
						customCreditCardProviderCallback,
						skipNativeBalanceCheck,
						nativeTokenAddress,
						buyAnalyticsId,
						onRampProvider,
						checkoutMode,
						steps,
						marketplaceType,
					})
			: skipToken,
		retry: false,
	});
};
