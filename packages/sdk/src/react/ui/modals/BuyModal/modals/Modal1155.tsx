import { Box, Text, TokenImage } from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import type { Address, Hex } from 'viem';
import { formatUnits, parseUnits } from 'viem';
import { useCurrencies } from '../../../../hooks';
import { useCurrencyOptions } from '../../../../hooks/useCurrencyOptions';
import QuantityInput from '../../_internal/components/quantityInput';
import { ActionModal } from '../../_internal/components/actionModal';
import { buyModal$ } from '../store';
import type { CheckoutModalProps } from './CheckoutModal';

interface ERC1155QuantityModalProps extends CheckoutModalProps {
	chainId: string;
	collectionAddress: Hex;
	collectibleId: string;
}

export const ERC1155QuantityModal = observer(
	({ buy, collectable, order }: ERC1155QuantityModalProps) => {
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

		if (buyModal$.state.checkoutModalLoaded.get()) {
			return null;
		}

		return (
			<ActionModal
				isOpen={buyModal$.isOpen.get()}
				chainId={order.chainId}
				onClose={() => buyModal$.close()}
				title="Select Quantity"
				ctas={[
					{
						label: 'Buy now',
						onClick: () => {
							buyModal$.state.checkoutModalIsLoading.set(true);

							buy({
								quantity: parseUnits(
									buyModal$.state.quantity.get(),
									collectable.decimals || 0,
								).toString(),
								orderId: order.orderId,
								collectableDecimals: collectable.decimals || 0,
								marketplace: order.marketplace,
							});
						},
						disabled: buyModal$.state.checkoutModalIsLoading.get(),
						pending: buyModal$.state.checkoutModalIsLoading.get(),
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
