'use client';

import { Text } from '@0xsequence/design-system';
import {
	type MarketplaceKind,
	getMarketplaceDetails,
} from '../../../../../../sdk/src';
import Pill from './Pill';

const MarketplacePill = ({
	originName,
	marketplace: marketplaceKind,
}: {
	originName: string;
	marketplace: MarketplaceKind;
}) => {
	const marketplaceDetails = getMarketplaceDetails({
		originName: originName,
		kind: marketplaceKind,
	});

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
			<Text className="font-bold text-xs">
				{marketplaceDetails.displayName}
			</Text>
		</Pill>
	);
};

export default MarketplacePill;
