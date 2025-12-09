'use client';

import { Text } from '@0xsequence/design-system';
import {
	getMarketplaceDetails,
	type MarketplaceKind,
} from '@0xsequence/marketplace-sdk';
import Pill from './Pill';

const MarketplacePill = ({
	originName,
	marketplace: marketplaceKind,
}: {
	originName: string;
	marketplace: MarketplaceKind;
}) => {
	const marketplaceDetails = getMarketplaceDetails({
		originName,
		kind: marketplaceKind,
	});

	if (!marketplaceDetails) {
		return (
			<Pill>
				<Text color="text100" className="text-xs" fontWeight="bold">
					Unknown
				</Text>
			</Pill>
		);
	}

	return (
		<Pill>
			<Text className="font-bold text-xs">
				{marketplaceDetails.displayName}
			</Text>
		</Pill>
	);
};

export default MarketplacePill;
