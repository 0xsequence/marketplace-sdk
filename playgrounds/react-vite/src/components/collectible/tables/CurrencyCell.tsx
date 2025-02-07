import { Box, Image, Text } from '@0xsequence/design-system';
import { useCurrency } from '../../../../../../packages/sdk/src/react';
import { useMarketplace } from '../../../lib/MarketplaceContext';
import { truncateMiddle } from '../../../../../../packages/sdk/src';
import { useState } from 'react';

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
		<Box display="flex" alignItems="center" gap="1">
			{currency?.imageUrl && !error && (
				<Image
					src={currency?.imageUrl}
					alt={currency?.symbol}
					width="3"
					height="3"
					onError={() => {
						setError(true);
					}}
				/>
			)}

			<Text fontFamily="body" color="text100">
				{currency?.symbol || truncateMiddle(currencyAddress, 3, 4)}
			</Text>
		</Box>
	);
};
