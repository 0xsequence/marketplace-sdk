import type { Hex } from 'viem';
import { buyModal$ } from './_store';
import { ContractType, MarketplaceKind, type Order } from '../../../_internal';
import { observer, Show } from '@legendapp/state/react';
import { useCollectible, useCollection } from '../../../hooks';
import { ActionModal } from '../_internal/components/actionModal';
import { useEffect } from 'react';
import QuantityInput from '..//_internal/components/quantityInput';
import type { ModalCallbacks } from '../_internal/types';
import { TokenMetadata } from '@0xsequence/indexer';
import useBuy from '../../../hooks/useBuy';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';

export type ShowBuyModalArgs = {
	chainId: string;
	collectionAddress: Hex;
	collectibleId: string;
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
	const { order, modalId } = buyModal$.get().state;
	const callbacks = buyModal$.get().callbacks;
	const chainId = String(order.chainId);
	const collectionAddress = order.collectionContractAddress as Hex;
	const collectibleId = order.tokenId;

	const {
		data: collection,
		isLoading: collectionLoading,
		isError: collectionError,
	} = useCollection({
		chainId,
		collectionAddress,
	});

	const {
		data: collectable,
		isLoading: collectibleLoading,
		isError: collectibleError,
	} = useCollectible({
		chainId,
		collectionAddress,
		collectibleId,
	});
	const { execute } = useBuy({
		closeModalFn: buyModal$.close,
		collectibleId,
		collectionAddress,
		chainId,
		orderId: order.orderId,
		collectableDecimals: collectable?.decimals || 0,
		marketplace: order.marketplace,
		quantity: '1',
		callbacks: callbacks || {},
	});

	if (collectionLoading || collectibleLoading) {
		return (
			<LoadingModal
				store={buyModal$}
				onClose={buyModal$.close}
				title="You have an offer"
			/>
		);
	}

	if (collectionError || collectibleError) {
		return (
			<ErrorModal
				store={buyModal$}
				onClose={buyModal$.close}
				title="You have an offer"
			/>
		);
	}

	//TODO: Handle this better
	if (modalId == 0 || !collection || !collectable) return null;

	return collection.type === ContractType.ERC721 ? (
		<CheckoutModal
			key={modalId}
			buy={execute}
			collectable={collectable}
			order={buyModal$.state.order.get()}
		/>
	) : (
		<ERC1155QuantityModal
			buy={execute}
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
	}) => Promise<void>;
	collectable: TokenMetadata;
	order: Order;
}

function CheckoutModal({ buy, collectable, order }: CheckoutModalProps) {
	useEffect(() => {
		const executeBuy = async () => {
			if (!collectable) return;

			await buy({
				orderId: order.orderId,
				collectableDecimals: collectable.decimals || 0,
				quantity: '1',
				marketplace: order.marketplace,
			});

			buyModal$.close();
		};

		executeBuy();
	}, []);

	return <></>;
}

interface ERC1155QuantityModalProps extends CheckoutModalProps {
	chainId: string;
	collectionAddress: Hex;
	collectibleId: string;
}

const ERC1155QuantityModal = observer(
	({
		buy,
		collectable,
		order,
		chainId,
		collectionAddress,
		collectibleId,
	}: ERC1155QuantityModalProps) => {
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
	},
);
