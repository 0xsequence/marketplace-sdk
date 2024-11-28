import type { Hex } from 'viem';
import { buyModal$ } from './_store';
import { ContractType, type Order } from '../../../_internal';
import { observer, useSelector } from '@legendapp/state/react';
import { useCollectible, useCollection } from '../../../hooks';
import { ActionModal } from '../_internal/components/actionModal';
import { useEffect } from 'react';
import QuantityInput from '../_internal/components/quantityInput';
import { useBuyCollectable } from '../../../hooks/useBuyCollectable';

export type ShowBuyModalArgs = {
	chainId: string;
	collectionAddress: Hex;
	tokenId: string;
	order: Order;
};

export const useBuyModal = () => {
	return {
		show: (args: ShowBuyModalArgs) => buyModal$.open(args),
		close: () => buyModal$.close(),
	};
};

export const BuyModal = () => {
	const isOpen = useSelector(buyModal$.isOpen);
	const { data: collection } = useCollection({
		chainId: buyModal$.state.order.chainId.get(),
		collectionAddress: buyModal$.state.order.collectionContractAddress.get(),
	});

	if (!isOpen || !collection) return null;

	return collection.type === ContractType.ERC721 ? (
		<CheckoutModal />
	) : (
		<ERC1155QuantityModal />
	);
};

const CheckoutModal = observer(() => {
	const order = buyModal$.state.order.get();
	const chainId = String(order.chainId);
	const collectionAddress = order.collectionContractAddress as Hex;
	const collectibleId = order.tokenId;

	const { buy } = useBuyCollectable({
		chainId,
		collectionAddress,
	});

	const { data: collectable } = useCollectible({
		chainId,
		collectionAddress,
		collectibleId,
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!collectable) return;
		buy({
			orderId: order.orderId,
			collectableDecimals: collectable.decimals || 0,
			quantity: '1',
			marketplace: order.marketplace,
		});
	}, [order, collectable]);

	return <></>;
});

const ERC1155QuantityModal = observer(() => {
	const order = buyModal$.state.order.get();
	const chainId = String(order.chainId);
	const collectionAddress = order.collectionContractAddress as Hex;
	const collectibleId = order.tokenId;

	const { buy } = useBuyCollectable({
		chainId,
		collectionAddress,
	});

	const { data: collectable } = useCollectible({
		chainId,
		collectionAddress,
		collectibleId,
	});

	if (!order || !collectable) return null;

	return (
		<ActionModal
			store={buyModal$}
			onClose={() => buyModal$.close()}
			title="Select Quantity"
			ctas={[
				{
					label: 'Select Quantity',
					onClick: () =>
						buy({
							quantity: buyModal$.state.quantity.get(),
							orderId: order.orderId,
							collectableDecimals: collectable.decimals || 0,
							marketplace: order.marketplace,
						}),
				},
			]}
		>
			<QuantityInput
				chainId={chainId}
				collectionAddress={collectionAddress}
				collectibleId={collectibleId}
				$quantity={buyModal$.state.quantity}
			/>
		</ActionModal>
	);
});
