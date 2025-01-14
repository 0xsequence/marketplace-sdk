import { use$ } from '@legendapp/state/react';
import type { Hex } from 'viem';
import { ContractType, TokenMetadata } from '../../../_internal';
import { buyModal$ } from './store';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import { CheckoutModal } from './modals/CheckoutModal';
import { ERC1155QuantityModal } from './modals/Modal1155';
import { useLoadData } from './hooks/useLoadData';
import { useBuyCollectable } from './hooks/useBuyCollectable';

export const BuyModal = () => {
	const isOpen = use$(buyModal$.isOpen);

	if (!isOpen) return null;

	return <BuyModalContent />
}

const BuyModalContent = () => {
	const chainId = String(use$(buyModal$.state.order.chainId));
	const collectionAddress = use$(
		buyModal$.state.order.collectionContractAddress,
	) as Hex;
	const collectibleId = use$(buyModal$.state.order.tokenId);
	const modalId = use$(buyModal$.state.modalId);
	const callbacks = use$(buyModal$.callbacks);
	const order = use$(buyModal$.state.order);
	const isOpen = use$(buyModal$.isOpen);

	const { collection, collectable, checkoutOptions, isLoading } = useLoadData({
		chainId: Number(chainId),
		collectionAddress,
		collectibleId,
		orderId: order.orderId,
		marketplace: order.marketplace,
	});

	const { buy, isLoading: buyIsLoading, isError: buyIsError } = useBuyCollectable({
		chainId,
		collectionAddress,
		callbacks,
		tokenId: collectibleId,
		priceCurrencyAddress: order.priceCurrencyAddress,
	});

	if (isLoading || !collection || !collectable || !checkoutOptions || buyIsLoading || buyIsError) {
		return (
			<LoadingModal
				isOpen={isOpen}
				chainId={Number(chainId)}
				onClose={buyModal$.close}
				title="Loading Sequence Pay"
			/>
		);
	}

	return collection.type === ContractType.ERC721 ? (
		<CheckoutModal
			key={modalId}
			buy={(input) => buy({ ...input, checkoutOptions })}
			collectable={collectable as TokenMetadata}
			order={order}
		/>
	) : (
		<ERC1155QuantityModal
			buy={(input) => buy({ ...input, checkoutOptions })}
			collectable={collectable as TokenMetadata}
			order={order}
			chainId={chainId}
			collectionAddress={collectionAddress}
			collectibleId={collectibleId}
		/>
	);
};
