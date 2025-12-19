'use client';

import { ContractType } from '@0xsequence/api-client';
import type { CardType } from '../../../../../types';
import { useCurrency } from '../../../../hooks/currency/currency';
import type { ShopCollectibleCardProps } from '../types';
import { getShopCardState, renderSkeletonIfLoading } from '../utils';
import { ShopCardPresentation } from './ShopCardPresentation';

/**
 * ShopCard - Smart component with built-in data fetching
 *
 * This component handles currency fetching and shop state calculation automatically.
 * Use this for convenient plug-and-play integration.
 *
 * For full control over data fetching (e.g., SSR/SSG), use ShopCardPresentation instead.
 *
 * @example
 * ```tsx
 * <ShopCard
 *   tokenId="123"
 *   chainId={1}
 *   collectionAddress="0x..."
 *   tokenMetadata={metadata}
 *   salePrice={salePrice}
 * />
 * ```
 */
export function ShopCard({
	tokenId,
	chainId,
	collectionAddress,
	collectionType,
	assetSrcPrefixUrl,
	cardLoading,
	cardType,
	salesContractAddress,
	tokenMetadata,
	salePrice,
	quantityInitial,
	quantityRemaining,
	unlimitedSupply,
	hideQuantitySelector,
	classNames,
}: ShopCollectibleCardProps) {
	const { data: saleCurrency, isLoading: saleCurrencyLoading } = useCurrency({
		chainId,
		currencyAddress: salePrice?.currencyAddress,
		query: {
			enabled:
				!!salePrice?.currencyAddress &&
				!!salesContractAddress &&
				collectionType === ContractType.ERC1155,
		},
	});

	if (!tokenMetadata || !salePrice) {
		console.error('Token metadata or sale price is undefined', {
			tokenMetadata,
			salePrice,
		});
		return null;
	}

	// Show loading skeleton
	const skeleton = renderSkeletonIfLoading({
		cardLoading,
		balanceIsLoading: saleCurrencyLoading,
		collectionType,
		isShop: true,
	});
	if (skeleton) return skeleton;

	// Calculate shop card state (stock availability, styling)
	const shopState = getShopCardState({
		quantityRemaining,
		quantityInitial,
		unlimitedSupply,
		collectionType,
		salesContractAddress,
	});

	return (
		<ShopCardPresentation
			tokenId={tokenId}
			chainId={chainId}
			collectionAddress={collectionAddress}
			collectionType={collectionType as ContractType}
			tokenMetadata={tokenMetadata}
			saleCurrency={saleCurrency}
			salePrice={salePrice}
			assetSrcPrefixUrl={assetSrcPrefixUrl}
			shopState={shopState}
			cardType={cardType as CardType}
			salesContractAddress={salesContractAddress}
			quantityRemaining={quantityRemaining}
			unlimitedSupply={unlimitedSupply}
			hideQuantitySelector={hideQuantitySelector}
			classNames={classNames}
		/>
	);
}
