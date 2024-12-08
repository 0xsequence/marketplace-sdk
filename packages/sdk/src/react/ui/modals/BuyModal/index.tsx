import type { Hex } from 'viem';
import { buyModal$ } from './_store';
import { ContractType, MarketplaceKind, type Order } from '../../../_internal';
import { observer, Show, useSelector } from '@legendapp/state/react';
import { useCollectible, useCollection } from '../../../hooks';
import { ActionModal } from '../_internal/components/actionModal';
import { useEffect } from 'react';
import QuantityInput from '..//_internal/components/quantityInput';
import { useBuyCollectable } from '../../../hooks/useBuyCollectable';
import type { ModalCallbacks } from '../_internal/types';
import { TokenMetadata } from '@0xsequence/indexer';

export type ShowBuyModalArgs = {
	chainId: string;
	collectionAddress: Hex;
	tokenId: string;
	order: Order;
};

export const useBuyModal = (callbacks?: ModalCallbacks) => {
	return {
		show: (args: ShowBuyModalArgs) =>
			buyModal$.open({ ...args, defaultCallbacks: callbacks }),
		close: () => buyModal$.close(),
	};
};

export const BuyModal = () => (
	<Show if={buyModal$.isOpen}>
		<BuyModalContent />
	</Show>
);

export const BuyModalContent = () => {
	const chainId = String(useSelector(buyModal$.state.order.chainId))
	const collectionAddress = useSelector(buyModal$.state.order.collectionContractAddress) as Hex
	const collectibleId = useSelector(buyModal$.state.order.tokenId)
	const modalId = useSelector(buyModal$.state.modalId)

	const { data: collection } = useCollection({
		chainId,
		collectionAddress,
	});

	const { buy } = useBuyCollectable({
		chainId,
		collectionAddress,
		onError: buyModal$.callbacks.get()?.onError,
		onSuccess: (hash) => {
			buyModal$.callbacks.get()?.onSuccess?.(hash);
			buyModal$.close();
		}
	});

	const { data: collectable } = useCollectible({
		chainId,
		collectionAddress,
		collectibleId,
	});

	if (modalId == 0 || !collection || !collectable || !buy) return null;

	return collection.type === ContractType.ERC721 ? (
		<CheckoutModal
			key={modalId}
			buy={buy}
			collectable={collectable}
			order={buyModal$.state.order.get()}
		/>
	) : (
		<ERC1155QuantityModal
			buy={buy}
			collectable={collectable}
			order={buyModal$.state.order.get()}
			chainId={chainId}
			collectionAddress={collectionAddress}
			collectibleId={collectibleId}
		/>
	);
};

interface CheckoutModalProps {
	buy: (params: {
		orderId: string;
		collectableDecimals: number;
		quantity: string;
		marketplace: MarketplaceKind;
	}) => void;
	collectable: TokenMetadata;
	order: Order;
}

function CheckoutModal({ buy, collectable, order }: CheckoutModalProps) {
	useEffect(() => {
		const executeBuy = () => {
			console.log('executeBuy');
			if (!collectable) return;
			buy({
				orderId: order.orderId,
				collectableDecimals: collectable.decimals || 0,
				quantity: '1',
				marketplace: order.marketplace,
			});
		};

		executeBuy();
	}, []);

	return null;
}

interface ERC1155QuantityModalProps extends CheckoutModalProps {
	chainId: string;
	collectionAddress: Hex;
	collectibleId: string;
}

const ERC1155QuantityModal = observer(({
	buy,
	collectable,
	order,
}: ERC1155QuantityModalProps) => {
	buyModal$.state.quantity.set(Math.max(Number(order.quantityRemaining), 1).toString());

	return (
		<ActionModal
			store={buyModal$}
			onClose={() => buyModal$.close()}
			title="Select Quantity"
			ctas={[
				{
					label: 'Select Quantity',
					onClick: () => {
						buy({
							quantity: buyModal$.state.quantity.get(),
							orderId: order.orderId,
							collectableDecimals: collectable.decimals || 0,
							marketplace: order.marketplace,
						})
					}
				},
			]}
		>
			<QuantityInput
				$quantity={buyModal$.state.quantity}
				$invalidQuantity={buyModal$.state.invalidQuantity}
				decimals={order.quantityDecimals}
				maxQuantity={order.quantityRemaining}
			/>
		</ActionModal>
	);
});
