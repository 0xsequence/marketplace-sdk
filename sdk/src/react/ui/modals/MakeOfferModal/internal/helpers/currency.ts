import type { Address } from 'viem';
import { OrderbookKind } from '../../../../../../types';
import { compareAddress } from '../../../../../../utils';
import type { Currency } from '../../../../../_internal';
import { getOpenseaCurrencyForChain } from '../../../_internal/constants/opensea-currencies';

/**
 * Filter currencies based on orderbook requirements
 * Pure function - no React hooks, fully testable
 */
export function filterCurrenciesForOrderbook(
	currencies: Currency[],
	orderbookKind: OrderbookKind | undefined,
	chainId: number,
): Currency[] {
	if (!currencies || currencies.length === 0) return [];

	// OpenSea has specific currency requirements
	if (orderbookKind === OrderbookKind.opensea) {
		const openseaCurrency = getOpenseaCurrencyForChain(chainId, 'listing');
		if (openseaCurrency) {
			return currencies.filter((currency) =>
				compareAddress(
					currency.contractAddress,
					openseaCurrency.address as Address,
				),
			);
		}
	}

	return currencies;
}

/**
 * Get default currency based on orderbook rules
 * Pure function - no React hooks, fully testable
 */
export function getDefaultCurrency(
	currencies: Currency[],
	orderbookKind: OrderbookKind | undefined,
): Currency | null {
	if (currencies.length === 0) return null;

	// For non-sequence marketplaces with multiple currencies, skip native currency
	const shouldSkipNative =
		orderbookKind !== OrderbookKind.sequence_marketplace_v2 &&
		currencies.length > 1;

	return shouldSkipNative ? currencies[1] : currencies[0];
}

/**
 * Check if a currency is the native currency (0x0000...)
 * Pure function - no React hooks, fully testable
 */
export function isNativeCurrency(currency: Currency): boolean {
	return (
		currency.contractAddress === '0x0000000000000000000000000000000000000000'
	);
}

/**
 * Check if a currency is supported by the available currencies list
 * Pure function - no React hooks, fully testable
 */
export function isCurrencySupported(
	currency: Currency,
	availableCurrencies: Currency[],
): boolean {
	return availableCurrencies.some((c) =>
		compareAddress(c.contractAddress, currency.contractAddress),
	);
}
