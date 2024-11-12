import { Text } from '@0xsequence/design-system';
import { useLowestListing } from '@react-hooks/useLowestListing';
import type { Price } from '@types';
import type { Hex } from 'viem';
import { calculatePriceDifferencePercentage } from '../../../../../../utils';

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
		>
			{floorPriceDifferenceText}
		</Text>
	);
}
