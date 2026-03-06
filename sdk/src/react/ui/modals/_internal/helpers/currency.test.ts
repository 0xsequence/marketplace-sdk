import { OrderbookKind } from '@0xsequence/api-client';
import * as MarketplaceMocks from '@0xsequence/api-client/mocks/marketplace';
import { describe, expect, it } from 'vitest';
import type { Currency } from '../../../../_internal';
import { filterCurrenciesForOrderbook } from './currency';

const { mockCurrencies } = MarketplaceMocks;
const typedMockCurrencies: Currency[] = mockCurrencies.map((currency) => ({
	...currency,
	contractAddress: currency.contractAddress as `0x${string}`,
}));

describe('filterCurrenciesForOrderbook', () => {
	it('should apply OpenSea listing currency limits to Magic Eden orderbooks', () => {
		const filteredCurrencies = filterCurrenciesForOrderbook(
			typedMockCurrencies,
			OrderbookKind.magic_eden,
			1,
			'listing',
		);

		expect(filteredCurrencies).toHaveLength(1);
		expect(filteredCurrencies[0]?.contractAddress).toBe(
			typedMockCurrencies[0]?.contractAddress,
		);
	});
});
