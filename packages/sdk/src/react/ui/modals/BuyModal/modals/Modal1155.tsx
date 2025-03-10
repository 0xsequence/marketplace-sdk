import { Text, TokenImage } from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import type { Hex } from 'viem';
import { parseUnits } from 'viem';
import {
	DEFAULT_MARKETPLACE_FEE_PERCENTAGE,
	compareAddress,
	formatPrice,
} from '../../../../..';
import { useCurrency, useMarketplaceConfig } from '../../../../hooks';
import { ActionModal } from '../../_internal/components/actionModal';
import QuantityInput from '../../_internal/components/quantityInput';
import { buyModal$ } from '../store';
import type { CheckoutModalProps } from './CheckoutModal';

interface ERC1155QuantityModalProps extends CheckoutModalProps {
	chainId: string;
	collectionAddress: Hex;
	collectibleId: string;
}

export const ERC1155QuantityModal = observer(
	({ buy, collectable, order }: ERC1155QuantityModalProps) => {
		const { data: marketplaceConfig } = useMarketplaceConfig();
		const { data: currency, isLoading: isCurrencyLoading } = useCurrency({
			chainId: order.chainId,
			currencyAddress: order.priceCurrencyAddress,
		});
		const quantity = Number(buyModal$.state.quantity.get());
		const pricePerToken = order.priceAmount;
		const marketplaceFeePercentage =
			marketplaceConfig?.collections.find((collection) =>
				compareAddress(collection.address, order.collectionContractAddress),
			)?.feePercentage || DEFAULT_MARKETPLACE_FEE_PERCENTAGE;
		const price = Number(quantity) * Number(pricePerToken);
		const totalPrice =
			price + (price * Number(marketplaceFeePercentage || 0)) / 100;

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
				<div className="flex flex-col gap-4">
					<QuantityInput
						$quantity={buyModal$.state.quantity}
						$invalidQuantity={buyModal$.state.invalidQuantity}
						decimals={order.quantityDecimals}
						maxQuantity={order.quantityRemaining}
					/>
					<div className="flex justify-between">
						<Text className="text-sm font-body" color="text50">
							Total Price
						</Text>
						<div className="flex items-center gap-2">
							{isCurrencyLoading || !currency ? (
								<div className="flex items-center gap-2">
									<Text className="text-sm font-body" color="text50">
										Loading...
									</Text>
								</div>
							) : (
								<>
									{currency.imageUrl && (
										<TokenImage src={currency.imageUrl} size="xs" />
									)}

									<Text
										className="text-sm font-body"
										color="text100"
										fontWeight="bold"
									>
										{formatPrice(totalPrice, currency.decimals)}
									</Text>

									<Text className="text-sm font-body" color="text80">
										{currency?.symbol}
									</Text>
								</>
							)}
						</div>
					</div>
				</div>
			</ActionModal>
		);
	},
);
