import { use$ } from '@legendapp/state/react';
import { parseUnits } from 'viem';
import { useCurrency } from '../../../..';
import { useCollectible, useCollection } from '../../../..';
import type { FeeOption } from '../../../../../types/waas-types';
import { useWallet } from '../../../../_internal/wallet/useWallet';
import { selectWaasFeeOptions$ } from '../../_internal/components/selectWaasFeeOptions/store';
import { useSelectWaasFeeOptions } from '../../_internal/hooks/useSelectWaasFeeOptions';
import { useSellIsBeingProcessed, useSellModalProps } from '../store';
import { useGetTokenApprovalData } from './useGetTokenApproval';

export const useLoadData = () => {
	const { chainId, collectionAddress, tokenId, order } = useSellModalProps();

	const {
		wallet,
		isError: isWalletError,
		isLoading: isWalletLoading,
	} = useWallet();

	const {
		data: collection,
		isLoading: collectionLoading,
		isError: collectionError,
	} = useCollection({
		chainId,
		collectionAddress,
	});

	const {
		data: collectible,
		isLoading: collectibleLoading,
		isError: collectibleError,
	} = useCollectible({
		chainId,
		collectionAddress,
		collectibleId: tokenId,
	});

	const {
		data: currency,
		isLoading: currencyLoading,
		isError: currencyError,
	} = useCurrency({
		chainId,
		currencyAddress: order?.priceCurrencyAddress ?? '',
	});

	const ordersData = [
		{
			orderId: order?.orderId ?? '',
			tokenId: tokenId,
			quantity: order?.quantityRemaining
				? parseUnits(
						order.quantityRemaining,
						collectible?.decimals || 0,
					).toString()
				: '1',
			pricePerToken: order?.priceAmount ?? '',
			currencyAddress: order?.priceCurrencyAddress ?? '',
		},
	];

	const {
		data: tokenApproval,
		isLoading: tokenApprovalLoading,
		isError: tokenApprovalError,
	} = useGetTokenApprovalData({
		chainId,
		collectionAddress,
		marketplace: order?.marketplace,
		ordersData,
	});

	const feeOptionsVisible = use$(selectWaasFeeOptions$.isVisible);
	const selectedFeeOption = use$(selectWaasFeeOptions$.selectedFeeOption);
	const isProcessing = useSellIsBeingProcessed();

	const { shouldHideActionButton } = useSelectWaasFeeOptions({
		isProcessing,
		feeOptionsVisible,
		selectedFeeOption: selectedFeeOption as FeeOption,
	});

	const shouldHideSellButton = selectedFeeOption
		? shouldHideActionButton
		: false;

	return {
		collection,
		collectible,
		currency,
		wallet,
		tokenApproval,
		feeOptionsVisible,
		ordersData,
		isError:
			isWalletError ||
			collectionError ||
			collectibleError ||
			currencyError ||
			tokenApprovalError,
		isLoading:
			isWalletLoading ||
			collectionLoading ||
			collectibleLoading ||
			currencyLoading ||
			tokenApprovalLoading,
		shouldHideSellButton,
	};
};
