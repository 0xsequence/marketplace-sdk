'use client';

import { Text, TokenImage } from '@0xsequence/design-system';
import { useState } from 'react';
import type { Address } from 'viem';
import { maxUint256, parseUnits } from 'viem';
import { DEFAULT_MARKETPLACE_FEE_PERCENTAGE } from '../../../../../consts';
import type { CardType, MarketplaceConfig } from '../../../../../types';
import { formatPriceWithFee } from '../../../../../utils/price';
import type { Currency, Order } from '../../../../_internal';
import { useCurrencyDetail, useMarketplaceConfig } from '../../../../hooks';
import { ActionModal } from '../../_internal/components/baseModal/ActionModal';
import QuantityInput from '../../_internal/components/quantityInput';
import { buyModalStore } from '../store';

// Use bigint for infinity constant to avoid precision loss
const INFINITY = maxUint256;

type ERC1155QuantityModalProps = {
	order?: Order;
	cardType: CardType;
	quantityDecimals: number;
	quantityRemaining: bigint;
	unlimitedSupply?: boolean;
	salePrice?: {
		amount: bigint;
		currencyAddress: Address;
	};
	chainId: number;
};

export const ERC1155QuantityModal = ({
	order,
	quantityDecimals,
	quantityRemaining,
	unlimitedSupply,
	salePrice,
	chainId,
	cardType,
}: ERC1155QuantityModalProps) => {
	const minQuantity =
		quantityDecimals > 0 ? `0.${'1'.padStart(quantityDecimals, '0')}` : '1';
	const [localQuantity, setLocalQuantity] = useState(minQuantity);
	const [invalidQuantity, setInvalidQuantity] = useState(false);

	// Calculate max quantity using bigint arithmetic to avoid precision loss
	const maxQuantity = unlimitedSupply
		? INFINITY.toString()
		: quantityDecimals > 0
			? // Use bigint division for decimals to avoid Number() precision loss
				(quantityRemaining / BigInt(10 ** quantityDecimals)).toString()
			: quantityRemaining.toString();

	const currencyQuery = useCurrencyDetail({
		chainId,
		currencyAddress:
			order?.priceCurrencyAddress ??
			salePrice?.currencyAddress ??
			('0x0000000000000000000000000000000000000000' as Address),
	});
	const marketplaceConfigQuery = useMarketplaceConfig();

	const handleBuyNow = () => {
		// Convert the quantity to account for decimals - parseUnits returns bigint
		const quantityWithDecimals = parseUnits(localQuantity, quantityDecimals);
		buyModalStore.send({
			type: 'setQuantity',
			// Store expects number, convert bigint safely
			quantity: Number(quantityWithDecimals),
		});
	};

	const queries = {
		currency: currencyQuery,
		marketplaceConfig: marketplaceConfigQuery,
	};

	return (
		<ActionModal
			type="buy"
			chainId={chainId}
			onClose={() => buyModalStore.send({ type: 'close' })}
			title="Select Quantity"
			disableAnimation={true}
			primaryAction={{
				label: 'Buy now',
				onClick: handleBuyNow,
				disabled: invalidQuantity,
			}}
			queries={queries}
		>
			{({ currency, marketplaceConfig }) => (
				<div className="flex w-full flex-col gap-4">
					<QuantityInput
						quantity={localQuantity}
						invalidQuantity={invalidQuantity}
						onQuantityChange={setLocalQuantity}
						onInvalidQuantityChange={setInvalidQuantity}
						decimals={quantityDecimals}
						maxQuantity={maxQuantity}
					/>

					<TotalPrice
						order={order}
						quantityStr={localQuantity}
						salePrice={salePrice}
						chainId={chainId}
						cardType={cardType}
						quantityDecimals={quantityDecimals}
						currency={currency}
						marketplaceConfig={marketplaceConfig}
					/>
				</div>
			)}
		</ActionModal>
	);
};

type TotalPriceProps = {
	order?: Order;
	quantityStr: string;
	salePrice?: {
		amount: bigint;
		currencyAddress: Address;
	};
	chainId: number;
	cardType: CardType;
	quantityDecimals: number;
	currency: Currency;
	marketplaceConfig: MarketplaceConfig;
};

const TotalPrice = ({
	order,
	quantityStr,
	salePrice,
	chainId,
	cardType,
	quantityDecimals,
	currency,
	marketplaceConfig,
}: TotalPriceProps) => {
	const isShop = cardType === 'shop';
	const isMarket = cardType === 'market';

	let error: null | string = null;
	let formattedPrice = '0';

	// Convert quantity to proper decimal format for multiplication
	const quantityForCalculation = parseUnits(quantityStr, quantityDecimals);

	if (isMarket && currency && order) {
		try {
			// Find fee percentage from market collections only
			const marketCollection = marketplaceConfig?.market?.collections?.find(
				(col) =>
					col.itemsAddress.toLowerCase() ===
						order.collectionContractAddress.toLowerCase() &&
					col.chainId === chainId,
			);
			const marketplaceFeePercentage =
				marketCollection?.feePercentage ?? DEFAULT_MARKETPLACE_FEE_PERCENTAGE;
			const totalPriceRaw =
				BigInt(order ? order.priceAmount : '0') * quantityForCalculation;

			formattedPrice = formatPriceWithFee(
				totalPriceRaw,
				currency.decimals,
				marketplaceFeePercentage,
			);
		} catch (e) {
			console.error('Error formatting price', e);
			error = 'Unable to calculate total price';
		}
	}

	if (isShop && salePrice && currency) {
		const totalPriceRaw = salePrice.amount * quantityForCalculation;
		formattedPrice = formatPriceWithFee(
			totalPriceRaw,
			currency.decimals,
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
				{currency?.imageUrl && <TokenImage src={currency.imageUrl} size="xs" />}

				<Text className="font-body font-bold text-text-100 text-xs">
					{formattedPrice}
				</Text>

				<Text className="font-body font-bold text-text-80 text-xs">
					{currency?.symbol}
				</Text>
			</div>
		</div>
	);
};
