'use client';

import { ContractType } from '@0xsequence/api-client';
import { Text } from '@0xsequence/design-system';
import { forwardRef } from 'react';
import { cn } from '../../../../../utils';

export interface CardBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
	type: ContractType;
	balance?: string;
}

export const CardBadge = forwardRef<HTMLDivElement, CardBadgeProps>(
	({ type, balance, className, ...props }, ref) => {
		const displayText =
			type === ContractType.ERC1155
				? balance
					? `Owned: ${balance}`
					: 'ERC-1155'
				: 'ERC-721';

		return (
			<div ref={ref} {...props}>
				<Text
					className={cn(
						'rounded-lg bg-background-secondary px-2 py-1 text-left font-medium text-text-80 text-xs',
						className,
					)}
				>
					{displayText}
				</Text>
			</div>
		);
	},
);

CardBadge.displayName = 'CardBadge';
