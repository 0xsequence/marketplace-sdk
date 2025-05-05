import { CollectibleCard } from '../CollectibleCard';
import { CollectibleCardType, type MarketplaceCardProps } from '../types';

export function MarketplaceCollectibleCard({
	chainId,
	collectionAddress,
	collectible,
	collectibleId,
	collectionType,
	cardLoading,
	balance,
	balanceIsLoading,
	onCannotPerformAction,
	onCollectibleClick,
	onOfferClick,
	orderbookKind,
	assetSrcPrefixUrl,
}: MarketplaceCardProps) {
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
			onCannotPerformAction={onCannotPerformAction}
			onCollectibleClick={onCollectibleClick}
			onOfferClick={onOfferClick}
			orderbookKind={orderbookKind}
			assetSrcPrefixUrl={assetSrcPrefixUrl}
			cardType={CollectibleCardType.MARKETPLACE}
		/>
	);
}
