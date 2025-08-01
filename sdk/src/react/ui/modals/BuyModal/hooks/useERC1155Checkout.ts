import { useERC1155SaleContractCheckout } from '@0xsequence/checkout';
import type { Hash } from 'viem';
import { useAccount } from 'wagmi';
import type {
	CheckoutOptions,
	CheckoutOptionsItem,
} from '../../../../_internal';
import { getQueryClient } from '../../../../_internal';
import {
	buyModalStore,
	useBuyAnalyticsId,
	useOnError,
	useOnSuccess,
	useQuantity,
} from '../store';

interface UseERC1155CheckoutParams {
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

export const useERC1155Checkout = ({
	chainId,
	salesContractAddress,
	collectionAddress,
	items,
	checkoutOptions,
	customProviderCallback,
	enabled = true,
}: UseERC1155CheckoutParams) => {
	const { address: accountAddress } = useAccount();
	const quantity = useQuantity();
	const onSuccess = useOnSuccess();
	const onError = useOnError();
	const saleAnalyticsId = useBuyAnalyticsId();

	const checkout = useERC1155SaleContractCheckout({
		chain: chainId,
		chainId: chainId.toString(),
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
		onSuccess: (hash: string) => {
			onSuccess({ hash: hash as Hash });
		},
		onError: (error: Error) => {
			onError(error);
		},
		onClose: () => {
			const queryClient = getQueryClient();
			queryClient.invalidateQueries({
				predicate: (query) => !query.meta?.persistent,
			});
			buyModalStore.send({ type: 'close' });
		},
		customProviderCallback,
		supplementaryAnalyticsInfo: {
			marketplaceType: 'shop',
			saleAnalyticsId,
		},
	});

	return {
		...checkout,
		isEnabled: Boolean(enabled && accountAddress),
	};
};
