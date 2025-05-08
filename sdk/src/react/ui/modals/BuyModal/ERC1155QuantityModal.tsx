'use client';

import { use$, useObservable } from '@legendapp/state/react';

import { Text, TokenImage } from '@0xsequence/design-system';
import { DEFAULT_MARKETPLACE_FEE_PERCENTAGE } from '../../../../consts';
import { compareAddress } from '../../../../utils/address';
import { formatPriceWithFee } from '../../../../utils/price';
import { MarketplaceType, type Order } from '../../../_internal';
import { useCurrency, useMarketplaceConfig } from '../../../hooks';
import { ActionModal } from '../_internal/components/actionModal';
import QuantityInput from '../_internal/components/quantityInput';
import { buyModalStore, useBuyModalProps, useIsOpen } from './store';

type Price = {
	amountRaw: string;
	currency: {
		imageUrl?: string;
		symbol: string;
		decimals: number;
	};
};

type ERC1155QuantityModalProps = {
	order?: Order;
	marketplaceType: MarketplaceType;
	quantityDecimals?: number;
	quantityRemaining?: string;
	salePrice?: Price;
	chainId: number;
};

export const ERC1155QuantityModal = ({
	order,
	quantityDecimals,
	quantityRemaining,
	salePrice,
	chainId,
	marketplaceType,
}: ERC1155QuantityModalProps) => {
	const isOpen = useIsOpen();

	const localQuantity$ = useObservable('1');
	const localQuantity = use$(localQuantity$);
	const invalidQuantity$ = useObservable(false);
	const invalidQuantity = use$(invalidQuantity$);

	return (
		<ActionModal
			isOpen={isOpen}
			chainId={chainId}
			onClose={() => buyModalStore.send({ type: 'close' })}
			title="Select Quantity"
			disableAnimation={true}
			ctas={[
				{
					label: 'Buy now',
					onClick: () => {
						buyModalStore.send({
							type: 'setQuantity',
							quantity: Number(localQuantity),
						});
					},
					disabled: invalidQuantity,
				},
			]}
		>
			<div className="flex w-full flex-col gap-4">
				<QuantityInput
					$quantity={localQuantity$}
					$invalidQuantity={invalidQuantity$}
					decimals={quantityDecimals ?? order?.quantityDecimals}
					maxQuantity={quantityRemaining ?? order?.quantityRemaining}
				/>

				<TotalPrice
					order={order}
					quantityStr={localQuantity}
					salePrice={salePrice}
					chainId={chainId}
					marketplaceType={marketplaceType}
				/>
			</div>
		</ActionModal>
	);
};

type TotalPriceProps = {
	order?: Order;
	quantityStr: string;
	salePrice?: Price;
	chainId: number;
	marketplaceType: MarketplaceType;
};

const TotalPrice = ({
	order,
	quantityStr,
	salePrice,
	chainId,
	marketplaceType,
}: TotalPriceProps) => {
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const { data: currency, isLoading: isCurrencyLoading } = useCurrency({
		chainId,
		currencyAddress: order?.priceCurrencyAddress,
		query: {
			enabled: marketplaceType === MarketplaceType.MARKET,
		},
	});

	let error: null | string = null;
	let formattedPrice = '0';

	if (
		(marketplaceType === MarketplaceType.MARKET && currency && order) ||
		(marketplaceType === MarketplaceType.SHOP && salePrice)
	) {
		try {
			if (marketplaceType === MarketplaceType.MARKET && currency && order) {
				const marketplaceFeePercentage =
					marketplaceConfig?.market.collections.find((collection) =>
						compareAddress(
							collection.itemsAddress,
							order.collectionContractAddress,
						),
					)?.feePercentage || DEFAULT_MARKETPLACE_FEE_PERCENTAGE;
				const quantity = BigInt(quantityStr);
				const totalPriceRaw = BigInt(order.priceAmount) * quantity;

				formattedPrice = formatPriceWithFee(
					totalPriceRaw,
					currency.decimals,
					marketplaceFeePercentage,
				);
			} else if (marketplaceType === MarketplaceType.SHOP && salePrice) {
				const quantity = BigInt(quantityStr);
				const totalPriceRaw = BigInt(salePrice.amountRaw) * quantity;

				// For shop, we don't have marketplace fees
				formattedPrice = (
					Number(totalPriceRaw) /
					10 ** salePrice.currency.decimals
				).toFixed(4);
			}
		} catch (e) {
			console.error('Error formatting price', e);
			error = 'Unable to calculate total price';
		}
	}

	// For shop mode, use salePrice currency
	const displayCurrency =
		marketplaceType === MarketplaceType.SHOP ? salePrice?.currency : currency;
	const isLoading =
		marketplaceType === MarketplaceType.SHOP ? false : isCurrencyLoading;

	return error ? (
		<Text className="font-body font-medium text-xs" color="text50">
			{error}
		</Text>
	) : (
		<div className="flex justify-between">
			<Text className="font-body font-medium text-xs" color="text50">
				Total Price
			</Text>

			<div className="flex items-center gap-0.5">
				{isLoading || !displayCurrency ? (
					<div className="flex items-center gap-2">
						<Text className="font-body text-text-50 text-xs">Loading...</Text>
					</div>
				) : (
					<>
						{displayCurrency.imageUrl && (
							<TokenImage src={displayCurrency.imageUrl} size="xs" />
						)}

						<Text className="font-body font-bold text-text-100 text-xs">
							{formattedPrice}
						</Text>

						<Text className="font-body font-bold text-text-80 text-xs">
							{displayCurrency.symbol}
						</Text>
					</>
				)}
			</div>
		</div>
	);
};
