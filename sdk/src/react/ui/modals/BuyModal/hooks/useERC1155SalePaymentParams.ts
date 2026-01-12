import { ContractType, type Address } from '@0xsequence/api-client';
import type { SelectPaymentSettings } from '@0xsequence/checkout';
import { skipToken, useQuery } from '@tanstack/react-query';
import { encodeFunctionData, type Hex, toHex } from 'viem';
import { useAccount } from 'wagmi';
import { BuyModalErrorFactory } from '../../../../../types/buyModalErrors';
import {
	getQueryClient,
	type TransactionOnRampProvider,
} from '../../../../_internal';
import { useSalesContractABI } from '../../../../hooks/contracts/useSalesContractABI';
import type { ActionButton } from '../../_internal/types';
import {
	buyModalStore,
	useBuyAnalyticsId,
	useBuyModalProps,
	useQuantity,
} from '../store';

interface ERC1155MintArgs {
	to: Address;
	tokenIds: bigint[];
	amounts: bigint[];
	data: Hex;
	paymentToken: Address;
	maxTotal: bigint;
	proof: Hex[];
	abi: readonly unknown[];
}

const DEFAULT_PROOF = [toHex(0, { size: 32 })] as Hex[];

const encodeERC1155MintData = ({
	to,
	tokenIds,
	amounts,
	data = '0x' as Hex,
	paymentToken,
	maxTotal,
	proof = DEFAULT_PROOF,
	abi,
}: ERC1155MintArgs): Hex => {
	return encodeFunctionData({
		abi,
		functionName: 'mint',
		args: [to, tokenIds, amounts, data, paymentToken, maxTotal, proof],
	});
};

interface GetERC1155SalePaymentParams {
	chainId: number;
	address: Address;
	salesContractAddress: string;
	collectionAddress: string;
	tokenId: string;
	quantity: number;
	price: bigint;
	currencyAddress: string;
	customCreditCardProviderCallback: ((price: string) => void) | undefined;
	skipNativeBalanceCheck: boolean | undefined;
	nativeTokenAddress: string | undefined;
	checkoutProvider?: string;
	successActionButtons?: ActionButton[];
	onRampProvider: TransactionOnRampProvider | undefined;
	saleAnalyticsId: string | undefined;
	abi: readonly unknown[];
}

export const getERC1155SalePaymentParams = async ({
	chainId,
	address,
	salesContractAddress,
	collectionAddress,
	tokenId,
	quantity,
	price,
	currencyAddress,
	customCreditCardProviderCallback,
	skipNativeBalanceCheck,
	nativeTokenAddress,
	checkoutProvider,
	successActionButtons,
	onRampProvider,
	saleAnalyticsId,
	abi,
	// eslint-disable-next-line @typescript-eslint/require-await -- Called with await for interface consistency
}: GetERC1155SalePaymentParams) => {
	try {
		const totalPrice = price * BigInt(quantity);
		const tokenIdBigInt = BigInt(tokenId);

		const purchaseTransactionData = encodeERC1155MintData({
			to: address,
			tokenIds: [tokenIdBigInt],
			amounts: [BigInt(quantity)],
			data: '0x' as Hex,
			paymentToken: currencyAddress as Address,
			maxTotal: totalPrice,
			proof: DEFAULT_PROOF,
			abi,
		});

		const creditCardProviders = customCreditCardProviderCallback
			? ['custom']
			: checkoutProvider
				? [checkoutProvider]
				: [];

		return {
			chain: chainId,
			collectibles: [
				{
					quantity: quantity.toString(),
					decimals: 0,
					tokenId,
				},
			],
			currencyAddress,
			price: price.toString(),
			targetContractAddress: salesContractAddress,
			txData: purchaseTransactionData,
			collectionAddress,
			recipientAddress: address,
			creditCardProviders,
			onClose: () => {
				const queryClient = getQueryClient();
				queryClient.invalidateQueries({
					predicate: (query) => !query.meta?.persistent,
				});
				buyModalStore.send({ type: 'close' });
			},
			skipNativeBalanceCheck,
			supplementaryAnalyticsInfo: {
				marketplaceType: 'shop',
				...(saleAnalyticsId && { saleAnalyticsId }),
			},
			nativeTokenAddress,
			...(customCreditCardProviderCallback && {
				customProviderCallback: () => {
					customCreditCardProviderCallback(price.toString());
					buyModalStore.send({ type: 'close' });
				},
			}),
			successActionButtons,
			onRampProvider,
		} satisfies SelectPaymentSettings;
	} catch (error) {
		// Convert to structured error for better debugging
		const buyModalError = BuyModalErrorFactory.priceCalculation(
			'ERC1155 payment params calculation',
			[price.toString(), quantity.toString(), tokenId],
			error instanceof Error ? error.message : 'Unknown error',
		);
		// Wrap in Error for proper error handling
		const wrappedError = new Error(
			`${buyModalError.type}: ${buyModalError.operation}`,
		);
		(wrappedError as Error & { buyModalError: typeof buyModalError }).buyModalError = buyModalError;
		throw wrappedError;
	}
};

interface UseERC1155SalePaymentParams {
	salesContractAddress: string | undefined;
	collectionAddress: string | undefined;
	tokenId: string | undefined;
	price: string | undefined;
	currencyAddress: string | undefined;
	enabled?: boolean;
	checkoutProvider?: string;
	chainId: number;
}

export const useERC1155SalePaymentParams = (
	args: UseERC1155SalePaymentParams,
) => {
	const {
		salesContractAddress,
		collectionAddress,
		tokenId,
		price,
		currencyAddress,
		enabled = true,
		checkoutProvider,
		chainId,
	} = args;

	const { address } = useAccount();
	const quantity = useQuantity();
	const buyModalProps = useBuyModalProps();
	const saleAnalyticsId = useBuyAnalyticsId();

	const {
		abi,
		isLoading: isABILoading,
		version,
	} = useSalesContractABI({
		contractAddress: salesContractAddress as Address,
		contractType: ContractType.ERC1155,
		chainId,
		enabled: enabled && !!salesContractAddress,
	});

	const queryEnabled =
		enabled &&
		!!address &&
		!!salesContractAddress &&
		!!collectionAddress &&
		!!tokenId &&
		price !== undefined &&
		!!currencyAddress &&
		!!quantity &&
		!!abi &&
		!isABILoading;

	return useQuery({
		queryKey: ['erc1155SalePaymentParams', args, quantity, version],
		queryFn:
			queryEnabled && abi
				? () =>
						getERC1155SalePaymentParams({
							chainId,
							address,
							salesContractAddress,
							collectionAddress,
							tokenId,
							quantity,
							price: BigInt(price ?? '0'),
							currencyAddress,
							customCreditCardProviderCallback: undefined, // Can be added as a prop if needed
							skipNativeBalanceCheck: false, // Can be added as a prop if needed
							nativeTokenAddress: undefined, // Can be added as a prop if needed
							checkoutProvider,
							successActionButtons: buyModalProps.successActionButtons,
							onRampProvider: buyModalProps.onRampProvider,
							saleAnalyticsId,
							abi,
						})
				: skipToken,
		enabled: queryEnabled,
	});
};
