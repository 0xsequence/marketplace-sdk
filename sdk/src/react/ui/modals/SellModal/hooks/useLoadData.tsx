import { type Address, parseUnits, zeroAddress } from 'viem';
import type { FeeOption } from '../../../../../types/waas-types';
import { useCollectible, useCollection, useCurrency } from '../../../..';
import { useWallet } from '../../../../_internal/wallet/useWallet';
import { useSelectWaasFeeOptionsStore } from '../../_internal/components/selectWaasFeeOptions/store';
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
		currencyAddress:
			order?.priceCurrencyAddress && order.priceCurrencyAddress !== ''
				? (order.priceCurrencyAddress as Address)
				: undefined,
	});

	const currencyAddressValue = (
		order?.priceCurrencyAddress && order.priceCurrencyAddress !== ''
			? order.priceCurrencyAddress
			: zeroAddress
	) as Address;

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
			currencyAddress: currencyAddressValue,
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

	const { isVisible: feeOptionsVisible, selectedFeeOption } =
		useSelectWaasFeeOptionsStore();
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
		isError: Boolean(
			isWalletError ||
				collectionError ||
				collectibleError ||
				currencyError ||
				tokenApprovalError,
		),
		isLoading: Boolean(
			isWalletLoading ||
				collectionLoading ||
				collectibleLoading ||
				currencyLoading ||
				tokenApprovalLoading,
		),
		shouldHideSellButton,
	};
};
