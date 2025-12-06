'use client';

import { cn, Text } from '@0xsequence/design-system';
import { forwardRef } from 'react';
import type { Currency } from '../../../../_internal';
import { PriceDisplay as BasePriceDisplay } from '../_internals/PriceDisplay';

export interface CardPriceProps extends React.HTMLAttributes<HTMLDivElement> {
	amount?: bigint;
	currency?: Currency;
	showCurrencyIcon?: boolean;
}

export const CardPrice = forwardRef<HTMLDivElement, CardPriceProps>(
	({ amount, currency, showCurrencyIcon = true, className, ...props }, ref) => {
		if (!amount || !currency) {
			return (
				<div ref={ref} {...props}>
					<Text className="text-left font-body font-bold text-sm text-text-50">
						Not listed yet
					</Text>
				</div>
			);
		}

		return (
			<div ref={ref} {...props}>
				<BasePriceDisplay
					amount={amount}
					currency={currency}
					showCurrencyIcon={showCurrencyIcon}
					className={cn('text-text-100', className)}
				/>
			</div>
		);
	},
);

CardPrice.displayName = 'CardPrice';
