import { Image, Text } from '@0xsequence/design-system2';
import { useState } from 'react';
import { truncateMiddle } from '../../../../../../packages/sdk/src';
import { useCurrency } from '../../../../../../packages/sdk/src/react';
import { useMarketplace } from '../../../lib/MarketplaceContext';

export const CurrencyCell = ({
	currencyAddress,
}: {
	currencyAddress: string;
}) => {
	const { chainId } = useMarketplace();
	const { data: currency } = useCurrency({
		chainId,
		currencyAddress,
		query: {
			enabled: !!currencyAddress,
		},
	});
	const [error, setError] = useState(false);

	return (
		<div className="flex items-center gap-1">
			{currency?.imageUrl && !error && (
				<Image
					className="h-3 w-3"
					src={currency?.imageUrl}
					alt={currency?.symbol}
					onError={() => {
						setError(true);
					}}
				/>
			)}
			<Text className="font-body" color="text100">
				{currency?.symbol || truncateMiddle(currencyAddress, 3, 4)}
			</Text>
		</div>
	);
};
