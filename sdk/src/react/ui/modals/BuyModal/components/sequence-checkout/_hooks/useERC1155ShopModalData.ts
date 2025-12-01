import type {
	CheckoutOptions,
	CheckoutOptionsItem,
} from '@0xsequence/api-client';
import { useERC1155SaleContractCheckout } from '@0xsequence/checkout';
import type { Hash } from 'viem';
import { useAccount } from 'wagmi';
import {
	buyModalStore,
	useBuyAnalyticsId,
	useBuyModalProps,
	useOnError,
	useOnSuccess,
	useQuantity,
} from '../../../store';

interface UseERC1155ShopModalDataParams {
	chainId: number;
	salesContractAddress: string;
	collectionAddress: string;
	items: Array<CheckoutOptionsItem>;
	checkoutOptions?: CheckoutOptions;
	customProviderCallback?: (
		onSuccess: (txHash: string) => void,
		onError: (error: Error) => void,
		onClose: () => void,
	) => void;
	enabled?: boolean;
}

export const useERC1155ShopModalData = ({
	chainId,
	salesContractAddress,
	collectionAddress,
	items,
	checkoutOptions,
	customProviderCallback,
	enabled = true,
}: UseERC1155ShopModalDataParams) => {
	const { address: accountAddress } = useAccount();
	const quantity = useQuantity();
	const onSuccess = useOnSuccess();
	const onError = useOnError();
	const saleAnalyticsId = useBuyAnalyticsId();

	const buyModalProps = useBuyModalProps();

	const checkout = useERC1155SaleContractCheckout({
		chain: chainId,
		contractAddress: salesContractAddress,
		collectionAddress,
		items: [
			{
				...items[0],
				quantity: quantity?.toString() ?? '1',
				tokenId: items[0].tokenId.toString() ?? '0',
			},
		],
		wallet: accountAddress ?? '',
		// Pass checkout options if available
		...(checkoutOptions && { checkoutOptions }),
		onSuccess: (txHash?: string) => {
			if (txHash) {
				onSuccess({ hash: txHash as Hash });
			}
		},
		onError: (error: Error) => {
			onError(error);
		},
		onClose: () => {
			//const _queryClient = getQueryClient();
			/* TODO: Fix
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
			*/
			buyModalStore.send({ type: 'close' });
		},
		customProviderCallback,
		supplementaryAnalyticsInfo: {
			marketplaceType: 'shop',
			saleAnalyticsId,
		},
		successActionButtons: buyModalProps.successActionButtons,
		...(buyModalProps.onRampProvider && {
			onRampProvider: buyModalProps.onRampProvider,
		}),
	});

	return {
		...checkout,
		isEnabled: Boolean(enabled && accountAddress),
	};
};
