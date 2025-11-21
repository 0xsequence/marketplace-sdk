'use client';

import {
	ChevronLeftIcon,
	ChevronRightIcon,
	cn,
	Image,
	Text,
} from '@0xsequence/design-system';
import type { Currency } from '../../../../_internal';
import { formatPriceData } from '../utils';

interface PriceDisplayProps {
	amount: bigint;
	currency: Currency;
	showCurrencyIcon?: boolean;
	className?: string;
}

/**
 * Formats price into React components for display.
 * Uses formatPriceData for data transformation.
 */
export const formatPrice = (
	amount: bigint,
	currency: Currency,
	className?: string,
): React.ReactNode => {
	const price = formatPriceData(amount, currency);

	if (price.type === 'free') {
		return <Text className="font-bold text-sm text-text-100">Free</Text>;
	}

	const Icon =
		price.type === 'underflow'
			? ChevronLeftIcon
			: price.type === 'overflow'
				? ChevronRightIcon
				: null;

	if (Icon) {
		return (
			<div className="flex items-center">
				<Icon className="h-3 w-3 text-text-100" />
				<Text
					className={cn('font-bold text-sm', className || 'text-text-100')}
				>{`${price.displayText} ${price.symbol}`}</Text>
			</div>
		);
	}

	return (
		<Text className={cn('font-bold text-sm', className || 'text-text-100')}>
			{price.displayText} {price.symbol}
		</Text>
	);
};

export const PriceDisplay = ({
	amount,
	currency,
	showCurrencyIcon = true,
	className,
}: PriceDisplayProps) => {
	return (
		<div className="flex items-center gap-1">
			{showCurrencyIcon && currency.imageUrl && (
				<Image
					alt={currency.symbol}
					className="h-3 w-3"
					src={currency.imageUrl}
					onError={(e) => {
						e.currentTarget.style.display = 'none';
					}}
				/>
			)}

			{formatPrice(amount, currency, className)}
		</div>
	);
};
