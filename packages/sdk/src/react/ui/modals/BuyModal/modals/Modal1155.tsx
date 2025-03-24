'use client';

import { Box } from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import type { Hex } from 'viem';
import { parseUnits } from 'viem';

// import { useCurrency } from '../../../../hooks';
import { ActionModal } from '../../_internal/components/actionModal';
import QuantityInput from '../../_internal/components/quantityInput';
import { buyModal$ } from '../store';
import type { CheckoutModalProps } from './CheckoutModal';

interface ERC1155QuantityModalProps extends CheckoutModalProps {
	chainId: string;
	collectionAddress: Hex;
	collectibleId: string | undefined;
}

export const ERC1155QuantityModal = observer(
	({ buy, collectable, order }: ERC1155QuantityModalProps) => {
		// const { data: marketplaceConfig } = useMarketplaceConfig();
		// const { data: currency, isLoading: isCurrencyLoading } = useCurrency({
		// 	chainId: order.chainId,
		// 	currencyAddress: order.priceCurrencyAddress,
		// });
		// const quantity = Number(buyModal$.state.quantity.get());
		// const pricePerToken = BigInt(order.priceAmount);
		// const marketplaceFeePercentage =
		// 	marketplaceConfig?.collections.find((collection) =>
		// 		compareAddress(collection.address, order.collectionContractAddress),
		// 	)?.feePercentage || DEFAULT_MARKETPLACE_FEE_PERCENTAGE;
		// const price = BigInt(quantity) * pricePerToken;
		// const totalPrice =
		// 	price +
		// 	(price *
		// 		BigInt(Math.round(Number(marketplaceFeePercentage || 0) * 100))) /
		// 		BigInt(10000);

		if (
			buyModal$.state.checkoutModalLoaded.get() &&
			buyModal$.isOpen.get() &&
			buyModal$.state.checkoutModalIsLoading.get() &&
			buyModal$.state.purchaseProcessing.get()
		) {
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
							buyModal$.state.purchaseProcessing.set(true);

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
					{/* <Box display="flex" justifyContent="space-between">
						<Text color="text50" fontSize="small" fontFamily="body">
							Total Price
						</Text>
						<Box display="flex" alignItems="center" gap="2">
							{isCurrencyLoading || !currency ? (
								<Box display="flex" alignItems="center" gap="2">
									<Text color="text50" fontSize="small" fontFamily="body">
										Loading...
									</Text>
								</Box>
							) : (
								<>
									{currency.imageUrl && (
										<TokenImage src={currency.imageUrl} size="xs" />
									)}

									<Text
										color="text100"
										fontSize="small"
										fontWeight="bold"
										fontFamily="body"
									>
										{formatPrice(totalPrice, currency.decimals)}
									</Text>

									<Text color="text80" fontSize="small" fontFamily="body">
										{currency?.symbol}
									</Text>
								</>
							)}
						</Box>  
					</Box>*/}
				</Box>
			</ActionModal>
		);
	},
);
