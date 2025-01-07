import { Text } from '@0xsequence/design-system';
import type { Hex } from 'viem';
import type { Price } from '../../../../../../types';
import { calculatePriceDifferencePercentage } from '../../../../../../utils';
import { useLowestListing } from '../../../../../hooks';

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

	if (!floorPriceRaw || listingLoading || price.amountRaw === '0') {
		return null;
	}

	const floorPriceDifference = calculatePriceDifferencePercentage({
		inputPriceRaw: BigInt(price.amountRaw),
		basePriceRaw: BigInt(floorPriceRaw),
		decimals: price.currency.decimals,
	});

	const floorPriceDifferenceText =
		floorPriceRaw === price.amountRaw
			? 'Same as floor price'
			: `${floorPriceDifference}% ${floorPriceRaw > price.amountRaw ? 'below' : 'above'} floor price`;

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
