import { CollectibleCard } from '../CollectibleCard';
import { CollectibleCardType, type InventoryCardProps } from '../types';

type InventoryCollectibleCardProps = InventoryCardProps;

export function InventoryCollectibleCard({
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
}: InventoryCollectibleCardProps) {
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
			cardType={CollectibleCardType.INVENTORY}
		/>
	);
}
