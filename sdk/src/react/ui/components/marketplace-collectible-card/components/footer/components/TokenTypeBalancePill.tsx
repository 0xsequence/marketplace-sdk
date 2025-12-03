'use client';

import { Text } from '@0xsequence/design-system';
import { formatUnits } from 'viem';
import { ContractType } from '../../../../../../_internal';

interface TokenTypeBalancePillProps {
	balance?: string;
	type: ContractType;
	decimals?: number;
}

export const TokenTypeBalancePill = ({
	balance,
	type,
	decimals,
}: TokenTypeBalancePillProps) => {
	const displayText =
		type === ContractType.ERC1155
			? balance
				? `Owned: ${formatUnits(BigInt(balance), decimals ?? 0)}`
				: 'ERC-1155'
			: 'ERC-721';

	return (
		<Text className="rounded-lg bg-background-secondary px-2 py-1 text-left font-medium text-text-80 text-xs">
			{displayText}
		</Text>
	);
};
