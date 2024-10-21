import { Box, NetworkImage, Text } from '@0xsequence/design-system';
import { useMarketplaceConfig } from '@react-hooks/useMarketplaceConfig';
import { useRoyaltyPercentage } from '@react-hooks/useRoyaltyPercentage';
import type { Price } from '@types';
import { formatUnits } from 'viem';

type TransactionDetailsProps = {
	collectibleId: string;
	collectionAddress: string;
	chainId: string;
	price?: Price;
};

//TODO: Move this
const DEFAULT_MARKETPLACE_FEE_PERCENTAGE = 2.5;

export default function TransactionDetails({
	collectibleId,
	collectionAddress,
	chainId,
	price,
}: TransactionDetailsProps) {
	const { data, isLoading: marketplaceConfigLoading } = useMarketplaceConfig();

	const marketplaceFeePercentage =
		data?.collections.find(
			(collection) => collection.collectionAddress === collectionAddress,
		)?.marketplaceFeePercentage || DEFAULT_MARKETPLACE_FEE_PERCENTAGE;
	const { data: royaltyPercentage, isLoading: royaltyPercentageLoading } =
		useRoyaltyPercentage({
			chainId,
			collectionAddress,
			collectibleId,
		});

	if (!price || marketplaceConfigLoading || royaltyPercentageLoading) {
		return null;
	}

	let amountFormatted = formatUnits(
		BigInt(price.amountRaw),
		price.currency.decimals,
	);

	if (royaltyPercentage !== undefined) {
		amountFormatted = (
			parseFloat(amountFormatted) -
			(parseFloat(amountFormatted) * Number(royaltyPercentage)) / 100
		).toString();
	}

	if (marketplaceFeePercentage !== undefined) {
		amountFormatted = (
			parseFloat(amountFormatted) -
			(parseFloat(amountFormatted) * marketplaceFeePercentage) / 100
		).toString();
	}

	return (
		<Box
			width="full"
			display={'flex'}
			justifyContent={'space-between'}
			alignItems={'center'}
		>
			<Text fontSize={'small'} color={'text50'}>
				Total earnings
			</Text>

			<Box display="flex" alignItems="center" gap="2">
				<NetworkImage chainId={Number(chainId)} size="xs" />

				<Text fontSize={'small'} color={'text100'}>
					{amountFormatted} {price.currency.symbol}
				</Text>
			</Box>
		</Box>
	);
}
