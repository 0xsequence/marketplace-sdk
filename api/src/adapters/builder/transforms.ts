/**
 * Builder API Transformation Functions
 *
 * Bidirectional transformations between raw Builder API types and normalized types.
 */

import {
	normalizeAddress,
	normalizeChainId,
	normalizeTokenId,
	toApiTokenId,
} from '../../utils/normalize';
import { transformArray } from '../../utils/transform';
import type * as BuilderGen from './builder.gen';
import type * as Builder from './types';

// ============================================================================
// Normalization Functions (API → Internal)
// ============================================================================

/**
 * Normalize LookupMarketplaceReturn from API to internal format
 * Nests collections within their respective market/shop pages
 */
export function toLookupMarketplaceReturn(
	data: BuilderGen.LookupMarketplaceReturn,
): Builder.LookupMarketplaceReturn {
	const marketCollections = transformArray(
		data.marketCollections,
		toMarketCollection,
	);
	const shopCollections = transformArray(
		data.shopCollections,
		toShopCollection,
	);

	return {
		marketplace: {
			...data.marketplace,
			market: {
				...data.marketplace.market,
				collections: marketCollections,
			},
			shop: {
				...data.marketplace.shop,
				collections: shopCollections,
			},
		},
	};
}

/**
 * Normalize MarketCollection from API to internal format
 * Adds marketplaceCollectionType discriminator for type narrowing
 */
export function toMarketCollection(
	data: BuilderGen.MarketCollection,
): Builder.MarketCollection {
	return {
		...data,
		marketplaceCollectionType: 'market' as const,
		chainId: normalizeChainId(data.chainId),
		itemsAddress: normalizeAddress(data.itemsAddress),
		contractType: data.contractType as Builder.MarketCollection['contractType'],
		destinationMarketplace:
			data.destinationMarketplace as Builder.MarketCollection['destinationMarketplace'],
	};
}

/**
 * Normalize ShopCollection from API to internal format
 * Adds marketplaceCollectionType discriminator for type narrowing
 */
export function toShopCollection(
	data: BuilderGen.ShopCollection,
): Builder.ShopCollection {
	return {
		...data,
		marketplaceCollectionType: 'shop' as const,
		chainId: normalizeChainId(data.chainId),
		itemsAddress: normalizeAddress(data.itemsAddress),
		saleAddress: normalizeAddress(data.saleAddress),
		tokenIds: transformArray(data.tokenIds, normalizeTokenId),
		customTokenIds: transformArray(data.customTokenIds, normalizeTokenId),
	};
}

// ============================================================================
// Denormalization Functions (Internal → API)
// ============================================================================

/**
 * Convert LookupMarketplaceReturn from internal to API format
 * Extracts nested collections back to flat arrays
 */
export function fromLookupMarketplaceReturn(
	data: Builder.LookupMarketplaceReturn,
): BuilderGen.LookupMarketplaceReturn {
	const marketCollections = transformArray(
		data.marketplace.market.collections,
		fromMarketCollection,
	);
	const shopCollections = transformArray(
		data.marketplace.shop.collections,
		fromShopCollection,
	);

	return {
		marketplace: {
			...data.marketplace,
			market: {
				enabled: data.marketplace.market.enabled,
				bannerUrl: data.marketplace.market.bannerUrl,
				ogImage: data.marketplace.market.ogImage,
				private: data.marketplace.market.private,
			},
			shop: {
				enabled: data.marketplace.shop.enabled,
				bannerUrl: data.marketplace.shop.bannerUrl,
				ogImage: data.marketplace.shop.ogImage,
				private: data.marketplace.shop.private,
			},
		},
		marketCollections,
		shopCollections,
	};
}

/**
 * Convert MarketCollection from internal to API format
 * Removes marketplaceCollectionType discriminator (API doesn't have it)
 * Note: Address types (0x${string}) are compatible with string, no conversion needed
 */
export function fromMarketCollection(
	data: Builder.MarketCollection,
): BuilderGen.MarketCollection {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { marketplaceCollectionType, ...rest } = data;
	return rest;
}

/**
 * Convert ShopCollection from internal to API format
 * Removes marketplaceCollectionType discriminator (API doesn't have it)
 * Note: Address types (0x${string}) are compatible with string, no conversion needed
 */
export function fromShopCollection(
	data: Builder.ShopCollection,
): BuilderGen.ShopCollection {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { marketplaceCollectionType, ...rest } = data;
	return {
		...rest,
		tokenIds: transformArray(rest.tokenIds, toApiTokenId),
		customTokenIds: transformArray(rest.customTokenIds, toApiTokenId),
	};
}
