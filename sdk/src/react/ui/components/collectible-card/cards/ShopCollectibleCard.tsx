import { CollectibleCard } from '../CollectibleCard';
import { CollectibleCardType, type ShopCardProps } from '../types';

export function ShopCollectibleCard({
	chainId,
	collectionAddress,
	collectible,
	collectibleId,
	cardLoading,
	supply,
	assetSrcPrefixUrl,
	salesContractAddress,
}: ShopCardProps) {
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
			assetSrcPrefixUrl={assetSrcPrefixUrl}
			salesContractAddress={salesContractAddress}
			cardType={CollectibleCardType.SHOP}
		/>
	);
}
