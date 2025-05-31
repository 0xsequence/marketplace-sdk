'use client';

import { useState } from 'react';

import { Text, TokenImage } from '@0xsequence/design-system';
import { DEFAULT_MARKETPLACE_FEE_PERCENTAGE } from '../../../../consts';
import type { MarketplaceType, Price } from '../../../../types';
import type { Order } from '../../../../types';
import { compareAddress } from '../../../../utils/address';
import { formatPriceWithFee } from '../../../../utils/price';
import { useCurrency, useMarketplaceConfig } from '../../../hooks';
import { ActionModal } from '../_internal/components/actionModal';
import { ErrorModal } from '../_internal/components/actionModal/ErrorModal';
import QuantityInput from '../_internal/components/quantityInput';
import { buyModalStore, useIsOpen } from './store';

type ERC1155QuantityModalProps = {
	order?: Order;
	marketplaceType: MarketplaceType;
	quantityDecimals: number | undefined;
	quantityRemaining: number | undefined;
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

	const [localQuantity, setLocalQuantity] = useState('1');
	const [invalidQuantity, setInvalidQuantity] = useState(false);

	if (quantityDecimals === undefined || quantityRemaining === undefined) {
		console.error('quantityDecimals or quantityRemaining is undefined', {
			quantityDecimals,
			quantityRemaining,
		});
		return (
			<ErrorModal
				isOpen={true}
				chainId={chainId}
				onClose={() => buyModalStore.send({ type: 'close' })}
				title="Error"
			/>
		);
	}

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
					quantity={localQuantity}
					invalidQuantity={invalidQuantity}
					onQuantityChange={(quantity) => setLocalQuantity(quantity)}
					onInvalidQuantityChange={(invalid) => setInvalidQuantity(invalid)}
					decimals={quantityDecimals}
					maxQuantity={quantityRemaining.toString()}
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
	const isShop = marketplaceType === 'shop';
	const isMarket = marketplaceType === 'market';
	const { data: marketplaceConfig } = useMarketplaceConfig();
	// Currency of sale contract is in salePrice, no need to fetch it
	const { data: marketCurrency, isLoading: isMarketCurrencyLoading } =
		useCurrency({
			chainId,
			currencyAddress: order?.priceCurrencyAddress,
			query: {
				enabled: isMarket,
			},
		});
	const currency = isShop ? salePrice?.currency : marketCurrency;

	let error: null | string = null;
	let formattedPrice = '0';

	const quantity = BigInt(quantityStr);

	if (isMarket && marketCurrency && order) {
		try {
			const marketplaceFeePercentage =
				marketplaceConfig?.market.collections?.find((collection) =>
					compareAddress(
						collection.itemsAddress,
						order ? order.collectionContractAddress : '',
					),
				)?.feePercentage || DEFAULT_MARKETPLACE_FEE_PERCENTAGE;
			const totalPriceRaw = BigInt(order.priceAmount) * quantity;

			formattedPrice = formatPriceWithFee(
				totalPriceRaw,
				marketCurrency.decimals,
				marketplaceFeePercentage,
			);
		} catch (e) {
			console.error('Error formatting price', e);
			error = 'Unable to calculate total price';
		}
	}

	if (isShop && salePrice) {
		const totalPriceRaw = BigInt(salePrice.amountRaw) * quantity;
		formattedPrice = formatPriceWithFee(
			totalPriceRaw,
			salePrice.currency.decimals,
			// Fee percentage isn't included if it's sale contract
			0,
		);
	}

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
				{!currency || isMarketCurrencyLoading ? (
					<div className="flex items-center gap-2">
						<Text className="font-body text-text-50 text-xs">Loading...</Text>
					</div>
				) : (
					<>
						{currency?.imageUrl && (
							<TokenImage src={currency.imageUrl} size="xs" />
						)}

						<Text className="font-body font-bold text-text-100 text-xs">
							{formattedPrice}
						</Text>

						<Text className="font-body font-bold text-text-80 text-xs">
							{marketCurrency?.symbol}
						</Text>
					</>
				)}
			</div>
		</div>
	);
};
