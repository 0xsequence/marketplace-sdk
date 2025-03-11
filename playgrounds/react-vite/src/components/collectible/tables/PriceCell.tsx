import { Text } from '@0xsequence/design-system';
import { useMarketplace } from 'shared-components';
import { formatUnits } from 'viem';
import type { Activity } from '../../../../../../packages/sdk/src';
import { useCurrency } from '../../../../../../packages/sdk/src/react';

export const PriceCell = ({ activity }: { activity: Activity }) => {
	const { chainId } = useMarketplace();
	const { data: currency } = useCurrency({
		chainId,
		currencyAddress: activity.priceCurrencyAddress || '',
		query: {
			enabled: !!activity.priceCurrencyAddress,
		},
	});

	if (!activity.priceAmount || !activity.priceDecimals) {
		return (
			<Text className="font-body" color="text100">
				-
			</Text>
		);
	}

	return (
		<Text className="font-body" color="text100">
			{formatUnits(BigInt(activity.priceAmount), activity.priceDecimals)}{' '}
			{currency?.symbol}
		</Text>
	);
};
