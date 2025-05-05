import { CollectibleCard } from '../CollectibleCard';
import { CollectibleCardType, type InventoryCardProps } from '../types';

export function InventoryCollectibleCard({
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
}: InventoryCardProps) {
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
			cardType={CollectibleCardType.INVENTORY}
		/>
	);
}
