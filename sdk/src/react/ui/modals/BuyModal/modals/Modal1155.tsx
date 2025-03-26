'use client';

import { observer } from '@legendapp/state/react';
import * as dn from 'dnum';
import type { Hex } from 'viem';

import { Text, TokenImage } from '@0xsequence/design-system';
import { DEFAULT_MARKETPLACE_FEE_PERCENTAGE } from '../../../../../consts';
import { compareAddress } from '../../../../../utils/address';
import type { Order } from '../../../../_internal';
import { useCurrency, useMarketplaceConfig } from '../../../../hooks';
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
				disableAnimation={true}
				ctas={[
					{
						label: 'Buy now',
						onClick: () => {
							buyModal$.state.checkoutModalIsLoading.set(true);
							buyModal$.state.purchaseProcessing.set(true);

							buy({
								quantity: buyModal$.state.quantity.get(),
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
				<div className="flex w-full flex-col gap-4">
					<QuantityInput
						$quantity={buyModal$.state.quantity}
						$invalidQuantity={buyModal$.state.invalidQuantity}
						decimals={order.quantityDecimals}
						maxQuantity={order.quantityRemaining}
					/>

					<TotalPrice order={order} />
				</div>
			</ActionModal>
		);
	},
);

const TotalPrice = observer(({ order }: { order: Order }) => {
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const { data: currency, isLoading: isCurrencyLoading } = useCurrency({
		chainId: order.chainId,
		currencyAddress: order.priceCurrencyAddress,
	});

	const quantityStr = buyModal$.state.quantity.get();

	let formattedPrice = '0';

	if (currency) {
		const quantity = BigInt(quantityStr);
		const totalPriceWithoutFees = dn.format(
			dn.multiply(quantity, order.priceAmountFormatted),
			{
				digits: currency.decimals,
				trailingZeros: false,
			},
		);
		const marketplaceFeePercentage =
			marketplaceConfig?.collections.find((collection) =>
				compareAddress(collection.address, order.collectionContractAddress),
			)?.feePercentage || DEFAULT_MARKETPLACE_FEE_PERCENTAGE;
		const feeMultiplier = dn.from(1 + marketplaceFeePercentage / 100);
		const totalPrice = dn.format(
			dn.multiply(totalPriceWithoutFees, feeMultiplier),
			{
				digits: currency.decimals,
				trailingZeros: false,
			},
		);

		formattedPrice = totalPrice;
	}

	return (
		<div className="flex justify-between">
			<Text className="font-body font-medium text-xs" color="text50">
				Total Price
			</Text>

			<div className="flex items-center gap-0.5">
				{isCurrencyLoading || !currency ? (
					<div className="flex items-center gap-2">
						<Text className="font-body text-text-50 text-xs">Loading...</Text>
					</div>
				) : (
					<>
						{currency.imageUrl && (
							<TokenImage src={currency.imageUrl} size="xs" />
						)}

						<Text className="font-body font-bold text-text-100 text-xs">
							{formattedPrice}
						</Text>

						<Text className="font-body font-bold text-text-80 text-xs">
							{currency?.symbol}
						</Text>
					</>
				)}
			</div>
		</div>
	);
});
