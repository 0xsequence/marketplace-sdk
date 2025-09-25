import type { SelectPaymentSettings } from '@0xsequence/checkout';
import { skipToken, useQuery } from '@tanstack/react-query';
import {
	type Address,
	encodeFunctionData,
	type Hash,
	type Hex,
	toHex,
} from 'viem';
import { useAccount } from 'wagmi';
import { BuyModalErrorFactory } from '../../../../../types/buyModalErrors';
import { ERC721_SALE_ABI_V0 } from '../../../../../utils/abi';
import { getQueryClient } from '../../../../_internal';
import type { ActionButton, ModalCallbacks } from '../../_internal/types';
import {
	buyModalStore,
	isShopProps,
	useBuyModalProps,
	useOnError,
	useOnSuccess,
} from '../store';
import { useTransakContractId } from './useTransakContractId';

interface ERC721MintArgs {
	to: Address;
	amount: bigint;
	paymentToken: Address;
	price: bigint;
	proof: Hex[];
}

const DEFAULT_PROOF = [toHex(0, { size: 32 })] as Hex[];

const encodeERC721MintData = ({
	to,
	amount,
	paymentToken,
	price,
	proof = DEFAULT_PROOF,
}: ERC721MintArgs): Hex => {
	const totalPrice = price * amount;

	return encodeFunctionData({
		// We get away with using V0 ABI because the mint functions are identical on V0 and V1
		abi: ERC721_SALE_ABI_V0,
		functionName: 'mint',
		args: [to, amount, paymentToken, totalPrice, proof],
	});
};

interface GetERC721SalePaymentParams {
	chainId: number;
	address: Address;
	salesContractAddress: string;
	collectionAddress: string;
	price: bigint;
	currencyAddress: string;
	callbacks: ModalCallbacks | undefined;
	customCreditCardProviderCallback: ((price: string) => void) | undefined;
	skipNativeBalanceCheck: boolean | undefined;
	nativeTokenAddress: string | undefined;
	checkoutProvider?: string;
	quantity: number;
	successActionButtons?: ActionButton[];
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
	successActionButtons,
}: GetERC721SalePaymentParams) => {
	try {
		const purchaseTransactionData = encodeERC721MintData({
			to: address,
			amount: BigInt(quantity),
			paymentToken: currencyAddress as Address,
			price: price,
			proof: DEFAULT_PROOF,
		});

		const creditCardProviders = customCreditCardProviderCallback
			? ['custom']
			: checkoutProvider
				? [checkoutProvider]
				: [];

		const customProviderCallback = customCreditCardProviderCallback
			? () => {
					customCreditCardProviderCallback(price.toString());
				}
			: undefined;

		const isTransakSupported = creditCardProviders.includes('transak');

		const { data: transakContractId, error: transakContractIdError } =
			useTransakContractId({
				chainId,
				contractAddress: collectionAddress,
				enabled: isTransakSupported,
			});

		if (transakContractIdError) {
			throw transakContractIdError;
		}

		return {
			chain: chainId,
			collectibles: [
				{
					quantity: quantity.toString(),
					decimals: 0,
				},
			],
			currencyAddress,
			price: price.toString(),
			targetContractAddress: salesContractAddress,
			txData: purchaseTransactionData,
			collectionAddress,
			recipientAddress: address,
			creditCardProviders,
			onSuccess: (txHash?: string) => {
				if (txHash) {
					callbacks?.onSuccess?.({ hash: txHash as Hash });
				}
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
			supplementaryAnalyticsInfo: {
				marketplaceType: 'shop',
			},
			nativeTokenAddress,
			customProviderCallback,
			successActionButtons,
			...(transakContractId && {
				transakConfig: {
					contractId: transakContractId,
				},
			}),
		} satisfies SelectPaymentSettings;
	} catch (error) {
		// Convert to structured error for better debugging
		throw BuyModalErrorFactory.priceCalculation(
			'ERC721 payment params calculation',
			[price.toString(), quantity.toString()],
			error instanceof Error ? error.message : 'Unknown error',
		);
	}
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
	const buyModalProps = useBuyModalProps();
	const customCreditCardProviderCallback = isShopProps(buyModalProps)
		? (buyModalProps.customCreditCardProviderCallback as
				| ((price: string) => void)
				| undefined)
		: undefined;

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
						price: BigInt(price),
						currencyAddress,
						callbacks: {
							onSuccess,
							onError,
						},
						customCreditCardProviderCallback,
						skipNativeBalanceCheck: false, // Can be added as a prop if needed
						nativeTokenAddress: undefined, // Can be added as a prop if needed

						checkoutProvider,
						quantity,
						successActionButtons: buyModalProps.successActionButtons,
					})
			: skipToken,
	});
};
