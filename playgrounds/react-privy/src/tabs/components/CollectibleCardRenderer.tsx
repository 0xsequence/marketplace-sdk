import { CollectibleCard } from '@0xsequence/marketplace-sdk/react';
import { Link } from 'react-router';
import type { CollectibleCardProps } from '../../../../../sdk/src/react/ui/components/marketplace-collectible-card';

interface CollectibleCardRendererProps {
	index: number;
	collectibleCard: CollectibleCardProps;
	isLoading: boolean;
}

export function CollectibleCardRenderer({
	index,
	collectibleCard,
	isLoading,
}: CollectibleCardRendererProps) {
	if (collectibleCard.marketplaceType === 'shop') {
		const now = new Date();
		const saleStartsAt = collectibleCard.saleStartsAt
			? new Date(collectibleCard.saleStartsAt)
			: null;
		const saleEndsAt = collectibleCard.saleEndsAt
			? new Date(collectibleCard.saleEndsAt)
			: null;

		const isSaleActive =
			saleStartsAt && saleEndsAt && saleStartsAt <= now && saleEndsAt >= now;

		// If sale is not active, don't render the card
		if (!isSaleActive) {
			return null;
		}
	}

	return (
		<div
			key={index}
			className="flex w-full min-w-[175px] items-stretch justify-center"
		>
			<Link to={'/collectible'} key={collectibleCard.collectibleId}>
				<CollectibleCard
					{...collectibleCard}
					cardLoading={collectibleCard.cardLoading || isLoading}
				/>
			</Link>
		</div>
	);
}
