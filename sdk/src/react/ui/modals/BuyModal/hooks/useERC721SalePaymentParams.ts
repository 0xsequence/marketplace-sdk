import type { SelectPaymentSettings } from '@0xsequence/checkout';
import { skipToken, useQuery } from '@tanstack/react-query';
import { type Address, type Hash, encodeFunctionData, toHex } from 'viem';
import { useAccount } from 'wagmi';
import { ERC721_SALE_ABI } from '../../../../../utils/abi/primary-sale/sequence-721-sales-contract';
import { getQueryClient } from '../../../../_internal';
import type { ModalCallbacks } from '../../_internal/types';
import { buyModalStore, useOnError, useOnSuccess } from '../store';

interface ERC721MintArgs {
	to: Address;
	amount: bigint;
	paymentToken: Address;
	price: bigint;
	proof: `0x${string}`[];
}

const DEFAULT_PROOF = [toHex(0, { size: 32 })] as `0x${string}`[];

const encodeERC721MintData = ({
	to,
	amount,
	paymentToken,
	price,
	proof = DEFAULT_PROOF,
}: ERC721MintArgs): `0x${string}` => {
	return encodeFunctionData({
		abi: ERC721_SALE_ABI,
		functionName: 'mint',
		args: [to, amount, paymentToken, price, proof],
	});
};

interface GetERC721SalePaymentParams {
	chainId: number;
	address: Address;
	salesContractAddress: string;
	collectionAddress: string;
	price: string;
	currencyAddress: string;
	callbacks: ModalCallbacks | undefined;
	customCreditCardProviderCallback: ((price: string) => void) | undefined;
	skipNativeBalanceCheck: boolean | undefined;
	nativeTokenAddress: string | undefined;
	checkoutProvider?: string;
	quantity: number;
}

export const getERC721SalePaymentParams = async ({
	chainId,
	address,
	salesContractAddress,
	collectionAddress,
	price,
	currencyAddress,
	callbacks,
	customCreditCardProviderCallback,
	skipNativeBalanceCheck,
	nativeTokenAddress,
	checkoutProvider,
	quantity,
}: GetERC721SalePaymentParams) => {
	const purchaseTransactionData = encodeERC721MintData({
		to: address,
		amount: BigInt(1), // ERC721 mints are always quantity 1
		paymentToken: currencyAddress as Address,
		price: BigInt(price),
		proof: DEFAULT_PROOF,
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
			},
		],
		currencyAddress,
		price,
		targetContractAddress: salesContractAddress,
		txData: purchaseTransactionData,
		collectionAddress,
		recipientAddress: address,
		enableMainCurrencyPayment: true,
		enableSwapPayments: true,
		creditCardProviders,
		onSuccess: (hash: string) => {
			callbacks?.onSuccess?.({ hash: hash as Hash });
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
				customCreditCardProviderCallback(price);
				buyModalStore.send({ type: 'close' });
			},
		}),
	} satisfies SelectPaymentSettings;
};

interface UseERC721SalePaymentParams {
	salesContractAddress: string | undefined;
	collectionAddress: string | undefined;
	price: string | undefined;
	currencyAddress: string | undefined;
	enabled: boolean;
	checkoutProvider?: string;
	chainId: number;
	quantity: number;
}

export const useERC721SalePaymentParams = (
	args: UseERC721SalePaymentParams,
) => {
	const {
		salesContractAddress,
		collectionAddress,
		price,
		currencyAddress,
		enabled,
		checkoutProvider,
		chainId,
		quantity,
	} = args;

	const { address } = useAccount();
	const onSuccess = useOnSuccess();
	const onError = useOnError();

	const queryEnabled =
		enabled &&
		!!address &&
		!!salesContractAddress &&
		!!collectionAddress &&
		!!price &&
		!!currencyAddress;

	return useQuery({
		queryKey: ['erc721SalePaymentParams', args],
		queryFn: queryEnabled
			? () =>
					getERC721SalePaymentParams({
						chainId,
						address,
						salesContractAddress,
						collectionAddress,
						price,
						currencyAddress,
						callbacks: {
							onSuccess,
							onError,
						},
						customCreditCardProviderCallback: undefined, // Can be added as a prop if needed
						skipNativeBalanceCheck: false, // Can be added as a prop if needed
						nativeTokenAddress: undefined, // Can be added as a prop if needed
						checkoutProvider,
						quantity,
					})
			: skipToken,
	});
};
