import { MarketplaceCollectibleCard } from '../MarketplaceCollectibleCard';
import { CollectibleCardType, type ShopCardProps } from '../types';

export function ShopCollectibleCard({
	chainId,
	collectionAddress,
	collectionType,
	tokenMetadata,
	collectibleId,
	cardLoading,
	supply,
	assetSrcPrefixUrl,
	salesContractAddress,
	salePrice,
}: ShopCardProps) {
	return (
		<MarketplaceCollectibleCard
			chainId={chainId}
			collectionAddress={collectionAddress}
			collectionType={collectionType}
			tokenMetadata={tokenMetadata}
			collectibleId={collectibleId}
			cardLoading={cardLoading}
			supply={supply}
			assetSrcPrefixUrl={assetSrcPrefixUrl}
			salesContractAddress={salesContractAddress}
			cardType={CollectibleCardType.SHOP}
			salePrice={salePrice}
		/>
	);
}
