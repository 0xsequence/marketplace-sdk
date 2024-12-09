import type { Hex } from 'viem';
import { buyModal$ } from './_store';
import { ContractType, MarketplaceKind, type Order } from '../../../_internal';
import { observer, Show, useSelector } from '@legendapp/state/react';
import { useCollectible, useCollection } from '../../../hooks';
import { ActionModal } from '../_internal/components/actionModal';
import { useEffect, useState } from 'react';
import QuantityInput from '..//_internal/components/quantityInput';
import type { ModalCallbacks } from '../_internal/types';
import { TokenMetadata } from '@0xsequence/indexer';
import {
	TransactionState,
	TransactionType,
} from '../../../_internal/transaction-machine/execute-transaction';
import { useTransactionMachine } from '../../../_internal/transaction-machine/useTransactionMachine';

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

	const { data: collectable } = useCollectible({
		chainId,
		collectionAddress,
		collectibleId,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [transactionState, setTransactionState] =
		useState<TransactionState | null>(null);
	const machine = useTransactionMachine(
		{
			collectionAddress,
			chainId,
			collectibleId,
			type: TransactionType.BUY,
		},
		(hash) => {
			console.log('Transaction hash', hash);
		},
		(error) => {
			console.error('Transaction error', error);
		},
		buyModal$.close,
		(hash) => {
			console.log('Transaction sent', hash);
		},
	);

	useEffect(() => {
		if (!machine || transactionState?.steps.checked) return;

		machine
			.refreshStepsGetState({
				orderId: buyModal$.state.order.get().orderId,
				collectableDecimals: collectable?.decimals || 0,
				marketplace: buyModal$.state.order.get().marketplace,
				quantity: buyModal$.state.quantity.get(),
			})
			.then((state) => {
				if (!state.steps) return;

				setTransactionState(state);
				setIsLoading(false);
			})
			.catch((error) => {
				console.error('Error loading make offer steps', error);
				setIsLoading(false);
			});
	}, [machine, buyModal$.state.order, collectable]);

	//TODO: Handle this better
	if (modalId == 0 || !collection || !collectable || isLoading) return null;

	const handleStepExecution = async () => {
		await transactionState?.transaction.execute({
			type: TransactionType.BUY,
			props: {
				orderId: buyModal$.state.order.get().orderId,
				collectableDecimals: collectable.decimals || 0,
				quantity: buyModal$.state.quantity.get(),
				marketplace: buyModal$.state.order.get().marketplace,
			},
		});
	};

	return collection.type === ContractType.ERC721 ? (
		<CheckoutModal
			key={modalId}
			buy={handleStepExecution}
			collectable={collectable}
			order={buyModal$.state.order.get()}
		/>
	) : (
		<ERC1155QuantityModal
			buy={handleStepExecution}
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
