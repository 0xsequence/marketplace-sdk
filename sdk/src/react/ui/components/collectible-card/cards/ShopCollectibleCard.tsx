import { CollectibleCard } from '../CollectibleCard';
import { CollectibleCardType, type ShopCardProps } from '../types';

type StoreCollectibleCardProps = ShopCardProps;

export function ShopCollectibleCard({
	chainId,
	collectionAddress,
	collectible,
	collectibleId,
	cardLoading,
	supply,
}: StoreCollectibleCardProps) {
	return (
		<CollectibleCard
			chainId={chainId}
			collectionAddress={collectionAddress}
			collectible={collectible}
			collectibleId={collectibleId}
			cardLoading={cardLoading}
			// we don't need to check balance for store
			balanceIsLoading={false}
			supply={supply}
			cardType={CollectibleCardType.SHOP}
		/>
	);
}
