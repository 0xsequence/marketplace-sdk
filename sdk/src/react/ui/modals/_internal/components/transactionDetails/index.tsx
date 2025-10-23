'use client';

import { Image, Skeleton, Text } from '@0xsequence/design-system';
import type { Address } from 'viem';
import { DEFAULT_MARKETPLACE_FEE_PERCENTAGE } from '../../../../../../consts';
import type { Price } from '../../../../../../types';
import { calculateEarningsAfterFees } from '../../../../../../utils/price';
import { useMarketplaceConfig, useRoyalty } from '../../../../../hooks';

type TransactionDetailsProps = {
	collectibleId: string;
	collectionAddress: Address;
	chainId: number;
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
		? data?.market.collections.find(
				(collection) => collection.itemsAddress === collectionAddress,
			)?.feePercentage || DEFAULT_MARKETPLACE_FEE_PERCENTAGE
		: 0;
	// royaltyPercentage is an array of [recipient, percentage]
	const { data: royalty, isLoading: royaltyLoading } = useRoyalty({
		chainId,
		collectionAddress,
		collectibleId,
	});

	const priceLoading = !price || marketplaceConfigLoading || royaltyLoading;

	let formattedAmount = '0';

	if (price) {
		const fees: number[] = [];

		if (royalty !== null) {
			fees.push(Number(royalty.percentage));
		}

		if (marketplaceFeePercentage > 0) {
			fees.push(marketplaceFeePercentage);
		}

		formattedAmount = calculateEarningsAfterFees(
			BigInt(price.amountRaw),
			price.currency.decimals,
			fees,
		);
	}

	return (
		<div className="flex w-full items-center justify-between">
			<Text className="font-body font-medium text-xs" color={'text50'}>
				Total earnings
			</Text>
			<div className="flex items-center gap-2">
				<Image className="h-3 w-3" src={currencyImageUrl} />

				{priceLoading ? (
					<Skeleton className="h-4 w-24 animate-shimmer" />
				) : (
					<Text className="font-body font-medium text-xs" color={'text100'}>
						{showPlaceholderPrice ? '0' : formattedAmount}{' '}
						{price.currency.symbol}
					</Text>
				)}
			</div>
		</div>
	);
}
