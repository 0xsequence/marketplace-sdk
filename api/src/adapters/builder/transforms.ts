/**
 * Builder API Transformation Functions
 *
 * Bidirectional transformations between raw Builder API types and normalized types.
 */

import { normalizeChainId } from '../../utils/chain';
import { normalizeTokenId, toApiTokenId } from '../../utils/token';
import type * as BuilderGen from './builder.gen';
import type * as Builder from './types';

// ============================================================================
// Normalization Functions (API → Internal)
// ============================================================================

/**
 * Normalize LookupMarketplaceArgs from API to internal format
 */
export function toLookupMarketplaceArgs(
	args: BuilderGen.LookupMarketplaceArgs,
): Builder.LookupMarketplaceArgs {
	return {
		projectId: args.projectId,
		domain: args.domain,
		userAddress: args.userAddress,
	};
}

/**
 * Normalize LookupMarketplaceReturn from API to internal format
 */
export function toLookupMarketplaceReturn(
	data: BuilderGen.LookupMarketplaceReturn,
): Builder.LookupMarketplaceReturn {
	return {
		marketplace: toMarketplace(data.marketplace),
		marketCollections: data.marketCollections.map(toMarketCollection),
		shopCollections: data.shopCollections.map(toShopCollection),
	};
}

/**
 * Normalize Marketplace from API to internal format
 */
export function toMarketplace(
	data: BuilderGen.Marketplace,
): Builder.Marketplace {
	return {
		projectId: data.projectId,
		settings: data.settings, // No bigint conversions needed
		market: data.market,
		shop: data.shop,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};
}

/**
 * Normalize MarketCollection from API to internal format
 */
export function toMarketCollection(
	data: BuilderGen.MarketCollection,
): Builder.MarketCollection {
	return {
		id: data.id,
		projectId: data.projectId,
		chainId: normalizeChainId(data.chainId),
		itemsAddress: data.itemsAddress,
		contractType: data.contractType,
		bannerUrl: data.bannerUrl,
		feePercentage: data.feePercentage,
		currencyOptions: data.currencyOptions,
		destinationMarketplace: data.destinationMarketplace,
		filterSettings: data.filterSettings,
		sortOrder: data.sortOrder,
		private: data.private,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};
}

/**
 * Normalize ShopCollection from API to internal format
 */
export function toShopCollection(
	data: BuilderGen.ShopCollection,
): Builder.ShopCollection {
	return {
		id: data.id,
		projectId: data.projectId,
		chainId: normalizeChainId(data.chainId),
		itemsAddress: data.itemsAddress,
		saleAddress: data.saleAddress,
		name: data.name,
		bannerUrl: data.bannerUrl,
		tokenIds: data.tokenIds.map((id) => normalizeTokenId(id)),
		customTokenIds: data.customTokenIds.map((id) => normalizeTokenId(id)),
		sortOrder: data.sortOrder,
		private: data.private,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};
}

// ============================================================================
// Denormalization Functions (Internal → API)
// ============================================================================

/**
 * Convert LookupMarketplaceArgs from internal to API format
 */
export function fromLookupMarketplaceArgs(
	args: Builder.LookupMarketplaceArgs,
): BuilderGen.LookupMarketplaceArgs {
	return {
		projectId: args.projectId,
		domain: args.domain,
		userAddress: args.userAddress,
	};
}

/**
 * Convert LookupMarketplaceReturn from internal to API format
 */
export function fromLookupMarketplaceReturn(
	data: Builder.LookupMarketplaceReturn,
): BuilderGen.LookupMarketplaceReturn {
	return {
		marketplace: fromMarketplace(data.marketplace),
		marketCollections: data.marketCollections.map(fromMarketCollection),
		shopCollections: data.shopCollections.map(fromShopCollection),
	};
}

/**
 * Convert Marketplace from internal to API format
 */
export function fromMarketplace(
	data: Builder.Marketplace,
): BuilderGen.Marketplace {
	return {
		projectId: data.projectId,
		settings: data.settings,
		market: data.market,
		shop: data.shop,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};
}

/**
 * Convert MarketCollection from internal to API format
 */
export function fromMarketCollection(
	data: Builder.MarketCollection,
): BuilderGen.MarketCollection {
	return {
		id: data.id,
		projectId: data.projectId,
		chainId: data.chainId, // Already number
		itemsAddress: data.itemsAddress,
		contractType: data.contractType,
		bannerUrl: data.bannerUrl,
		feePercentage: data.feePercentage,
		currencyOptions: data.currencyOptions,
		destinationMarketplace: data.destinationMarketplace,
		filterSettings: data.filterSettings,
		sortOrder: data.sortOrder,
		private: data.private,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};
}

/**
 * Convert ShopCollection from internal to API format
 */
export function fromShopCollection(
	data: Builder.ShopCollection,
): BuilderGen.ShopCollection {
	return {
		id: data.id,
		projectId: data.projectId,
		chainId: data.chainId, // Already number
		itemsAddress: data.itemsAddress,
		saleAddress: data.saleAddress,
		name: data.name,
		bannerUrl: data.bannerUrl,
		tokenIds: data.tokenIds.map((id) => toApiTokenId(id)),
		customTokenIds: data.customTokenIds.map((id) => toApiTokenId(id)),
		sortOrder: data.sortOrder,
		private: data.private,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};
}
