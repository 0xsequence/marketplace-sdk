'use client';

import type { Order } from '@0xsequence/api-client';
import { Skeleton, Text, TokenImage } from '@0xsequence/design-system';
import { useEffect, useState } from 'react';
import type { Address } from 'viem';
import { maxUint256 } from 'viem';
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
	quantityRemaining,
	unlimitedSupply,
	salePrice,
	chainId,
	cardType,
}: ERC1155QuantityModalProps) => {
	const minQuantity = 1n;
	const [quantity, setQuantity] = useState<bigint>(minQuantity);
	const [localInvalidQuantity, setLocalInvalidQuantity] = useState(false);

	const maxQuantity: bigint = unlimitedSupply ? maxUint256 : quantityRemaining;
	const maxBelowMin = maxQuantity < minQuantity;
	const invalidQuantity = maxBelowMin || localInvalidQuantity;

	// Keep `quantity` clamped when `maxQuantity` changes (e.g. remaining decreases).
	useEffect(() => {
		if (maxBelowMin) {
			// Keep quantity at minimum, but disable the action via invalid state.
			setQuantity(minQuantity);
			return;
		}

		setQuantity((q) => {
			if (q < minQuantity) return minQuantity;
			if (q > maxQuantity) return maxQuantity;
			return q;
		});
	}, [maxBelowMin, maxQuantity, minQuantity]);

	const handleSetQuantity = () => {
		buyModalStore.send({
			type: 'setQuantity',
			quantity: Number(quantity),
		});
		buyModalStore.send({ type: 'openPaymentModal' });
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
				onClick: handleSetQuantity,
				disabled: invalidQuantity,
			}}
			secondaryAction={{
				label: 'Cancel',
				variant: 'secondary',
				onClick: () => buyModalStore.send({ type: 'close' }),
			}}
		>
			{() => {
				return (
					<div className="flex w-full flex-col gap-4">
						<QuantityInput
							quantity={quantity}
							invalidQuantity={invalidQuantity}
							onQuantityChange={setQuantity}
							onInvalidQuantityChange={setLocalInvalidQuantity}
							maxQuantity={maxQuantity}
						/>

						<TotalPrice
							order={order}
							quantity={quantity}
							salePrice={salePrice}
							chainId={chainId}
							cardType={cardType}
						/>
					</div>
				);
			}}
		</ActionModal>
	);
};

type TotalPriceProps = {
	order?: Order;
	quantity: bigint;
	salePrice?: {
		amount: bigint;
		currencyAddress: Address;
	};
	chainId: number;
	cardType: CardType;
};

const TotalPrice = ({
	order,
	quantity,
	salePrice,
	chainId,
	cardType,
}: TotalPriceProps) => {
	const isShop = cardType === 'shop';
	const isMarket = cardType === 'market';
	const { data: marketplaceConfig } = useMarketplaceConfig();
	const currencyAddress = order
		? order.priceCurrencyAddress
		: salePrice?.currencyAddress;
	const { data: currency, isLoading: isCurrencyLoading } = useCurrency({
		chainId,
		currencyAddress,
	});

	let error: null | string = null;
	let formattedPrice = '0';

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
			const totalPriceRaw = BigInt(order.priceAmount) * quantity;

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
		const totalPriceRaw = BigInt(salePrice.amount) * quantity;
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
					<Skeleton className="h-4 w-12" />
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
