import type { TokenMetadata } from '@0xsequence/indexer';
import { Show, observer, useSelector } from '@legendapp/state/react';
import { useEffect } from 'react';
import type { Hex } from 'viem';
import { ContractType, type Order } from '../../../_internal';
import type { BuyInput } from '../../../_internal/transaction-machine/execute-transaction';
import { useCollectible, useCollection } from '../../../hooks';
import { useBuyCollectable } from '../../../hooks/useBuyCollectable';
import QuantityInput from '..//_internal/components/quantityInput';
import { ActionModal } from '../_internal/components/actionModal';
import type { ModalCallbacks } from '../_internal/types';
import { buyModal$ } from './_store';

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
	const chainId = String(useSelector(buyModal$.state.order.chainId));
	const collectionAddress = useSelector(
		buyModal$.state.order.collectionContractAddress,
	) as Hex;
	const collectibleId = useSelector(buyModal$.state.order.tokenId);
	const modalId = useSelector(buyModal$.state.modalId);

	const { data: collection } = useCollection({
		chainId,
		collectionAddress,
	});

	const { buy, isLoading } = useBuyCollectable({
		chainId,
		collectionAddress,
		onError: buyModal$.callbacks.get()?.onError,
		onSuccess: (hash) => {
			buyModal$.callbacks.get()?.onSuccess?.(hash);
			buyModal$.close();
		},
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
			isLoading={isLoading}
		/>
	) : (
		<ERC1155QuantityModal
			buy={buy}
			collectable={collectable}
			order={buyModal$.state.order.get()}
			chainId={chainId}
			collectionAddress={collectionAddress}
			collectibleId={collectibleId}
			isLoading={isLoading}
		/>
	);
};

interface CheckoutModalProps {
	buy: (props: BuyInput) => void;
	collectable: TokenMetadata;
	order: Order;
	isLoading?: boolean;
}

function CheckoutModal({
	buy,
	collectable,
	order,
	isLoading,
}: CheckoutModalProps) {
	useEffect(() => {
		const executeBuy = () => {
			if (isLoading) return;
			buy({
				orderId: order.orderId,
				collectableDecimals: collectable.decimals || 0,
				quantity: '1',
				marketplace: order.marketplace,
			});
		};

		executeBuy();
	}, [isLoading]);

	return null;
}

interface ERC1155QuantityModalProps extends CheckoutModalProps {
	chainId: string;
	collectionAddress: Hex;
	collectibleId: string;
}

const ERC1155QuantityModal = observer(
	({ buy, collectable, order }: ERC1155QuantityModalProps) => {
		buyModal$.state.quantity.set(
			Math.max(Number(order.quantityRemaining), 1).toString(),
		);

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
							});
							buyModal$.close();
						},
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
	},
);
