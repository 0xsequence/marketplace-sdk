// Builder API Transformations
import {
	normalizeAddress,
	normalizeChainId,
	normalizeTokenId,
	toApiTokenId,
} from '../../utils/normalize';
import { transformArray } from '../../utils/transform';
import type * as BuilderGen from './builder.gen';
import type * as Builder from './types';

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
		marketCollections,
		shopCollections,
	};
}

export function toMarketCollection(
	data: BuilderGen.MarketCollection,
): Builder.MarketCollection {
	return {
		...data,
		marketplaceCollectionType: 'market' as const, // Intentional SDK addition
		chainId: normalizeChainId(data.chainId),
		itemsAddress: normalizeAddress(data.itemsAddress),
		contractType: data.contractType as Builder.MarketCollection['contractType'],
		destinationMarketplace:
			data.destinationMarketplace as Builder.MarketCollection['destinationMarketplace'],
	};
}

export function toShopCollection(
	data: BuilderGen.ShopCollection,
): Builder.ShopCollection {
	return {
		...data,
		marketplaceCollectionType: 'shop' as const, // Intentional SDK addition
		chainId: normalizeChainId(data.chainId),
		itemsAddress: normalizeAddress(data.itemsAddress),
		saleAddress: normalizeAddress(data.saleAddress),
		tokenIds: transformArray(data.tokenIds, normalizeTokenId),
		customTokenIds: transformArray(data.customTokenIds, normalizeTokenId),
	};
}

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

export function fromMarketCollection(
	data: Builder.MarketCollection,
): BuilderGen.MarketCollection {
	// biome-ignore lint/correctness/noUnusedVariables: Destructuring to remove discriminator field
	const { marketplaceCollectionType, ...rest } = data;
	return rest;
}

export function fromShopCollection(
	data: Builder.ShopCollection,
): BuilderGen.ShopCollection {
	// biome-ignore lint/correctness/noUnusedVariables: Destructuring to remove discriminator field
	const { marketplaceCollectionType, ...rest } = data;
	return {
		...rest,
		tokenIds: transformArray(rest.tokenIds, toApiTokenId),
		customTokenIds: transformArray(rest.customTokenIds, toApiTokenId),
	};
}
