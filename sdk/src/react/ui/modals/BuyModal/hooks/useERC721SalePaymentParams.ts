import type { SelectPaymentSettings } from '@0xsequence/checkout';
import { skipToken, useQuery } from '@tanstack/react-query';
import {
	type Address,
	type Hash,
	type Hex,
	encodeFunctionData,
	toHex,
} from 'viem';
import { useAccount } from 'wagmi';
import type { SdkConfig } from '../../../../../types';
import { ERC721_SALE_ABI } from '../../../../../utils/abi/primary-sale/sequence-721-sales-contract';
import { getQueryClient, getSequenceApiClient } from '../../../../_internal';
import { useConfig } from '../../../../hooks';
import type { ModalCallbacks } from '../../_internal/types';
import { buyModalStore, useOnError, useOnSuccess } from '../store';

interface GetERC721SalePaymentParams {
	chainId: number;
	config: SdkConfig;
	address: Address;
	salesContractAddress: string;
	collectionAddress: string;
	price: string;
	currencyAddress: string;
	contractId: string;
	callbacks: ModalCallbacks | undefined;
	customCreditCardProviderCallback: ((price: string) => void) | undefined;
	skipNativeBalanceCheck: boolean | undefined;
	nativeTokenAddress: string | undefined;
	checkoutProvider?: string;
}

export const getERC721SalePaymentParams = async ({
	chainId,
	config,
	address,
	salesContractAddress,
	collectionAddress,
	price,
	currencyAddress,
	contractId,
	callbacks,
	customCreditCardProviderCallback,
	skipNativeBalanceCheck,
	nativeTokenAddress,
	checkoutProvider = 'transak',
}: GetERC721SalePaymentParams) => {
	// Encode the mint function call
	const purchaseTransactionData = encodeFunctionData({
		abi: ERC721_SALE_ABI,
		functionName: 'mint',
		args: [
			address,
			BigInt(1), // amount is always 1 for ERC721
			currencyAddress as Address,
			BigInt(price),
			[toHex(0, { size: 32 })],
		],
	});

	const creditCardProviders = customCreditCardProviderCallback
		? ['custom']
		: [checkoutProvider];

	const isTransakSupported = creditCardProviders.includes('transak');

	let transakContractId: string | undefined;

	if (isTransakSupported) {
		const sequenceApiClient = getSequenceApiClient(config);
		const transakContractIdResponse =
			await sequenceApiClient.checkoutOptionsGetTransakContractID({
				chainId,
				contractAddress: salesContractAddress,
			});

		if (transakContractIdResponse.contractId !== '') {
			transakContractId = transakContractIdResponse.contractId;
		}
	}

	return {
		chain: chainId,
		collectibles: [
			{
				tokenId: '0', // For primary sale, token ID is not yet minted
				quantity: '1',
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
		...(transakContractId && {
			transakConfig: {
				contractId: transakContractId,
			},
		}),
	} satisfies SelectPaymentSettings;
};

interface UseERC721SalePaymentParams {
	salesContractAddress: string | undefined;
	collectionAddress: string | undefined;
	price: string | undefined;
	currencyAddress: string | undefined;
	contractId: string | undefined;
	enabled: boolean;
	checkoutProvider?: string;
	chainId: number;
}

export const useERC721SalePaymentParams = (
	args: UseERC721SalePaymentParams,
) => {
	const {
		salesContractAddress,
		collectionAddress,
		price,
		currencyAddress,
		contractId,
		enabled,
		checkoutProvider,
		chainId,
	} = args;

	const { address } = useAccount();
	const config = useConfig();
	const onSuccess = useOnSuccess();
	const onError = useOnError();

	const queryEnabled =
		enabled &&
		!!address &&
		!!salesContractAddress &&
		!!collectionAddress &&
		!!price &&
		!!currencyAddress &&
		!!contractId;

	return useQuery({
		queryKey: ['erc721SalePaymentParams', args],
		queryFn: queryEnabled
			? () =>
					getERC721SalePaymentParams({
						chainId,
						config,
						address,
						salesContractAddress,
						collectionAddress,
						price,
						currencyAddress,
						contractId,
						callbacks: {
							onSuccess,
							onError,
						},
						customCreditCardProviderCallback: undefined, // Can be added as a prop if needed
						skipNativeBalanceCheck: false, // Can be added as a prop if needed
						nativeTokenAddress: undefined, // Can be added as a prop if needed
						checkoutProvider,
					})
			: skipToken,
	});
};
