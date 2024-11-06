import { Text } from '@0xsequence/design-system';
import { observer } from '@legendapp/state/react';
import { useFloorOrder } from '@react-hooks/useFloorOrder';
import type { Price } from '@types';
import { calculatePriceDifferencePercentage } from '../../../../../../utils';

const FloorPriceText = observer(function FloorPriceText({
	chainId,
	collectionAddress,
	price,
}: {
	chainId: string;
	collectionAddress: string;
	price: Price;
}) {
	const { data: floorOrder, isLoading } = useFloorOrder({
		chainId: chainId,
		collectionAddress,
	});

	const floorPrice = floorOrder?.order?.priceUSD;

	if (!floorPrice || isLoading) {
		return null;
	}

	const listingPrice =
		(Number(price.amountRaw) / 10 ** price.currency.decimals) *
		price.currency.exchangeRate;

	const floorPriceDifference = calculatePriceDifferencePercentage(
		listingPrice,
		floorPrice,
	);

	const floorPriceDifferenceText =
		floorPrice === listingPrice
			? 'Same price as floor price'
			: `${floorPriceDifference}% ${floorPrice > listingPrice ? 'below' : 'above'} floor price`;

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
});

export default FloorPriceText;
