'use client';

import { Text } from '@0xsequence/design-system';
import type { ContractType } from '../../../../../../_internal';
import { getSupplyStatusText } from '../../../utils';

interface SaleDetailsPillProps {
	quantityRemaining: string | undefined;
	collectionType: ContractType;
	unlimitedSupply?: boolean;
}

export const SaleDetailsPill = ({
	quantityRemaining,
	collectionType,
	unlimitedSupply,
}: SaleDetailsPillProps) => {
	const supplyText = getSupplyStatusText({
		quantityRemaining,
		collectionType,
		unlimitedSupply,
	});

	return (
		<Text className="rounded-lg bg-background-secondary px-2 py-1 text-left font-medium text-text-80 text-xs">
			{supplyText}
		</Text>
	);
};
