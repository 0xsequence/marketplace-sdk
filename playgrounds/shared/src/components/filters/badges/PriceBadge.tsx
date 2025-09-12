'use client';

import { CloseIcon, Text } from '@0xsequence/design-system';
import {
	useFilterState,
	useMarketCurrencies,
} from '@0xsequence/marketplace-sdk/react';
import type { Address } from 'viem';
import type { PriceFilter } from '../../../../../../sdk/src/react/_internal';

type PriceBadgeProps = {
	priceFilter: PriceFilter;
	chainId: number;
	collectionAddress: Address;
};

export const PriceBadge = ({
	priceFilter,
	chainId,
	collectionAddress,
}: PriceBadgeProps) => {
	const { setPriceFilter } = useFilterState();
	const { data: currencies } = useMarketCurrencies({
		chainId,
		collectionAddress,
	});

	const currency = currencies?.find(
		(c) => c.contractAddress === priceFilter.contractAddress,
	);
	const decimals = currency?.decimals || 0;

	// Convert token amounts back to user-friendly decimal values
	const minDecimal = priceFilter.min
		? (Number.parseFloat(priceFilter.min) / 10 ** decimals).toString()
		: undefined;
	const maxDecimal = priceFilter.max
		? (Number.parseFloat(priceFilter.max) / 10 ** decimals).toString()
		: undefined;

	const formatPriceRange = () => {
		if (minDecimal && maxDecimal) {
			return `${minDecimal} - ${maxDecimal}`;
		}
		if (minDecimal) {
			return `> ${minDecimal}`;
		}
		if (maxDecimal) {
			return `< ${maxDecimal}`;
		}
		return '';
	};

	const handleRemove = () => {
		setPriceFilter(priceFilter.contractAddress);
	};

	return (
		<div className="flex h-7 items-center rounded-md border border-border-base px-2 py-1 text-primary capitalize">
			<Text className="mr-1 text-xs" color="text50" fontWeight="bold">
				Price:
			</Text>

			<div className="flex items-center gap-1">
				{currency && (
					<img
						src={currency.imageUrl}
						alt={currency.symbol}
						className="h-3 w-3 rounded-full"
					/>
				)}
				<Text className="text-xs" color="text100" fontWeight="bold">
					{formatPriceRange()} {currency?.symbol || ''}
				</Text>
			</div>

			<CloseIcon
				className="ml-2 h-4 w-4 cursor-pointer"
				onClick={handleRemove}
			/>
		</div>
	);
};
