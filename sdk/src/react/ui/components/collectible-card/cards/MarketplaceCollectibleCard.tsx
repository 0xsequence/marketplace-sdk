import { CollectibleCard } from '../CollectibleCard';
import type { MarketplaceCardProps } from '../types';

type MarketplaceCollectibleCardProps = MarketplaceCardProps;

export function MarketplaceCollectibleCard({
	chainId,
	collectionAddress,
	collectible,
	collectibleId,
	collectionType,
	cardLoading,
	supply,
	balance,
	balanceIsLoading,
	onCannotPerformAction,
	onCollectibleClick,
	onOfferClick,
	orderbookKind,
}: MarketplaceCollectibleCardProps) {
	return (
		<CollectibleCard
			chainId={chainId}
			collectionAddress={collectionAddress}
			collectible={collectible}
			collectibleId={collectibleId}
			collectionType={collectionType}
			cardLoading={cardLoading}
			balance={balance}
			balanceIsLoading={balanceIsLoading}
			supply={supply}
			onCannotPerformAction={onCannotPerformAction}
			onCollectibleClick={onCollectibleClick}
			onOfferClick={onOfferClick}
			orderbookKind={orderbookKind}
			cardType="marketplace"
		/>
	);
}
