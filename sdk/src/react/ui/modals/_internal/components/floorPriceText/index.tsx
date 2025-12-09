'use client';

import { Button, Text } from '@0xsequence/design-system';
import type { Hex } from 'viem';
import type { Price } from '../../../../../../types';
import {
	useCollectibleMarketLowestListing,
	useCurrencyComparePrices,
} from '../../../../../hooks';

export default function FloorPriceText({
	chainId,
	collectionAddress,
	tokenId,
	price,
	onBuyNow,
}: {
	chainId: number;
	collectionAddress: Hex;
	tokenId: bigint;
	price: Price;
	onBuyNow?: () => void;
}) {
	const { data: listing, isLoading: listingLoading } =
		useCollectibleMarketLowestListing({
			tokenId,
			chainId,
			collectionAddress,
			filter: {
				currencies: [price.currency.contractAddress],
			},
		});

	const floorPriceRaw = listing?.priceAmount;
	const floorPriceFormatted = listing?.priceAmountFormatted;

	const { data: priceComparison, isLoading: comparisonLoading } =
		useCurrencyComparePrices({
			chainId,
			priceAmountRaw: price.amountRaw?.toString() || '0',
			priceCurrencyAddress: price.currency.contractAddress,
			compareToPriceAmountRaw: floorPriceRaw?.toString() || '0',
			compareToPriceCurrencyAddress:
				listing?.priceCurrencyAddress || price.currency.contractAddress,
			query: {
				enabled: !!floorPriceRaw && !listingLoading && price.amountRaw !== 0n,
			},
		});

	if (
		!floorPriceRaw ||
		listingLoading ||
		price.amountRaw === 0n ||
		comparisonLoading
	) {
		return null;
	}

	let floorPriceDifferenceText = 'Same as floor price';
	let showBuyNowButton = false;

	if (priceComparison) {
		if (priceComparison.status === 'same') {
			floorPriceDifferenceText = 'Same as floor price';
			showBuyNowButton = true;
		} else if (priceComparison.status === 'below') {
			floorPriceDifferenceText = `${priceComparison.percentageDifferenceFormatted}% below floor price`;
		} else {
			floorPriceDifferenceText = `${priceComparison.percentageDifferenceFormatted}% above floor price`;
			showBuyNowButton = true;
		}
	}

	return (
		<div className="flex w-full flex-wrap items-center justify-between gap-2">
			<Text className="text-left font-body font-medium text-muted text-xs">
				{floorPriceDifferenceText}
			</Text>

			{showBuyNowButton && onBuyNow && (
				<Button
					size="xs"
					variant="text"
					className="text-indigo-400 text-xs"
					onClick={onBuyNow}
				>
					Buy for {floorPriceFormatted} {price.currency.symbol}
				</Button>
			)}
		</div>
	);
}
