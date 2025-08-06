'use client';

import { Text, TokenImage } from '@0xsequence/design-system';
import type { Dnum } from 'dnum';
import * as dn from 'dnum';
import { useState } from 'react';
import type { Address } from 'viem';
import { maxUint256 } from 'viem';
import { DEFAULT_MARKETPLACE_FEE_PERCENTAGE } from '../../../../../consts';
import type { MarketplaceType } from '../../../../../types';
import { formatPriceWithFee } from '../../../../../utils/price';
import type { Order } from '../../../../_internal';
import { useMarketplaceConfig } from '../../../../hooks';
import { useCurrency } from '../../../../hooks/data/market/useCurrency';
import { ActionModal } from '../../_internal/components/actionModal';
import QuantityInput from '../../_internal/components/quantityInput';
import { buyModalStore, useIsOpen } from '../store';

const INFINITY_STRING = maxUint256.toString();

type ERC1155QuantityModalProps = {
	order?: Order;
	marketplaceType: MarketplaceType;
	quantityDecimals: number;
	quantityRemaining: string;
	unlimitedSupply?: boolean;
	salePrice?: {
		amount: string;
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
	marketplaceType,
}: ERC1155QuantityModalProps) => {
	const isOpen = useIsOpen();

	const [localQuantity, setLocalQuantity] = useState<Dnum>(dn.from('1', 0));
	const [invalidQuantity, setInvalidQuantity] = useState(false);

	const maxQuantity: Dnum = unlimitedSupply
		? dn.from(INFINITY_STRING, quantityDecimals)
		: dn.from(quantityRemaining, quantityDecimals);

	const handleBuyNow = () => {
		// Convert the user-facing quantity to internal representation
		const quantityWithDecimals = dn.multiply(
			localQuantity,
			dn.from(10 ** quantityDecimals, 0),
		);
		buyModalStore.send({
			type: 'setQuantity',
			quantity: Number(dn.toString(quantityWithDecimals)),
		});
	};

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
					onClick: handleBuyNow,
					disabled: invalidQuantity,
				},
			]}
		>
			<div className="flex w-full flex-col gap-4">
				<QuantityInput
					quantity={localQuantity}
					invalidQuantity={invalidQuantity}
					onQuantityChange={setLocalQuantity}
					onInvalidQuantityChange={setInvalidQuantity}
					maxQuantity={maxQuantity}
				/>

				<TotalPrice
					order={order}
					quantityDnum={localQuantity}
					salePrice={salePrice}
					chainId={chainId}
					marketplaceType={marketplaceType}
					quantityDecimals={quantityDecimals}
				/>
			</div>
		</ActionModal>
	);
};

type TotalPriceProps = {
	order?: Order;
	quantityDnum: Dnum;
	salePrice?: {
		amount: string;
		currencyAddress: Address;
	};
	chainId: number;
	marketplaceType: MarketplaceType;
	quantityDecimals: number;
};

const TotalPrice = ({
	order,
	quantityDnum,
	salePrice,
	chainId,
	marketplaceType,
	quantityDecimals,
}: TotalPriceProps) => {
	const isShop = marketplaceType === 'shop';
	const isMarket = marketplaceType === 'market';
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const { data: currency, isLoading: isCurrencyLoading } = useCurrency({
		chainId,
		currencyAddress: (order
			? order.priceCurrencyAddress
			: salePrice?.currencyAddress) as Address,
	});

	let error: null | string = null;
	let formattedPrice = '0';

	// Convert user-facing quantity to internal representation for calculation
	const quantityForCalculation = BigInt(
		dn.toString(dn.multiply(quantityDnum, dn.from(10 ** quantityDecimals, 0))),
	);

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
