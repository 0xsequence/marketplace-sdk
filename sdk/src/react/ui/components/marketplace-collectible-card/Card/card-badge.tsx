'use client';

import { Text } from '@0xsequence/design-system';
import { forwardRef } from 'react';
import { formatUnits } from 'viem';
import { ContractType } from '../../../../_internal';

export interface CardBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
	type: ContractType;
	balance?: string;
	decimals?: number;
}

export const CardBadge = forwardRef<HTMLDivElement, CardBadgeProps>(
	({ type, balance, decimals, ...props }, ref) => {
		const displayText =
			type === ContractType.ERC1155
				? balance
					? `Owned: ${formatUnits(BigInt(balance), decimals ?? 0)}`
					: 'ERC-1155'
				: 'ERC-721';

		return (
			<div ref={ref} {...props}>
				<Text className="rounded-lg bg-background-secondary px-2 py-1 text-left font-medium text-text-80 text-xs">
					{displayText}
				</Text>
			</div>
		);
	},
);

CardBadge.displayName = 'CardBadge';
