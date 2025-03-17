'use client';

import { useState } from 'react';

import Pill from './Pill';
import { Image, Text } from '@0xsequence/design-system';
import { getMarketplaceDetails } from '../../../../../../packages/sdk/src';
import { MarketplaceKind } from '../../../../../../packages/sdk/src';

const MarketplacePill = ({
	originName,
	marketplace: marketplaceKind,
}: {
	originName: string;
	marketplace: MarketplaceKind;
}) => {
	const [isImageError, setIsImageError] = useState(false);
	const marketplaceDetails = getMarketplaceDetails({
		originName: originName,
		kind: marketplaceKind,
	});

	const onImageError = () => {
		setIsImageError(true);
	};

	if (!marketplaceDetails) {
		return (
			<Pill>
				<Text color="text100" fontSize="xsmall" fontWeight="bold">
					Unknown
				</Text>
			</Pill>
		);
	}

	return (
		<Pill>
			{isImageError ? (
				<Image src="/images/chess-tile" alt="chess-tile" width={3} height={3} />
			) : (
				<Image
					src={marketplaceDetails.logo as unknown as string}
					alt="marketplace-logo"
					width={3}
					height={3}
					onError={onImageError}
				/>
			)}

			<Text color="text100" fontSize="xsmall" fontWeight="bold">
				{marketplaceDetails.displayName}
			</Text>
		</Pill>
	);
};

export default MarketplacePill;
