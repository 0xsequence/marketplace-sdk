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

type Fee = {
	name: string;
	percentage: number;
	amountRaw: bigint;
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

	if (!price) {
		return null;
	}

	const fees: Fee[] = [];

	if (royaltyPercentage !== undefined) {
		const royaltyAmount =
			(BigInt(price.amountRaw) * royaltyPercentage) / 10000n;
		fees.push({
			name: 'Creator royalties',
			percentage: Number(royaltyPercentage) / 100, // Convert basis points to percentage
			amountRaw: royaltyAmount,
		});
	}

	if (marketplaceFeePercentage !== undefined) {
		const marketplaceFeeAmount =
			(BigInt(price.amountRaw) *
				BigInt(Math.round(marketplaceFeePercentage * 100))) /
			10000n;
		fees.push({
			name: 'Marketplace fee',
			percentage: marketplaceFeePercentage,
			amountRaw: marketplaceFeeAmount,
		});
	}

	const totalFees = fees.reduce(
		(total, fee) => total + Number(fee.amountRaw),
		0,
	);
	const totalEarnings = BigInt(price.amountRaw) - BigInt(totalFees);

	if (marketplaceConfigLoading || royaltyPercentageLoading) {
		return null;
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
					{formatUnits(totalEarnings, price.currency.decimals)}{' '}
					{price.currency.symbol}
				</Text>
			</Box>
		</Box>
	);
}
