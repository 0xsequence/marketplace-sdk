'use client';

import {
	ChevronLeftIcon,
	ChevronRightIcon,
	cn,
	Image,
	Text,
} from '@0xsequence/design-system';
import type { Currency } from '../../../../../../_internal';
import { formatPriceNumber } from '../../../utils';

interface PriceDisplayProps {
	amount: string;
	currency: Currency;
	showCurrencyIcon?: boolean;
	className?: string;
}

export const formatPrice = (
	amount: string,
	currency: Currency,
): React.ReactNode => {
	const { formattedNumber, isUnderflow, isOverflow } = formatPriceNumber(
		amount,
		currency.decimals,
	);
	const isFree = amount === '0';

	if (isFree) {
		return <Text>Free</Text>;
	}

	if (isUnderflow) {
		return (
			<div className="flex items-center">
				<ChevronLeftIcon className="h-3 w-3 text-text-100" />
				<Text>{`${formattedNumber} ${currency.symbol}`}</Text>
			</div>
		);
	}

	if (isOverflow) {
		return (
			<div className="flex items-center">
				<ChevronRightIcon className="h-3 w-3 text-text-100" />
				<Text>{`${formattedNumber} ${currency.symbol}`}</Text>
			</div>
		);
	}

	return (
		<Text>
			{formattedNumber} {currency.symbol}
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
		<div className={cn('flex items-center gap-1', className)}>
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
			{formatPrice(amount, currency)}
		</div>
	);
};
