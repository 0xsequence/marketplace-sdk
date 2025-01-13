import { Show, useSelector } from '@legendapp/state/react';
import type { Hex } from 'viem';
import { ContractType, TokenMetadata } from '../../../_internal';
import { buyModal$ } from './store';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import { CheckoutModal } from './modals/CheckoutModal';
import { ERC1155QuantityModal } from './modals/Modal1155';
import { useLoadData } from './hooks/useLoadData';
import { useBuyCollectable } from './hooks/useBuyCollectable';

export const BuyModal = () => (
	<Show if={buyModal$.isOpen}>{() => <BuyModalContent />}</Show>
);

const BuyModalContent = () => {
	const chainId = String(useSelector(buyModal$.state.order.chainId));
	const collectionAddress = useSelector(
		buyModal$.state.order.collectionContractAddress,
	) as Hex;
	const collectibleId = useSelector(buyModal$.state.order.tokenId);
	const modalId = useSelector(buyModal$.state.modalId);
	const callbacks = useSelector(buyModal$.callbacks);
	const order = useSelector(buyModal$.state.order);

	const { collection, collectable, checkoutOptions, isLoading } = useLoadData({
		chainId: Number(chainId),
		collectionAddress,
		collectibleId,
		orderId: order.orderId,
		marketplace: order.marketplace,
	});

	const { buy } = useBuyCollectable({
		chainId,
		collectionAddress,
		callbacks,
		tokenId: collectibleId,
		priceCurrencyAddress: order.priceCurrencyAddress,
	});

	if (isLoading || !collection || !collectable || !checkoutOptions) {
		return (
			<LoadingModal
				isOpen={buyModal$.isOpen.get()}
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
