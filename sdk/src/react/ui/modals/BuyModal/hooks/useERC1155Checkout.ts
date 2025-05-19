import { useERC1155SaleContractCheckout } from '@0xsequence/checkout';
import type { Hash } from 'viem';
import { useAccount } from 'wagmi';
import type { CheckoutOptionsItem } from '../../../../_internal';
import { getQueryClient } from '../../../../_internal';
import { buyModalStore, useOnError, useOnSuccess, useQuantity } from '../store';

interface UseERC1155CheckoutParams {
	chainId: number;
	salesContractAddress: string;
	collectionAddress: string;
	items: Array<CheckoutOptionsItem>;
	customProviderCallback?: (
		onSuccess: (txHash: string) => void,
		onError: (error: Error) => void,
		onClose: () => void,
	) => void;
}

export const useERC1155Checkout = ({
	chainId,
	salesContractAddress,
	collectionAddress,
	items,
	customProviderCallback,
}: UseERC1155CheckoutParams) => {
	const { address: accountAddress } = useAccount();
	const quantity = useQuantity();
	const onSuccess = useOnSuccess();
	const onError = useOnError();

	useERC1155SaleContractCheckout({
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
	});
};
