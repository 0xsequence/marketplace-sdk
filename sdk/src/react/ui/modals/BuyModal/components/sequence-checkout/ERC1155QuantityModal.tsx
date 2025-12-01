'use client';

import type { Order } from '@0xsequence/api-client';
import { Text, TokenImage } from '@0xsequence/design-system';
import { useState } from 'react';
import type { Address } from 'viem';
import { maxUint256, parseUnits } from 'viem';
import { DEFAULT_MARKETPLACE_FEE_PERCENTAGE } from '../../../../../../consts';
import type { CardType } from '../../../../../../types';
import { formatPriceWithFee } from '../../../../../../utils/price';
import { useCurrency, useMarketplaceConfig } from '../../../../hooks';
import { ActionModal } from '../../../_internal/components/baseModal';
import QuantityInput from '../../../_internal/components/quantityInput';
import {
	buyModalStore,
	//useIsOpen
} from '../../store';

//const INFINITY_STRING = maxUint256.toString();

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
	//const isOpen = useIsOpen();

	const minQuantity =
		quantityDecimals > 0 ? `0.${'1'.padStart(quantityDecimals, '0')}` : '1';
	const [localQuantity, setLocalQuantity] = useState(minQuantity);
	const [invalidQuantity, setInvalidQuantity] = useState(false);

	const maxQuantity: bigint = unlimitedSupply
		? maxUint256
		: quantityDecimals > 0
			? quantityRemaining / BigInt(10) ** BigInt(quantityDecimals)
			: quantityRemaining;

	const handleBuyNow = () => {
		// Convert the quantity to account for decimals
		const quantityWithDecimals = parseUnits(
			localQuantity,
			quantityDecimals,
		).toString();
		buyModalStore.send({
			type: 'setQuantity',
			quantity: Number(quantityWithDecimals),
		});
	};

	return (
		<ActionModal
			chainId={chainId}
			onClose={() => buyModalStore.send({ type: 'close' })}
			title="Select Quantity"
			disableAnimation={true}
			type="buy"
			queries={{}}
			primaryAction={{
				label: 'Buy now',
				onClick: handleBuyNow,
				disabled: invalidQuantity,
			}}
			secondaryAction={{
				label: 'Cancel',
				onClick: () => buyModalStore.send({ type: 'close' }),
			}}
		>
			{() => {
				return (
					<div className="flex w-full flex-col gap-4">
						<QuantityInput
							quantity={localQuantity}
							invalidQuantity={invalidQuantity}
							onQuantityChange={setLocalQuantity}
							onInvalidQuantityChange={setInvalidQuantity}
							decimals={quantityDecimals}
							maxQuantity={maxQuantity.toString()}
						/>

						<TotalPrice
							order={order}
							quantityStr={localQuantity}
							salePrice={{
								// TODO: Fix this
								amount: salePrice?.amount.toString() ?? '0',
								currencyAddress:
									salePrice?.currencyAddress ??
									'0x0000000000000000000000000000000000000000',
							}}
							chainId={chainId}
							cardType={cardType}
							quantityDecimals={quantityDecimals}
						/>
					</div>
				);
			}}
		</ActionModal>
	);
};

type TotalPriceProps = {
	order?: Order;
	quantityStr: string;
	salePrice?: {
		amount: string;
		currencyAddress: Address;
	};
	chainId: number;
	cardType: CardType;
	quantityDecimals: number;
};

const TotalPrice = ({
	order,
	quantityStr,
	salePrice,
	chainId,
	cardType,
	quantityDecimals,
}: TotalPriceProps) => {
	const isShop = cardType === 'shop';
	const isMarket = cardType === 'market';
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const { data: currency, isLoading: isCurrencyLoading } = useCurrency({
		chainId,
		currencyAddress: (order
			? order.priceCurrencyAddress
			: salePrice?.currencyAddress) as Address,
	});

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
		const totalPriceRaw = BigInt(salePrice.amount) * quantityForCalculation;
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
				{!currency || isCurrencyLoading ? (
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
							{currency?.symbol}
						</Text>
					</>
				)}
			</div>
		</div>
	);
};
