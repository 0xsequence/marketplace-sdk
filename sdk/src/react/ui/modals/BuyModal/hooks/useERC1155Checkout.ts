import { skipToken, useQuery } from '@tanstack/react-query';
import type { Address, Hash, Hex } from 'viem';
import { useAccount } from 'wagmi';
import { encodeERC1155MintData } from '../../../../../utils/encode/erc1155MintData';
import type {
	CheckoutOptions,
	CheckoutOptionsItem,
} from '../../../../_internal';
import {
	balanceQueries,
	ContractType,
	collectableKeys,
	getQueryClient,
} from '../../../../_internal';
import {
	type SalesContractVersion,
	useSalesContractABI,
} from '../../../../hooks';
import type { ActionButton, ModalCallbacks } from '../../_internal/types';
import type { ERC1155CheckoutOptionsSalesContractArgs } from '../components/types';
import {
	buyModalStore,
	isShopProps,
	useBuyAnalyticsId,
	useBuyModalProps,
	useQuantity,
} from '../store';
import { useTransakContractId } from './useTransakContractId';

type GetERC1155CheckoutParams = {
	accountAddress: Address;
	tokenIds: string[];
	amounts: string[];
	salePrice:
		| {
				amount: string;
				currencyAddress: Address;
		  }
		| undefined;
	totalPrice: bigint;
	chainId: number;
	salesContractAddress: Address;
	collectionAddress: Address;
	items: Array<CheckoutOptionsItem>;
	checkoutOptions?: CheckoutOptions;
	customCreditCardProviderCallback?: (calldata: Hex) => void;
	quantity: number;
	saleAnalyticsId: string;
	transakContractId: string | undefined;
	enabled?: boolean;
	callbacks: ModalCallbacks | undefined;
	successActionButtons: ActionButton[];
	salesContractVersion: SalesContractVersion;
	creditCardProviders: string[];
};

export async function getERC1155CheckoutParams({
	accountAddress,
	tokenIds,
	amounts,
	salePrice,
	totalPrice,
	chainId,
	salesContractAddress,
	collectionAddress,
	items,
	checkoutOptions,
	customCreditCardProviderCallback,
	quantity,
	saleAnalyticsId,
	transakContractId,
	callbacks,
	successActionButtons,
	salesContractVersion,
	creditCardProviders,
}: GetERC1155CheckoutParams) {
	try {
		const purchaseTransactionData = encodeERC1155MintData({
			to: accountAddress,
			tokenIds: tokenIds.map((id) => BigInt(id)),
			amounts: amounts.map((amount) => BigInt(amount)),
			expectedPaymentToken: salePrice?.currencyAddress as Address,
			maxTotal: totalPrice,
			salesContractVersion,
		});

		const customProviderCallback = customCreditCardProviderCallback
			? () => {
					customCreditCardProviderCallback(purchaseTransactionData);
				}
			: undefined;

		return {
			chain: chainId,
			contractAddress: salesContractAddress,
			collectionAddress,
			items: [
				{
					...items[0],
					quantity: quantity?.toString() || '1',
				},
			],
			wallet: accountAddress ?? '',
			// Pass checkout options if available
			...(checkoutOptions && { checkoutOptions }),
			onSuccess: (txHash?: string) => {
				if (txHash) {
					callbacks?.onSuccess?.({ hash: txHash as Hash });
				}
			},
			onError: (error: Error) => {
				callbacks?.onError?.(error);
			},
			onClose: () => {
				const queryClient = getQueryClient();
				queryClient.invalidateQueries({
					queryKey: balanceQueries.inventory,
				});
				queryClient.invalidateQueries({
					queryKey: [...collectableKeys.userBalances],
					refetchType: 'inactive',
				});
				queryClient.invalidateQueries({
					queryKey: collectableKeys.listPrimarySaleItems,
				});
				buyModalStore.send({ type: 'close' });
			},
			customProviderCallback,
			supplementaryAnalyticsInfo: {
				marketplaceType: 'shop',
				saleAnalyticsId,
			},
			successActionButtons,
			creditCardProviders,
			...(transakContractId && {
				transakConfig: {
					contractId: transakContractId,
				},
			}),
		} satisfies ERC1155CheckoutOptionsSalesContractArgs;
	} catch (_error) {
		throw new Error('Failed to load ERC1155 checkout data');
	}
}

interface UseERC1155CheckoutParams {
	chainId: number;
	salesContractAddress: Address;
	collectionAddress: Address;
	items: Array<CheckoutOptionsItem>;
	checkoutOptions?: CheckoutOptions;
	customCreditCardProviderCallback?: (calldata: Hex) => void;
	enabled?: boolean;
	callbacks: ModalCallbacks | undefined;
	successActionButtons: ActionButton[];
}

export const useERC1155Checkout = (args: UseERC1155CheckoutParams) => {
	const {
		chainId,
		salesContractAddress,
		collectionAddress,
		items,
		checkoutOptions,
		customCreditCardProviderCallback,
		enabled = true,
		callbacks,
		successActionButtons,
	} = args;

	const { address: accountAddress } = useAccount();
	const quantity = useQuantity() || 1;
	const saleAnalyticsId = useBuyAnalyticsId();
	const buyModalProps = useBuyModalProps();
	const tokenIds = items.map((item) => item.tokenId);
	const amounts = items.map((item) => item.quantity);
	const salePrice = isShopProps(buyModalProps)
		? buyModalProps.salePrice
		: undefined;
	const totalPrice = BigInt(salePrice?.amount || '0') * BigInt(quantity || 1);

	const creditCardProviders = customCreditCardProviderCallback
		? ['custom']
		: checkoutOptions?.nftCheckout || [];

	const isTransakSupported = creditCardProviders.includes('transak');

	const { data: transakContractId } = useTransakContractId({
		chainId,
		contractAddress: collectionAddress,
		enabled: enabled && isTransakSupported,
	});

	const { version: salesContractVersion } = useSalesContractABI({
		contractAddress: salesContractAddress,
		contractType: ContractType.ERC1155,
		chainId,
		enabled: true,
	});

	const queryEnabled =
		enabled &&
		!!accountAddress &&
		!!salesContractAddress &&
		!!collectionAddress &&
		!!items &&
		!!checkoutOptions &&
		!!tokenIds &&
		!!amounts &&
		!!salesContractVersion;

	return useQuery({
		queryKey: ['erc1155Checkout', args],
		queryFn: queryEnabled
			? () =>
					getERC1155CheckoutParams({
						accountAddress,
						tokenIds,
						amounts,
						salePrice,
						totalPrice,
						chainId,
						salesContractAddress,
						collectionAddress,
						items,
						checkoutOptions,
						customCreditCardProviderCallback,
						quantity,
						saleAnalyticsId,
						transakContractId,
						enabled,
						callbacks,
						successActionButtons,
						salesContractVersion,
						creditCardProviders,
					})
			: skipToken,
	});
};
