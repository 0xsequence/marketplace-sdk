import { use$ } from '@legendapp/state/react';
import type { Hex } from 'viem';
import { ContractType, type TokenMetadata } from '../../../_internal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import { useBuyCollectable } from './hooks/useBuyCollectable';
import { useLoadData } from './hooks/useLoadData';
import { CheckoutModal } from './modals/CheckoutModal';
import type { BuyInput } from './modals/CheckoutModal';
import { ERC1155QuantityModal } from './modals/Modal1155';
import { buyModal$ } from './store';

export const BuyModal = () => {
	const isOpen = use$(buyModal$.isOpen);

	if (!isOpen) return null;

	return <BuyModalContent />;
};

const BuyModalContent = () => {
	const chainId = String(use$(buyModal$.state.order.chainId));
	const collectionAddress = use$(
		buyModal$.state.order.collectionContractAddress,
	) as Hex;
	const collectibleId = use$(buyModal$.state.order.tokenId);
	const callbacks = use$(buyModal$.callbacks);
	const order = use$(buyModal$.state.order);
	const isOpen = use$(buyModal$.isOpen);
	const checkoutModalIsLoading = use$(buyModal$.state.checkoutModalIsLoading);
	const setCheckoutModalIsLoading = use$(buyModal$.setCheckoutModalIsLoading);
	const setCheckoutModalLoaded = use$(buyModal$.setCheckoutModalLoaded);

	const { collection, collectable, checkoutOptions, isLoading, isError } =
		useLoadData({
			chainId: Number(chainId),
			collectionAddress,
			collectibleId,
			orderId: order.orderId,
			marketplace: order.marketplace,
		});

	const {
		buy,
		isLoading: buyIsLoading,
		isError: buyIsError,
	} = useBuyCollectable({
		chainId,
		collectionAddress,
		callbacks,
		tokenId: collectibleId,
		priceCurrencyAddress: order.priceCurrencyAddress,
		setCheckoutModalIsLoading,
		setCheckoutModalLoaded,
	});

	const buyAction = (input: BuyInput) => {
		if (buy && checkoutOptions) {
			buy({ ...input, checkoutOptions });
			buyModal$.state.purchaseProcessing.set(true);
		} else {
			console.error('buy is null or undefined');
		}
	};

	if (
		isLoading ||
		checkoutModalIsLoading ||
		!collection ||
		!collectable ||
		!checkoutOptions ||
		buyIsLoading
	) {
		return (
			<LoadingModal
				isOpen={isOpen}
				chainId={Number(chainId)}
				onClose={buyModal$.close}
				title="Loading Sequence Pay"
			/>
		);
	}

	if (buyIsError || isError) {
		return (
			<ErrorModal
				isOpen={isOpen}
				chainId={Number(chainId)}
				onClose={buyModal$.close}
				title="Error"
			/>
		);
	}

	if (buyModal$.state.purchaseProcessing.get()) {
		return null;
	}

	return collection.type === ContractType.ERC721 ? (
		<CheckoutModal
			buy={buyAction}
			collectable={collectable as TokenMetadata}
			order={order}
		/>
	) : (
		<ERC1155QuantityModal
			buy={buyAction}
			collectable={collectable as TokenMetadata}
			order={order}
			chainId={chainId}
			collectionAddress={collectionAddress}
			collectibleId={collectibleId}
		/>
	);
};
