import { type Dnum, divide, format, from, multiply } from 'dnum';
import type { Currency } from '../types';

/**
 * Normalize decimals between two dnum values
 * @param amount - Amount to normalize
 * @param currentDecimals - Current decimal places
 * @param targetDecimals - Target decimal places
 * @returns Normalized dnum
 */
function normalizeDecimals(
	amount: Dnum,
	currentDecimals: number,
	targetDecimals: number,
): Dnum {
	if (currentDecimals === targetDecimals) {
		return amount;
	}

	if (currentDecimals < targetDecimals) {
		// Scale up
		const multiplier = 10n ** BigInt(targetDecimals - currentDecimals);
		return [amount[0] * multiplier, targetDecimals];
	}

	// Scale down
	const divisor = 10n ** BigInt(currentDecimals - targetDecimals);
	return [amount[0] / divisor, targetDecimals];
}

/**
 * Convert an amount from one currency to another using exchange rate
 * @param amount - The amount to convert as dnum
 * @param fromCurrency - Source currency info
 * @param toCurrency - Target currency info
 * @param exchangeRate - Exchange rate (fromCurrency per toCurrency)
 * @returns Converted amount as dnum
 */
export function convertPrice(
	amount: Dnum,
	fromCurrency: Currency,
	toCurrency: Currency,
	exchangeRate: number,
): Dnum {
	if (fromCurrency.contractAddress === toCurrency.contractAddress) {
		return amount; // Same currency, no conversion needed
	}

	// Convert exchange rate to dnum with target currency decimals
	const rate = from(exchangeRate.toString(), toCurrency.decimals);

	// Handle decimal differences between currencies
	if (fromCurrency.decimals !== toCurrency.decimals) {
		// First normalize to common decimals, then apply rate
		const normalizedAmount = normalizeDecimals(
			amount,
			fromCurrency.decimals,
			toCurrency.decimals,
		);
		return multiply(normalizedAmount, rate);
	}

	return multiply(amount, rate);
}

/**
 * Convert USD value to native token (ETH) using exchange rate
 * @param usdAmount - USD amount as dnum
 * @param ethUsdRate - ETH price in USD
 * @returns ETH amount as dnum
 */
export function convertUsdToEth(usdAmount: Dnum, ethUsdRate: number): Dnum {
	const rate = from(ethUsdRate.toString(), 18); // ETH has 18 decimals
	return divide(usdAmount, rate);
}

/**
 * Convert native token (ETH) to USD using exchange rate
 * @param ethAmount - ETH amount as dnum
 * @param ethUsdRate - ETH price in USD
 * @returns USD amount as dnum
 */
export function convertEthToUsd(ethAmount: Dnum, ethUsdRate: number): Dnum {
	const rate = from(ethUsdRate.toString(), 2); // USD typically has 2 decimals
	return multiply(ethAmount, rate);
}

/**
 * Format amount in multiple currencies for display
 * @param amount - Base amount as dnum
 * @param baseCurrency - Base currency info
 * @param targetCurrencies - Array of target currencies with exchange rates
 * @returns Array of formatted price strings
 */
export function formatMultiCurrency(
	amount: Dnum,
	baseCurrency: Currency,
	targetCurrencies: Array<{
		currency: Currency;
		exchangeRate: number;
	}>,
): Array<{ symbol: string; formatted: string; value: Dnum }> {
	return targetCurrencies.map(({ currency, exchangeRate }) => {
		const convertedAmount = convertPrice(
			amount,
			baseCurrency,
			currency,
			exchangeRate,
		);

		return {
			symbol: currency.symbol,
			formatted: formatForDisplay(convertedAmount, currency),
			value: convertedAmount,
		};
	});
}

/**
 * Format a dnum amount for display with currency symbol
 * @param amount - Amount as dnum
 * @param currency - Currency info for formatting
 * @param options - Display options
 * @returns Formatted price string
 */
export function formatForDisplay(
	amount: Dnum,
	currency: Currency,
	options?: {
		compact?: boolean;
		maxDecimals?: number;
		showSymbol?: boolean;
	},
): string {
	const formatted = format(amount, {
		digits: options?.maxDecimals ?? Math.min(currency.decimals, 6),
		compact: options?.compact ?? false,
		trailingZeros: false,
	});

	return options?.showSymbol !== false
		? `${currency.symbol} ${formatted}`
		: formatted;
}

/**
 * Compare two amounts, handling different currencies if exchange rate provided
 * @param a - First amount
 * @param b - Second amount
 * @param currencyA - Currency of first amount
 * @param currencyB - Currency of second amount
 * @param exchangeRate - Optional exchange rate if currencies differ
 * @returns -1 if a < b, 0 if equal, 1 if a > b
 */
export function compareAmounts(
	a: Dnum,
	b: Dnum,
	currencyA: Currency,
	currencyB: Currency,
	exchangeRate?: number,
): number {
	let normalizedB = b;

	// Convert to same currency if needed
	if (currencyA.contractAddress !== currencyB.contractAddress && exchangeRate) {
		normalizedB = convertPrice(b, currencyB, currencyA, exchangeRate);
	}

	// Handle decimal normalization
	if (a[1] !== normalizedB[1]) {
		const maxDecimals = Math.max(a[1], normalizedB[1]);
		const normalizedA = normalizeDecimals(a, a[1], maxDecimals);
		normalizedB = normalizeDecimals(normalizedB, normalizedB[1], maxDecimals);

		if (normalizedA[0] < normalizedB[0]) return -1;
		if (normalizedA[0] > normalizedB[0]) return 1;
		return 0;
	}

	// Same decimals, direct comparison
	if (a[0] < normalizedB[0]) return -1;
	if (a[0] > normalizedB[0]) return 1;
	return 0;
}

/**
 * Check if a currency is a native token (ETH, MATIC, etc.)
 * @param currency - Currency to check
 * @returns True if native token
 */
export function isNativeToken(currency: Currency): boolean {
	return (
		currency.contractAddress === '0x0000000000000000000000000000000000000000' ||
		currency.contractAddress === '' ||
		currency.contractAddress.toLowerCase() ===
			'0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
	);
}

/**
 * Get standard decimals for common currencies
 * @param symbol - Currency symbol
 * @returns Standard decimal places
 */
export function getStandardDecimals(symbol: string): number {
	const standardDecimals: Record<string, number> = {
		ETH: 18,
		WETH: 18,
		USDC: 6,
		USDT: 6,
		DAI: 18,
		MATIC: 18,
		BNB: 18,
	};

	return standardDecimals[symbol.toUpperCase()] ?? 18;
}
