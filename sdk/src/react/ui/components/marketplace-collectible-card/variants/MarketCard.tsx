'use client';

import type { ContractType } from '@0xsequence/api-client';
import { useCurrency } from '../../../../hooks/currency/currency';
import type { MarketCollectibleCardProps } from '../types';
import { determineCardAction, renderSkeletonIfLoading } from '../utils';
import { MarketCardPresentation } from './MarketCardPresentation';

/**
 * MarketCard - Smart component with built-in data fetching
 *
 * This component handles currency fetching and action determination automatically.
 * Use this for convenient plug-and-play integration.
 *
 * For full control over data fetching (e.g., SSR/SSG), use MarketCardPresentation instead.
 *
 * @example
 * ```tsx
 * <MarketCard
 *   tokenId="123"
 *   chainId={1}
 *   collectionAddress="0x..."
 *   collectible={collectible}
 * />
 * ```
 */
export function MarketCard({
	tokenId,
	chainId,
	collectionAddress,
	collectionType,
	assetSrcPrefixUrl,
	cardLoading,
	collectible,
	onCollectibleClick,
	onOfferClick,
	balance,
	balanceIsLoading = false,
	onCannotPerformAction,
	prioritizeOwnerActions,
	hideQuantitySelector,
	classNames,
}: MarketCollectibleCardProps) {
	const collectibleMetadata = collectible?.metadata;
	const highestOffer = collectible?.offer;
	const lowestListing = collectible?.listing;

	// Fetch currency details for the listing price
	const { data: currency } = useCurrency({
		chainId,
		currencyAddress: lowestListing?.priceCurrencyAddress,
		query: {
			enabled: !!lowestListing?.priceCurrencyAddress,
		},
	});

	if (!collectibleMetadata) {
		console.error('Collectible metadata is undefined');
		return null;
	}

	// Show loading skeleton
	const skeleton = renderSkeletonIfLoading({
		cardLoading,
		balanceIsLoading,
		collectionType,
		isShop: false,
	});
	if (skeleton) return skeleton;

	const showActionButton = !!highestOffer || !!collectible;

	const action = determineCardAction({
		hasBalance: !!balance,
		hasOffer: !!highestOffer,
		hasListing: !!lowestListing,
	});

	return (
		<MarketCardPresentation
			tokenId={tokenId}
			chainId={chainId}
			collectionAddress={collectionAddress}
			collectionType={collectionType as ContractType}
			collectibleMetadata={collectibleMetadata}
			currency={currency}
			lowestListing={lowestListing}
			highestOffer={highestOffer}
			balance={balance}
			assetSrcPrefixUrl={assetSrcPrefixUrl}
			onCollectibleClick={onCollectibleClick}
			onOfferClick={onOfferClick}
			action={action}
			showActionButton={showActionButton}
			onCannotPerformAction={onCannotPerformAction}
			prioritizeOwnerActions={prioritizeOwnerActions}
			hideQuantitySelector={hideQuantitySelector}
			classNames={classNames}
		/>
	);
}
