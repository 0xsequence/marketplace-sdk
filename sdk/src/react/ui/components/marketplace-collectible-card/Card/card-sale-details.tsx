'use client';

import type { ContractType } from '@0xsequence/api-client';
import { Text } from '@0xsequence/design-system';
import { cn } from '../../../../../utils';
import { getSupplyStatusText } from '../utils';

export interface CardSaleDetailsProps {
	quantityRemaining?: bigint;
	type: ContractType;
	unlimitedSupply?: boolean;
	className?: string;
}

export function CardSaleDetails({
	quantityRemaining,
	type,
	unlimitedSupply,
	className,
}: CardSaleDetailsProps) {
	const supplyText = getSupplyStatusText({
		quantityRemaining,
		collectionType: type,
		unlimitedSupply,
	});

	return (
		<Text
			className={cn(
				'rounded-lg bg-background-secondary px-2 py-1 text-left font-medium text-text-80 text-xs',
				className,
			)}
		>
			{supplyText}
		</Text>
	);
}
