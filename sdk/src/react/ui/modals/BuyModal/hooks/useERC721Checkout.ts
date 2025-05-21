import { useERC1155SaleContractCheckout } from '@0xsequence/checkout';
import type { Hash } from 'viem';
import { useAccount } from 'wagmi';
import type { CheckoutOptionsItem } from '../../../../_internal';
import { getQueryClient } from '../../../../_internal';
import { buyModalStore, useOnError, useOnSuccess, useQuantity } from '../store';

interface UseERC721CheckoutParams {
	chainId: number;
	salesContractAddress: string;
	collectionAddress: string;
	items: Array<CheckoutOptionsItem>;
	customProviderCallback?: (
		onSuccess: (txHash: string) => void,
		onError: (error: Error) => void,
		onClose: () => void,
	) => void;
	enabled?: boolean;
}

export const useERC721Checkout = ({
	chainId,
	salesContractAddress,
	collectionAddress,
	items,
	customProviderCallback,
	enabled = true,
}: UseERC721CheckoutParams) => {
	const { address: accountAddress } = useAccount();
	const quantity = useQuantity();
	const onSuccess = useOnSuccess();
	const onError = useOnError();

	const checkoutParams = {
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
		onSuccess: (hash: string) => {
			onSuccess({ hash: hash as Hash });
		},
		onError: (error: Error) => {
			onError(error);
		},
		onClose: () => {
			const queryClient = getQueryClient();
			queryClient.invalidateQueries();
			buyModalStore.send({ type: 'close' });
		},
		customProviderCallback,
	};

	const checkout = useERC1155SaleContractCheckout(checkoutParams);

	return {
		...checkout,
		isEnabled: Boolean(enabled && accountAddress),
		checkoutParams,
	};
};
