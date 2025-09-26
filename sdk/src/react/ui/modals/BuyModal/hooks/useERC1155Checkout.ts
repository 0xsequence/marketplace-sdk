import { useERC1155SaleContractCheckout } from '@0xsequence/checkout';
import type { Address, Hash, Hex } from 'viem';
import { useAccount } from 'wagmi';
import { encodeERC1155MintData } from '../../../../../utils/encode/erc1155MindData';
import type {
	CheckoutOptions,
	CheckoutOptionsItem,
} from '../../../../_internal';
import {
	balanceQueries,
	collectableKeys,
	getQueryClient,
} from '../../../../_internal';
import {
	buyModalStore,
	isShopProps,
	useBuyAnalyticsId,
	useBuyModalProps,
	useOnError,
	useOnSuccess,
	useQuantity,
} from '../store';
import { useTransakContractId } from './useTransakContractId';

interface UseERC1155CheckoutParams {
	chainId: number;
	salesContractAddress: string;
	collectionAddress: string;
	items: Array<CheckoutOptionsItem>;
	checkoutOptions?: CheckoutOptions;
	customCreditCardProviderCallback?: (calldata: Hex) => void;
	enabled?: boolean;
}

export const useERC1155Checkout = ({
	chainId,
	salesContractAddress,
	collectionAddress,
	items,
	checkoutOptions,
	customCreditCardProviderCallback,
	enabled = true,
}: UseERC1155CheckoutParams) => {
	const { address: accountAddress } = useAccount();
	const quantity = useQuantity();
	const onSuccess = useOnSuccess();
	const onError = useOnError();
	const saleAnalyticsId = useBuyAnalyticsId();
	const buyModalProps = useBuyModalProps();

	const creditCardProviders = customCreditCardProviderCallback
		? ['custom']
		: checkoutOptions?.nftCheckout || [];

	const tokenIds = items.map((item) => BigInt(item.tokenId));
	const amounts = items.map(() => BigInt(quantity || 1));

	const salePrice = isShopProps(buyModalProps)
		? buyModalProps.salePrice
		: undefined;
	const totalPrice = BigInt(salePrice?.amount || '0') * BigInt(quantity || 1);

	const purchaseTransactionData = encodeERC1155MintData({
		to: accountAddress as Address,
		tokenIds,
		amounts,
		expectedPaymentToken: salePrice?.currencyAddress as Address,
		maxTotal: totalPrice,
		salesContractAddress: salesContractAddress as Address,
		chainId,
	});

	const customProviderCallback = customCreditCardProviderCallback
		? () => {
				customCreditCardProviderCallback(purchaseTransactionData);
			}
		: undefined;

	const isTransakSupported = creditCardProviders.includes('transak');

	const { data: transakContractId, error: transakContractIdError } =
		useTransakContractId({
			chainId,
			contractAddress: collectionAddress,
			enabled: isTransakSupported && enabled,
		});

	const checkout = useERC1155SaleContractCheckout({
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
		creditCardProviders,
		onSuccess: (txHash?: string) => {
			if (txHash) {
				onSuccess({ hash: txHash as Hash });
			}
		},
		onError: (error: Error) => {
			onError(error);
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
		successActionButtons: buyModalProps.successActionButtons,
		...(transakContractId && {
			transakConfig: {
				contractId: transakContractId,
			},
		}),
	});

	return {
		...checkout,
		isEnabled: Boolean(enabled && accountAddress),
		transakContractIdError,
	};
};
