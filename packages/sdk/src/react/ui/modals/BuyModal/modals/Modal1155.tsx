import { Box, Text, TokenImage } from '@0xsequence/design-system';
import { use$ } from '@legendapp/state/react';
import type { Address, Hex } from 'viem';
import { formatUnits, parseUnits } from 'viem';
import { useCurrencies } from '../../../../hooks';
import { useCurrencyOptions } from '../../../../hooks/useCurrencyOptions';
import QuantityInput from '../../_internal/components/quantityInput';
import { ActionModal } from '../../_internal/components/actionModal';
import { buyModal$ } from '../store';
import type { CheckoutModalProps } from './CheckoutModal';
import { useEffect } from 'react';

interface ERC1155QuantityModalProps extends CheckoutModalProps {
	chainId: string;
	collectionAddress: Hex;
	collectibleId: string;
}

export function ERC1155QuantityModal({
	buy,
	collectable,
	order,
}: ERC1155QuantityModalProps) {
	useEffect(() => {
		buyModal$.quantity.set(
			Math.min(Number(order.quantityRemaining), 1).toString(),
		);
	}, []);

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

	const quantity = Number(use$(buyModal$.quantity));
	const pricePerToken = order.priceAmount;
	const totalPrice = (BigInt(quantity) * BigInt(pricePerToken)).toString();

	return (
		<ActionModal
			isOpen={use$(buyModal$.isOpen)}
			chainId={order.chainId}
			onClose={() => buyModal$.close()}
			title="Select Quantity"
			ctas={[
				{
					label: 'Buy now',
					onClick: () => {
						buy({
							quantity: parseUnits(
								quantity.toString(),
								collectable.decimals || 0,
							).toString(),
							orderId: order.orderId,
							collectableDecimals: collectable.decimals || 0,
							marketplace: order.marketplace,
						});
					},
				},
			]}
		>
			<Box display="flex" flexDirection="column" gap="4">
				<QuantityInput
					$quantity={buyModal$.quantity}
					$invalidQuantity={buyModal$.invalidQuantity}
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
}
