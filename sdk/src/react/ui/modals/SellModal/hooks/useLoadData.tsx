import { use$ } from '@legendapp/state/react';
import { useCurrency } from '../../../..';
import { useCollectible, useCollection } from '../../../..';
import { useWallet } from '../../../../_internal/wallet/useWallet';
import { selectWaasFeeOptions$ } from '../../_internal/components/selectWaasFeeOptions/store';
import { useSelectWaasFeeOptions } from '../../_internal/hooks/useSelectWaasFeeOptions';
import { useSellIsBeingProcessed, useSellModalProps } from '../store';

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

	const feeOptionsVisible = use$(selectWaasFeeOptions$.isVisible);
	const selectedFeeOption = use$(selectWaasFeeOptions$.selectedFeeOption);
	const isProcessing = useSellIsBeingProcessed();

	if (!selectedFeeOption) {
		throw new Error('No fee option selected');
	}

	const { shouldHideActionButton: shouldHideSellButton } =
		useSelectWaasFeeOptions({
			chainId,
			isProcessing,
			feeOptionsVisible,
			selectedFeeOption,
		});

	return {
		collection,
		collectible,
		currency,
		wallet,
		isError:
			isWalletError || collectionError || collectibleError || currencyError,
		isLoading:
			isWalletLoading ||
			collectionLoading ||
			collectibleLoading ||
			currencyLoading,
		shouldHideSellButton,
	};
};
