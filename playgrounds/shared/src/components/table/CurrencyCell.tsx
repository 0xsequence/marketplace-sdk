'use client';

import { Text } from '@0xsequence/design-system';
import { useCurrency } from '@0xsequence/marketplace-sdk/react';

interface CurrencyCellProps {
	currencyAddress: string;
	chainId?: string | number;
}

export function CurrencyCell({ currencyAddress, chainId }: CurrencyCellProps) {
	const { data: currency } = useCurrency({
		currencyAddress,
		chainId: chainId?.toString() || '',
		query: {},
	});

	return (
		<Text variant="small" color="text100">
			{currency?.symbol || '---'}
		</Text>
	);
}
