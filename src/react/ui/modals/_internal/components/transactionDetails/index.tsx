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
		fees.push({
			name: 'Creator royalties',
			percentage: Number(royaltyPercentage), //TODO: this feels wrong
			amountRaw: (BigInt(price.amountRaw) * BigInt(royaltyPercentage)) / 100n,
		});
	}
	if (marketplaceFeePercentage !== undefined) {
		fees.push({
			name: 'Marketplace fee',
			percentage: marketplaceFeePercentage,
			amountRaw:
				(BigInt(price.amountRaw) * BigInt(marketplaceFeePercentage)) / 100n,
		});

		const total =
			BigInt(price.amountRaw) -
			fees.reduce((acc, fee) => acc + fee.amountRaw, 0n);

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
						{formatUnits(total, price.currency.decimals)}{' '}
						{price.currency.symbol}
					</Text>
				</Box>
			</Box>
		);
	}
}
