import { MarketplaceCollectibleCard } from '../MarketplaceCollectibleCard';
import { CollectibleCardType, type MarketCardProps } from '../types';

export function MarketCollectibleCard({
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
	prioritizeOwnerActions,
}: MarketCardProps) {
	return (
		<MarketplaceCollectibleCard
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
			prioritizeOwnerActions={prioritizeOwnerActions}
		/>
	);
}
