import type {
	CheckoutOptions,
	CheckoutOptionsItem,
} from '@0xsequence/api-client';
import type { TransactionOnRampProvider } from '@0xsequence/checkout';
import { skipToken, useQuery } from '@tanstack/react-query';
import type { Address, Hash } from 'viem';
import { useAccount } from 'wagmi';
import { BuyModalErrorFactory } from '../../../../../../../types/buyModalErrors';
import { getQueryClient } from '../../../../../../_internal';
import type { ActionButton, ModalCallbacks } from '../../../../_internal/types';
import {
	buyModalStore,
	useBuyAnalyticsId,
	useBuyModalProps,
	useOnError,
	useOnSuccess,
	useQuantity,
} from '../../../store';

interface GetERC1155ShopModalParams {
	chainId: number;
	address: Address;
	salesContractAddress: string;
	collectionAddress: string;
	items: Array<CheckoutOptionsItem>;
	checkoutOptions?: CheckoutOptions;
	customProviderCallback?: (
		onSuccess: (txHash: string) => void,
		onError: (error: Error) => void,
		onClose: () => void,
	) => void;
	callbacks: ModalCallbacks | undefined;
	quantity: number;
	saleAnalyticsId: string | undefined;
	successActionButtons?: ActionButton[];
	onRampProvider: TransactionOnRampProvider | undefined;
}

export const getERC1155ShopModalParams = async ({
	chainId,
	address,
	salesContractAddress,
	collectionAddress,
	items,
	checkoutOptions,
	customProviderCallback,
	callbacks,
	quantity,
	saleAnalyticsId,
	successActionButtons,
	onRampProvider,
}: GetERC1155ShopModalParams) => {
	try {
		return {
			chain: chainId,
			contractAddress: salesContractAddress,
			collectionAddress,
			items: [
				{
					...items[0],
					quantity: quantity.toString(),
					tokenId: items[0].tokenId.toString(),
				},
			],
			wallet: address,
			...(checkoutOptions && { checkoutOptions }),
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
			customProviderCallback,
			supplementaryAnalyticsInfo: {
				marketplaceType: 'shop',
				...(saleAnalyticsId && { saleAnalyticsId }),
			},
			successActionButtons,
			...(onRampProvider && {
				onRampProvider,
			}),
		};
	} catch (error) {
		// Convert to structured error for better debugging
		throw BuyModalErrorFactory.priceCalculation(
			'ERC1155 shop modal data calculation',
			[items[0]?.tokenId?.toString() ?? 'unknown', quantity.toString()],
			error instanceof Error ? error.message : 'Unknown error',
		);
	}
};

interface UseERC1155ShopModalDataParams {
	chainId: number;
	salesContractAddress: string | undefined;
	collectionAddress: string | undefined;
	items: Array<CheckoutOptionsItem> | undefined;
	checkoutOptions?: CheckoutOptions;
	customProviderCallback?: (
		onSuccess: (txHash: string) => void,
		onError: (error: Error) => void,
		onClose: () => void,
	) => void;
	enabled?: boolean;
}

export const useERC1155ShopModalData = (
	args: UseERC1155ShopModalDataParams,
) => {
	const {
		chainId,
		salesContractAddress,
		collectionAddress,
		items,
		checkoutOptions,
		customProviderCallback,
		enabled = true,
	} = args;

	const { address } = useAccount();
	const quantity = useQuantity();
	const onSuccess = useOnSuccess();
	const onError = useOnError();
	const saleAnalyticsId = useBuyAnalyticsId();
	const buyModalProps = useBuyModalProps();

	const queryEnabled =
		enabled &&
		!!address &&
		!!salesContractAddress &&
		!!collectionAddress &&
		!!items &&
		items.length > 0 &&
		quantity !== undefined;

	return useQuery({
		queryKey: ['erc1155ShopModalData', args, quantity],
		queryFn: queryEnabled
			? () =>
					getERC1155ShopModalParams({
						chainId,
						address,
						salesContractAddress,
						collectionAddress,
						items,
						checkoutOptions,
						customProviderCallback,
						callbacks: {
							onSuccess,
							onError,
						},
						quantity: quantity ?? 1,
						saleAnalyticsId,
						successActionButtons: buyModalProps.successActionButtons,
						onRampProvider: buyModalProps.onRampProvider,
					})
			: skipToken,
	});
};
