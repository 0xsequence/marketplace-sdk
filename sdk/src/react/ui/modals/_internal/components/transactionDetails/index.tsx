'use client';

import type { Address } from '@0xsequence/api-client';
import {
	ChevronRightIcon,
	Image,
	Skeleton,
	Text,
	Tooltip,
} from '@0xsequence/design-system';
import { useEffect, useState } from 'react';
import { DEFAULT_MARKETPLACE_FEE_PERCENTAGE } from '../../../../../../consts';
import type { Price } from '../../../../../../types';
import { calculateEarningsAfterFees } from '../../../../../../utils/price';
import { useMarketplaceConfig, useRoyalty } from '../../../../../hooks';

type TransactionDetailsProps = {
	tokenId: bigint;
	collectionAddress: Address;
	chainId: number;
	price?: Price;
	currencyImageUrl?: string;
	includeMarketplaceFee: boolean;
	// We use a placeholder price for create listing modal
	showPlaceholderPrice?: boolean;
};

export default function TransactionDetails({
	tokenId,
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
		tokenId,
	});
	const [overflow, setOverflow] = useState({
		status: false,
		amount: '0',
	});

	const priceLoading = !price || marketplaceConfigLoading || royaltyLoading;

	const [formattedAmount, setFormattedAmount] = useState('0');

	useEffect(() => {
		if (!price || royaltyLoading || marketplaceConfigLoading) return;

		const fees: number[] = [];
		if (royalty?.percentage && royalty?.percentage > 0) {
			fees.push(Number(royalty.percentage));
		}
		if (marketplaceFeePercentage > 0) {
			fees.push(marketplaceFeePercentage);
		}
		const newFormattedAmount = calculateEarningsAfterFees(
			BigInt(price.amountRaw),
			price.currency.decimals,
			fees,
		);
		setFormattedAmount(newFormattedAmount);
	}, [
		price,
		royalty,
		marketplaceFeePercentage,
		royaltyLoading,
		marketplaceConfigLoading,
	]);

	useEffect(() => {
		if (formattedAmount.length > 15) {
			setOverflow((prev) =>
				prev.status
					? prev
					: { status: true, amount: formattedAmount.slice(0, 15) },
			);
		} else {
			setOverflow({ status: false, amount: formattedAmount });
		}
	}, [formattedAmount]);

	return (
		<div className="flex w-full items-center justify-between">
			<Text className="font-body font-medium text-xs" color={'text50'}>
				Total earnings
			</Text>
			<div className="flex items-center gap-2">
				{currencyImageUrl ? (
					<Image className="h-3 w-3" src={currencyImageUrl} />
				) : (
					<div className="h-3 w-3 rounded-full bg-background-secondary" />
				)}

				{priceLoading ? (
					<Skeleton className="h-4 w-12 animate-shimmer" />
				) : (
					<Text className="font-body font-medium text-xs" color={'text100'}>
						{showPlaceholderPrice ? (
							<Text className="font-body font-medium text-xs" color={'text100'}>
								0 {price.currency.symbol}
							</Text>
						) : overflow.status ? (
							<Tooltip message={`${formattedAmount} ${price.currency.symbol}`}>
								<div className="flex items-center">
									<ChevronRightIcon className="h-3 w-3 text-text-100" />
									<Text
										className="font-body font-medium text-xs"
										color={'text100'}
									>
										{overflow.amount} {price.currency.symbol}
									</Text>
								</div>
							</Tooltip>
						) : (
							<Text className="font-body font-medium text-xs" color={'text100'}>
								{formattedAmount} {price.currency.symbol}
							</Text>
						)}
					</Text>
				)}
			</div>
		</div>
	);
}
