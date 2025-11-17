/**
 * Builder API Transformation Functions
 *
 * Bidirectional transformations between raw Builder API types and normalized types.
 */

import { normalizeChainId } from '../../utils/chain';
import { normalizeTokenId, toApiTokenId } from '../../utils/token';
import { spreadWith, transformArray } from '../../utils/transform';
import type * as BuilderGen from './builder.gen';
import type * as Builder from './types';

// ============================================================================
// Normalization Functions (API → Internal)
// ============================================================================

/**
 * Normalize LookupMarketplaceReturn from API to internal format
 */
export function toLookupMarketplaceReturn(
	data: BuilderGen.LookupMarketplaceReturn,
): Builder.LookupMarketplaceReturn {
	return spreadWith(data, {
		marketCollections: transformArray(
			data.marketCollections,
			toMarketCollection,
		),
		shopCollections: transformArray(data.shopCollections, toShopCollection),
	});
}

/**
 * Normalize MarketCollection from API to internal format
 */
export function toMarketCollection(
	data: BuilderGen.MarketCollection,
): Builder.MarketCollection {
	return spreadWith(data, {
		chainId: normalizeChainId(data.chainId),
	});
}

/**
 * Normalize ShopCollection from API to internal format
 */
export function toShopCollection(
	data: BuilderGen.ShopCollection,
): Builder.ShopCollection {
	return spreadWith(data, {
		chainId: normalizeChainId(data.chainId),
		tokenIds: transformArray(data.tokenIds, normalizeTokenId),
		customTokenIds: transformArray(data.customTokenIds, normalizeTokenId),
	});
}

// ============================================================================
// Denormalization Functions (Internal → API)
// ============================================================================

/**
 * Convert LookupMarketplaceReturn from internal to API format
 */
export function fromLookupMarketplaceReturn(
	data: Builder.LookupMarketplaceReturn,
): BuilderGen.LookupMarketplaceReturn {
	return spreadWith(data, {
		marketCollections: transformArray(
			data.marketCollections,
			fromMarketCollection,
		),
		shopCollections: transformArray(data.shopCollections, fromShopCollection),
	});
}

/**
 * Convert MarketCollection from internal to API format
 */
export function fromMarketCollection(
	data: Builder.MarketCollection,
): BuilderGen.MarketCollection {
	return data; // chainId is already number in normalized format
}

/**
 * Convert ShopCollection from internal to API format
 */
export function fromShopCollection(
	data: Builder.ShopCollection,
): BuilderGen.ShopCollection {
	return spreadWith(data, {
		tokenIds: transformArray(data.tokenIds, toApiTokenId),
		customTokenIds: transformArray(data.customTokenIds, toApiTokenId),
	});
}
