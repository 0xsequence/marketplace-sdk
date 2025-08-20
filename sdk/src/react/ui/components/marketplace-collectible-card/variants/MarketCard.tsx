'use client';

import { CollectibleCardAction } from '../../../../../types';
import { ActionButtonWrapper } from '../components/ActionButtonWrapper';
import { BaseCard } from '../components/BaseCard';
import { Footer } from '../Footer';
import type { MarketCollectibleCardProps } from '../types';

export function MarketCard({
	collectibleId,
	chainId,
	collectionAddress,
	collectionType,
	assetSrcPrefixUrl,
	cardLoading,
	orderbookKind,
	collectible,
	onCollectibleClick,
	onOfferClick,
	balance,
	balanceIsLoading = false,
	onCannotPerformAction,
	prioritizeOwnerActions,
	isTradable,
}: MarketCollectibleCardProps) {
	const collectibleMetadata = collectible?.metadata;
	const highestOffer = collectible?.offer;

	if (!collectibleMetadata) {
		console.error('Collectible metadata is undefined');
		return null;
	}

	const showActionButton =
		!balanceIsLoading && (!!highestOffer || !!collectible) && isTradable;

	const action = (
		balance
			? (highestOffer && CollectibleCardAction.SELL) ||
				(!collectible?.listing && CollectibleCardAction.LIST) ||
				CollectibleCardAction.TRANSFER
			: (collectible?.listing && CollectibleCardAction.BUY) ||
				CollectibleCardAction.OFFER
	) as CollectibleCardAction;

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			onCollectibleClick?.(collectibleId);
		}
	};

	return (
		<BaseCard
			collectibleId={collectibleId}
			chainId={chainId}
			collectionAddress={collectionAddress}
			collectionType={collectionType}
			assetSrcPrefixUrl={assetSrcPrefixUrl}
			cardLoading={cardLoading}
			marketplaceType="market"
			name={collectibleMetadata.name || ''}
			image={collectibleMetadata.image}
			video={collectibleMetadata.video}
			animationUrl={collectibleMetadata.animation_url}
			onClick={() => onCollectibleClick?.(collectibleId)}
			onKeyDown={handleKeyDown}
		>
			<Footer
				chainId={chainId}
				collectionAddress={collectionAddress}
				collectibleId={collectibleId}
				name={collectibleMetadata.name || ''}
				type={collectionType}
				onOfferClick={(e) => onOfferClick?.({ order: highestOffer, e })}
				highestOffer={highestOffer}
				balance={balance}
				decimals={collectibleMetadata.decimals}
				quantityInitial={
					highestOffer?.quantityInitial !== undefined
						? highestOffer.quantityInitial
						: collectible?.listing?.quantityInitial !== undefined
							? collectible.listing.quantityInitial
							: undefined
				}
				quantityRemaining={
					highestOffer?.quantityRemaining !== undefined
						? highestOffer.quantityRemaining
						: collectible?.listing?.quantityRemaining !== undefined
							? collectible.listing.quantityRemaining
							: undefined
				}
				marketplaceType="market"
			/>

			<ActionButtonWrapper
				show={showActionButton ?? false}
				chainId={chainId}
				collectionAddress={collectionAddress}
				tokenId={collectibleId}
				orderbookKind={orderbookKind}
				action={action}
				highestOffer={highestOffer}
				lowestListing={collectible?.listing}
				owned={!!balance}
				onCannotPerformAction={onCannotPerformAction}
				marketplaceType="market"
				prioritizeOwnerActions={prioritizeOwnerActions}
			/>
		</BaseCard>
	);
}
