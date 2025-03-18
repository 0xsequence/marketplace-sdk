'use client';

import { Box, Image, Skeleton, Text } from '@0xsequence/design-system';
import { type Hex, formatUnits } from 'viem';
import { DEFAULT_MARKETPLACE_FEE_PERCENTAGE } from '../../../../../../consts';
import type { Price } from '../../../../../../types';
import {
	useMarketplaceConfig,
	useRoyaltyPercentage,
} from '../../../../../hooks';

type TransactionDetailsProps = {
	collectibleId: string;
	collectionAddress: Hex;
	chainId: string;
	price?: Price;
	currencyImageUrl?: string;
	includeMarketplaceFee: boolean;
	// We use a placeholder price for create listing modal
	showPlaceholderPrice?: boolean;
};

export default function TransactionDetails({
	collectibleId,
	collectionAddress,
	chainId,
	includeMarketplaceFee,
	price,
	showPlaceholderPrice,
	currencyImageUrl,
}: TransactionDetailsProps) {
	const { data, isLoading: marketplaceConfigLoading } = useMarketplaceConfig();

	const marketplaceFeePercentage = includeMarketplaceFee
		? data?.collections.find(
				(collection) => collection.address === collectionAddress,
			)?.feePercentage || DEFAULT_MARKETPLACE_FEE_PERCENTAGE
		: 0;
	const { data: royaltyPercentage, isLoading: royaltyPercentageLoading } =
		useRoyaltyPercentage({
			chainId,
			collectionAddress,
			collectibleId,
		});

	const priceLoading =
		!price || marketplaceConfigLoading || royaltyPercentageLoading;

	let formattedAmount =
		price && formatUnits(BigInt(price.amountRaw), price.currency.decimals);

	if (royaltyPercentage !== undefined && formattedAmount && price) {
		formattedAmount = (
			Number.parseFloat(formattedAmount) -
			(Number.parseFloat(formattedAmount) * Number(royaltyPercentage)) / 100
		).toFixed(price.currency.decimals);
	}

	if (marketplaceFeePercentage !== undefined && formattedAmount && price) {
		formattedAmount = (
			Number.parseFloat(formattedAmount) -
			(Number.parseFloat(formattedAmount) * marketplaceFeePercentage) / 100
		).toFixed(price.currency.decimals);
	}

	return (
		<Box
			width="full"
			display={'flex'}
			justifyContent={'space-between'}
			alignItems={'center'}
		>
			<Text fontSize={'small'} color={'text50'} fontFamily="body">
				Total earnings
			</Text>

			<Box display="flex" alignItems="center" gap="2">
				<Image src={currencyImageUrl} width="3" height="3" />

				{priceLoading ? (
					<Skeleton width="16" height={'4'} />
				) : (
					<Text fontSize={'small'} color={'text100'} fontFamily="body">
						{showPlaceholderPrice ? '0' : formattedAmount}{' '}
						{price.currency.symbol}
					</Text>
				)}
			</Box>
		</Box>
	);
}
