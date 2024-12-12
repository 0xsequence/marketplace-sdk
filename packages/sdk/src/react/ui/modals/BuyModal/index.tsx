import { ContractType, TokenMetadata } from "@0xsequence/indexer";
import { Show, observer } from "@legendapp/state/react";
import { useEffect } from "react";
import { Hex } from "viem";
import { Order } from "../../../_internal";
import { BuyInput } from "../../../_internal/transaction-machine/execute-transaction";
import { useCollection, useCollectible } from "../../../hooks";
import useBuy from "../../../hooks/useBuy";
import { useBuyCollectable } from "../../../hooks/useBuyCollectable";
import { ActionModal } from "../_internal/components/actionModal";
import { LoadingModal } from "../_internal/components/actionModal/LoadingModal";
import { ErrorModal } from "../_internal/components/actionModal/ErrorModal";
import QuantityInput from "../_internal/components/quantityInput";
import { ModalCallbacks } from "../_internal/types";
import { buyModal$ } from "./_store";

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

export const BuyModalContent = observer(() => {
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

	const { buy, isLoading } = useBuyCollectable({
		chainId,
		collectionAddress,
		onError: buyModal$.callbacks.get()?.onError,
		onSuccess: (hash) => {
			buyModal$.callbacks.get()?.onSuccess?.(hash);
			buyModal$.close();
		},
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

	if (modalId === 0 || !collection || !collectable) return null;

	return collection.type === ContractType.ERC721 ? (
		<CheckoutModal
			key={modalId}
			buy={execute}
			collectable={collectable}
			order={buyModal$.state.order.get()}
			isLoading={isLoading}
		/>
	) : (
		<ERC1155QuantityModal
			buy={execute}
			collectable={collectable}
			order={buyModal$.state.order.get()}
			chainId={chainId}
			collectionAddress={collectionAddress}
			collectibleId={collectibleId}
			isLoading={isLoading}
		/>
	);
});

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
