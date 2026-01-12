import { zeroAddress } from 'viem';
import { OrderbookKind } from '../../../../../types';
import { compareAddress } from '../../../../../utils';
import type { Currency } from '../../../../_internal';
import { getOpenseaCurrencyForChain } from '../../_internal/constants/opensea-currencies';

export function filterCurrenciesForOrderbook(
	currencies: Currency[],
	orderbookKind: OrderbookKind | undefined,
	chainId: number,
): Currency[] {
	if (!currencies || currencies.length === 0) return [];

	if (orderbookKind === OrderbookKind.opensea) {
		const openseaCurrency = getOpenseaCurrencyForChain(chainId, 'listing');
		if (openseaCurrency) {
			return currencies.filter((currency) =>
				compareAddress(currency.contractAddress, openseaCurrency.address),
			);
		}
	}

	return currencies;
}

export function getDefaultCurrency(
	currencies: Currency[],
	orderbookKind: OrderbookKind | undefined,
	modalType: 'listing' | 'offer',
): Currency | null {
	if (currencies.length === 0) return null;

	if (modalType === 'listing') {
		return currencies[0];
	}

	const shouldSkipNative =
		orderbookKind !== OrderbookKind.sequence_marketplace_v2 &&
		currencies.length > 1;

	return shouldSkipNative ? currencies[1] : currencies[0];
}

export function isNativeCurrency(currency: Currency): boolean {
	return currency.contractAddress === zeroAddress;
}

export function isCurrencySupported(
	currency: Currency,
	availableCurrencies: Currency[],
): boolean {
	return availableCurrencies.some((c) =>
		compareAddress(c.contractAddress, currency.contractAddress),
	);
}
