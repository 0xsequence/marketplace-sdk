'use client';

import { Button, Text, TokenImage } from '@0xsequence/design-system';
import type { TokenMetadata } from '@0xsequence/metadata';
import type { Order } from '../../../../_internal';
import { getMarketplaceDetails } from '../../../../../utils/getMarketplaceDetails';

interface AlternativeListingCardProps {
	order: Order;
	collectable: TokenMetadata;
	onSelect: () => void;
}

export const AlternativeListingCard = ({
	order,
	collectable,
	onSelect,
}: AlternativeListingCardProps) => {
	const marketplaceDetails = getMarketplaceDetails({
		originName: order.originName,
		kind: order.marketplace,
	});

	const MarketplaceLogo = marketplaceDetails?.logo;

	return (
		<button
			type="button"
			onClick={onSelect}
			className="flex w-full items-center justify-between rounded-lg border border-border-normal bg-surface-raised p-3 transition-colors hover:border-border-hover hover:bg-surface-overlay"
		>
			<div className="flex items-center gap-3">
				{collectable.image && <TokenImage src={collectable.image} size="md" />}
				<div className="flex flex-col items-start gap-1">
					<div className="flex items-center gap-2">
						<Text className="font-body font-medium text-sm text-text-100">
							{order.priceAmountFormatted}
						</Text>
						{MarketplaceLogo && (
							<MarketplaceLogo className="h-4 w-4" aria-hidden="true" />
						)}
					</div>
					<Text className="font-body text-text-50 text-xs">
						{order.quantityRemainingFormatted} available
					</Text>
				</div>
			</div>

			<Button
				variant="primary"
				size="sm"
				label="Select"
				onClick={(e) => {
					e.stopPropagation();
					onSelect();
				}}
			/>
		</button>
	);
};
