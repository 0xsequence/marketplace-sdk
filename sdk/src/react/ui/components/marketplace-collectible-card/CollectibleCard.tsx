import { MarketplaceType } from '../../../../types';
import { MarketplaceCollectibleCard } from './MarketplaceCollectibleCard';
import type { CollectibleCardProps } from './types';

export function CollectibleCard(props: CollectibleCardProps) {
	const {
		chainId,
		collectionAddress,
		collectionType,
		assetSrcPrefixUrl,
		cardLoading,
		collectibleId,
	} = props;

	return (
		<MarketplaceCollectibleCard
			chainId={chainId}
			collectionAddress={collectionAddress}
			collectionType={collectionType}
			assetSrcPrefixUrl={assetSrcPrefixUrl}
			cardLoading={cardLoading}
			collectibleId={collectibleId}
			marketplaceType={props.marketplaceType}
			{...getSpecificProps(props)}
		/>
	);
}

function getSpecificProps(props: CollectibleCardProps) {
	if (props.marketplaceType === MarketplaceType.MARKET) {
		const {
			orderbookKind,
			collectible,
			onCollectibleClick,
			onOfferClick,
			balance,
			balanceIsLoading,
			onCannotPerformAction,
			prioritizeOwnerActions,
		} = props;

		return {
			orderbookKind,
			collectible,
			onCollectibleClick,
			onOfferClick,
			balance,
			balanceIsLoading,
			onCannotPerformAction,
			prioritizeOwnerActions,
		};
	}

	if (props.marketplaceType === MarketplaceType.SHOP) {
		const {
			salesContractAddress,
			tokenMetadata,
			salePrice,
			saleStartsAt,
			saleEndsAt,
			quantityInitial,
			quantityRemaining,
		} = props;

		return {
			quantityInitial,
			quantityRemaining,
			salesContractAddress,
			tokenMetadata,
			salePrice,
			saleStartsAt,
			saleEndsAt,
		};
	}
	return {};
}
