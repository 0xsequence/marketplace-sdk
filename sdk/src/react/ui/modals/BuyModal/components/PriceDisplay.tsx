'use client';

import { cn } from '../../../../../utils';
import { type Price, PriceManager } from '../../../../../utils/priceManager';

export interface PriceDisplayProps {
	/** The price amount using dnum representation */
	amount: Price;
	/** Currency symbol (e.g., 'ETH', 'USDC') */
	currency?: string;
	/** Display size variant */
	variant?: 'large' | 'medium' | 'small';
	/** Whether to show currency icon alongside text */
	showCurrencyIcon?: boolean;
	/** Additional CSS classes */
	className?: string;
	/** Custom formatting options */
	formatOptions?: {
		compact?: boolean;
		maxDecimals?: number;
		trailingZeros?: boolean;
	};
}

export const PriceDisplay = ({
	amount,
	currency,
	variant = 'medium',
	showCurrencyIcon = false,
	className,
	formatOptions,
}: PriceDisplayProps) => {
	const formatted = PriceManager.formatForDisplay(amount, {
		symbol: currency,
		compact: formatOptions?.compact ?? variant === 'small',
		maxDecimals: formatOptions?.maxDecimals ?? (variant === 'large' ? 8 : 4),
		trailingZeros: formatOptions?.trailingZeros ?? false,
	});

	const sizeClasses = {
		large: 'text-2xl font-bold',
		medium: 'text-lg font-semibold',
		small: 'text-sm font-medium',
	};

	return (
		<div
			className={cn('flex items-center gap-1', sizeClasses[variant], className)}
		>
			{showCurrencyIcon && currency && (
				<CurrencyIcon currency={currency} size={variant} />
			)}
			<span className="price-value">{formatted}</span>
		</div>
	);
};

interface CurrencyIconProps {
	currency: string;
	size: 'large' | 'medium' | 'small';
}

const CurrencyIcon = ({ currency, size }: CurrencyIconProps) => {
	const iconSizes = {
		large: 'w-6 h-6',
		medium: 'w-5 h-5',
		small: 'w-4 h-4',
	};

	// For now, use a simple text representation
	// TODO: Add actual currency icons when available
	return (
		<span
			className={cn(
				'inline-flex items-center justify-center rounded-full bg-gray-100 font-mono text-gray-600 text-xs',
				iconSizes[size],
			)}
		>
			{currency.slice(0, 2)}
		</span>
	);
};

// Convenient preset components for common use cases
export const PriceDisplayLarge = (
	props: Omit<PriceDisplayProps, 'variant'>,
) => <PriceDisplay {...props} variant="large" />;

export const PriceDisplayMedium = (
	props: Omit<PriceDisplayProps, 'variant'>,
) => <PriceDisplay {...props} variant="medium" />;

export const PriceDisplaySmall = (
	props: Omit<PriceDisplayProps, 'variant'>,
) => <PriceDisplay {...props} variant="small" />;

// Price comparison component
export interface PriceComparisonProps {
	primaryPrice: Price;
	secondaryPrice?: Price;
	primaryCurrency: string;
	secondaryCurrency?: string;
	showDifference?: boolean;
	className?: string;
}

export const PriceComparison = ({
	primaryPrice,
	secondaryPrice,
	primaryCurrency,
	secondaryCurrency,
	showDifference = true,
	className,
}: PriceComparisonProps) => {
	const difference = secondaryPrice
		? PriceManager.isGreaterThan(primaryPrice, secondaryPrice)
		: null;

	return (
		<div className={cn('space-y-1', className)}>
			<PriceDisplay
				amount={primaryPrice}
				currency={primaryCurrency}
				variant="medium"
			/>
			{secondaryPrice && secondaryCurrency && (
				<>
					<PriceDisplay
						amount={secondaryPrice}
						currency={secondaryCurrency}
						variant="small"
						className="text-gray-500"
					/>
					{showDifference && difference !== null && (
						<span
							className={cn(
								'text-xs',
								difference ? 'text-red-500' : 'text-green-500',
							)}
						>
							{difference ? '↑' : '↓'} vs {secondaryCurrency}
						</span>
					)}
				</>
			)}
		</div>
	);
};
