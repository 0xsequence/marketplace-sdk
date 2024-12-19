import type { TokenMetadata } from '@0xsequence/indexer';
import { Box, Text, TokenImage } from '@0xsequence/design-system';
import { Show, observer, useSelector } from '@legendapp/state/react';
import { useEffect } from 'react';
import type { Address, Hex } from 'viem';
import { ContractType, type Order } from '../../../_internal';
import type { BuyInput } from '../../../_internal/transaction-machine/execute-transaction';
import { useCollectible, useCollection } from '../../../hooks';
import { useBuyCollectable } from '../../../hooks/useBuyCollectable';
import QuantityInput from '..//_internal/components/quantityInput';
import { ActionModal } from '../_internal/components/actionModal';
import type { ModalCallbacks } from '../_internal/types';
import { buyModal$ } from './_store';
import { formatUnits, parseUnits } from 'viem';
import { useCurrencies } from '../../../hooks';
import { useCurrencyOptions } from '../../../hooks/useCurrencyOptions';

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
	const callbacks = useSelector(buyModal$.callbacks);

	const { data: collection } = useCollection({
		chainId,
		collectionAddress,
	});

	const { buy, isLoading } = useBuyCollectable({
		chainId,
		collectionAddress,
		enabled: buyModal$.isOpen.get(),
		onSwitchChainRefused: () => {
			buyModal$.close();
		},
		onError: (error) => {
			if (callbacks?.onError) {
				callbacks.onError(error);
			} else {
				console.debug('onError callback not provided', error);
			}
		},
		onSuccess: (hash) => {
			if (callbacks?.onSuccess) {
				callbacks.onSuccess(hash);
			} else {
				console.debug('onSuccess callback not provided', hash);
			}
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
				quantity: parseUnits('1', collectable.decimals || 0).toString(),
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
			Math.min(Number(order.quantityRemaining), 1).toString(),
		);
		const currencyOptions = useCurrencyOptions({
			collectionAddress: order.collectionContractAddress as Address,
		});
		const { data: currencies } = useCurrencies({
			chainId: order.chainId,
			currencyOptions,
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
					<Box display="flex" justifyContent="space-between">
						<Text color="text50" fontSize="small">
							Total Price
						</Text>
						<Box display="flex" alignItems="center" gap="2">
							<TokenImage src={currency?.imageUrl} size="xs" />
							<Text color="text100" fontSize="small" fontWeight="bold">
								{formatUnits(BigInt(totalPrice), currency?.decimals || 0)}
							</Text>
						</Box>
					</Box>
				</Box>
			</ActionModal>
		);
	},
);
