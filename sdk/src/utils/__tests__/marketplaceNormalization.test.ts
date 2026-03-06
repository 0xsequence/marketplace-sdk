import { MarketplaceKind, OrderbookKind } from '@0xsequence/api-client';
import * as BuilderMocks from '@0xsequence/api-client/mocks/builder';
import * as MarketplaceMocks from '@0xsequence/api-client/mocks/marketplace';
import { describe, expect, it } from 'vitest';
import { toLookupMarketplaceReturn } from '../../../../api/src/adapters/builder/transforms';
import { toOrder } from '../../../../api/src/adapters/marketplace/transforms';

const { mockConfig } = BuilderMocks;
const { mockOrder } = MarketplaceMocks;

describe('marketplace normalization adapters', () => {
	it('should map Magic Eden destination marketplaces to OpenSea', () => {
		const normalizedConfig = toLookupMarketplaceReturn({
			...mockConfig,
			marketCollections: mockConfig.marketCollections.map((collection, index) =>
				index === 1
					? {
						...collection,
						destinationMarketplace: OrderbookKind.magic_eden,
					}
					: collection,
			),
		});

		expect(
			normalizedConfig.marketplace.market.collections[1]?.destinationMarketplace,
		).toBe(OrderbookKind.opensea);
	});

	it('should map Magic Eden order marketplaces to OpenSea', () => {
		const normalizedOrder = toOrder({
			...mockOrder,
			marketplace: MarketplaceKind.magic_eden,
		});

		expect(normalizedOrder.marketplace).toBe(MarketplaceKind.opensea);
	});
});
