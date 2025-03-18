'use client';

import { Text } from '@0xsequence/design-system';
import type { Hex } from 'viem';
import type { Price } from '../../../../../../types';
import { useComparePrices, useLowestListing } from '../../../../../hooks';

export default function FloorPriceText({
	chainId,
	collectionAddress,
	tokenId,
	price,
}: {
	chainId: string;
	collectionAddress: Hex;
	tokenId: string;
	price: Price;
}) {
	const { data: listing, isLoading: listingLoading } = useLowestListing({
		tokenId: tokenId,
		chainId,
		collectionAddress,
		filters: {
			currencies: [price.currency.contractAddress],
		},
	});

	const floorPriceRaw = listing?.order?.priceAmount;

	const { data: priceComparison, isLoading: comparisonLoading } =
		useComparePrices({
			chainId,
			priceAmountRaw: price.amountRaw || '0',
			priceCurrencyAddress: price.currency.contractAddress,
			compareToPriceAmountRaw: floorPriceRaw || '0',
			compareToPriceCurrencyAddress:
				listing?.order?.priceCurrencyAddress || price.currency.contractAddress,
			query: {
				enabled: !!floorPriceRaw && !listingLoading && price.amountRaw !== '0',
			},
		});

	if (
		!floorPriceRaw ||
		listingLoading ||
		price.amountRaw === '0' ||
		comparisonLoading
	) {
		return null;
	}

	let floorPriceDifferenceText = 'Same as floor price';

	if (priceComparison) {
		if (priceComparison.status === 'same') {
			floorPriceDifferenceText = 'Same as floor price';
		} else {
			floorPriceDifferenceText = `${priceComparison.percentageDifferenceFormatted}% ${
				priceComparison.status === 'below' ? 'below' : 'above'
			} floor price`;
		}
	}

	return (
		<Text
			fontSize={'small'}
			fontWeight={'medium'}
			textAlign={'left'}
			width={'full'}
			color={'text50'}
			fontFamily="body"
		>
			{floorPriceDifferenceText}
		</Text>
	);
}
