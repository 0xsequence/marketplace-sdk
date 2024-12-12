import { Box, TokenImage, Text } from '@0xsequence/design-system';
import { ContractType, type TokenMetadata } from '@0xsequence/indexer';
import { Show, observer } from '@legendapp/state/react';
import { useEffect } from 'react';
import { type Hex, formatUnits, parseUnits } from 'viem';
import type { Order } from '../../../_internal';
import type { BuyInput } from '../../../_internal/transaction-machine/execute-transaction';
import { useCollectible, useCollection, useCurrencies } from '../../../hooks';
import useBuy from '../../../hooks/useBuy';
import { ActionModal } from '../_internal/components/actionModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import { LoadingModal } from '../_internal/components/actionModal/LoadingModal';
import QuantityInput from '../_internal/components/quantityInput';
import type { ModalCallbacks } from '../_internal/types';
import { buyModal$ } from './_store';

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

	const {
		data: collectable,
		isLoading: collectibleLoading,
		isError: collectibleError,
	} = useCollectible({
		chainId,
		collectionAddress,
		collectibleId,
	});

	const isLoading = collectibleLoading || collectionLoading;

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
		const executeBuy = async () => {
			if (!collectable) return;

			await buy({
				orderId: order.orderId,
				collectableDecimals: collectable.decimals || 0,
				quantity: parseUnits('1', collectable.decimals || 0).toString(),
				marketplace: order.marketplace,
			});

			buyModal$.close();
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
			Math.min(Number(order.quantityRemaining), 1).toString(),
		);

		const { data: currencies } = useCurrencies({
			chainId: order.chainId,
			collectionAddress: order.collectionContractAddress,
		});

		const currency = currencies?.find(
			(currency) => currency.contractAddress === order.priceCurrencyAddress,
		);

		const quantity = Number(buyModal$.state.quantity.get());
		const pricePerToken = order.priceAmount;
		const totalPrice = (BigInt(quantity) * BigInt(pricePerToken)).toString();

		return (
			<ActionModal
				store={buyModal$}
				onClose={() => buyModal$.close()}
				title="Select Quantity"
				ctas={[
					{
						label: 'Buy now',
						onClick: () => {
							buy({
								quantity: parseUnits(
									buyModal$.state.quantity.get(),
									collectable.decimals || 0,
								).toString(),
								orderId: order.orderId,
								collectableDecimals: collectable.decimals || 0,
								marketplace: order.marketplace,
							});
							buyModal$.close();
						},
					},
				]}
			>
				<Box display="flex" flexDirection="column" gap="4">
					<QuantityInput
						$quantity={buyModal$.state.quantity}
						$invalidQuantity={buyModal$.state.invalidQuantity}
						decimals={order.quantityDecimals}
						maxQuantity={order.quantityRemaining}
					/>
					<Box display="flex" flexDirection="column" gap="2">
						<Text color="text50" fontSize="small">
							Total Price
						</Text>
						<Box display="flex" alignItems="center" gap="2">
							<TokenImage src={currency?.imageUrl} size="xs" />
							<Text color="text" fontSize="large" fontWeight="bold">
								{formatUnits(BigInt(totalPrice), currency?.decimals || 0)}
							</Text>
						</Box>
					</Box>
				</Box>
			</ActionModal>
		);
	},
);
