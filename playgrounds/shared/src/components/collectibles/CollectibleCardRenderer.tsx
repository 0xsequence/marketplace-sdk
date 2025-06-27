import type { CollectibleCardProps } from '@0xsequence/marketplace-sdk/react';
import { CollectibleCard } from '@0xsequence/marketplace-sdk/react';
import { useLink } from '../ui/LinkProvider';

interface CollectibleCardRendererProps {
	index?: number;
	collectibleCard: CollectibleCardProps;
	isLoading?: boolean;
	route?: string;
	validateSale?: boolean;
	className?: string;
}

export function CollectibleCardRenderer({
	index,
	collectibleCard,
	isLoading = false,
	route,
	validateSale = false,
	className = 'flex w-full min-w-[175px] items-stretch justify-center',
}: CollectibleCardRendererProps) {
	const AppLink = useLink();

	// Sale validation logic for shop marketplace type
	if (validateSale && collectibleCard.marketplaceType === 'shop') {
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

	const collectibleRoute =
		route ??
		`/${collectibleCard.collectionAddress}/${collectibleCard.collectibleId}`;

	return (
		<div key={index} className={className}>
			<AppLink href={collectibleRoute} key={collectibleCard.collectibleId}>
				<CollectibleCard
					{...collectibleCard}
					cardLoading={collectibleCard.cardLoading || isLoading}
				/>
			</AppLink>
		</div>
	);
}
