import { useERC1155SaleContractCheckout } from '@0xsequence/checkout';
import type { Hash } from 'viem';
import { useAccount } from 'wagmi';
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
	type CustomCreditCardProviderCallback,
	type ERC1155SaleCustomCreditCardCallback,
	isCustomCreditCardCallbacks,
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
	customCreditCardProviderCallback?: CustomCreditCardProviderCallback;
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

	const customProviderCallback = customCreditCardProviderCallback
		? () => {
				if (isCustomCreditCardCallbacks(customCreditCardProviderCallback)) {
					customCreditCardProviderCallback.onERC1155SaleCheckout?.(items);
				} else if (typeof customCreditCardProviderCallback === 'function') {
					(
						customCreditCardProviderCallback as ERC1155SaleCustomCreditCardCallback
					)(items);
				}
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
