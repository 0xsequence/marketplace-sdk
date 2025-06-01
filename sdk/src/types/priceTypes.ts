import type { Dnum } from 'dnum';

// Re-export dnum types for consistency
export type Price = Dnum;

// Price calculation inputs
export interface PriceCalculationProps {
	unitPrice: string;
	quantity: number;
	decimals: number;
	fees?: FeeConfig[];
}

// Fee configuration
export interface FeeConfig {
	type: 'platform' | 'royalty' | 'gas' | 'custom';
	percentage: number;
	name?: string;
	description?: string;
}

// Price calculation results
export interface PriceCalculationResult {
	subtotal: Price;
	fees: Price;
	grandTotal: Price;
	display: {
		subtotal: string;
		fees: string;
		grandTotal: string;
	};
	isValid: boolean;
	contractValue: bigint;
	breakdown: FeeBreakdown[];
}

// Detailed fee breakdown
export interface FeeBreakdown {
	type: FeeConfig['type'];
	name: string;
	percentage: number;
	amount: Price;
	formatted: string;
}

// Currency information
export interface Currency {
	symbol: string;
	name: string;
	decimals: number;
	icon?: string;
}

// Multi-currency price display
export interface MultiCurrencyPrice {
	primary: {
		amount: Price;
		currency: Currency;
		formatted: string;
	};
	secondary?: {
		amount: Price;
		currency: Currency;
		formatted: string;
		exchangeRate: number;
	};
}

// Price validation result
export interface PriceValidationResult {
	isValid: boolean;
	error?: string;
	parsed?: Price;
	warnings?: string[];
}

// Price comparison result
export interface PriceComparisonResult {
	difference: Price;
	percentage: number;
	isHigher: boolean;
	isLower: boolean;
	isEqual: boolean;
}

// Common token configurations
export const TOKEN_CONFIGS = {
	ETH: { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
	USDC: { symbol: 'USDC', name: 'USD Coin', decimals: 6 },
	USDT: { symbol: 'USDT', name: 'Tether USD', decimals: 6 },
	DAI: { symbol: 'DAI', name: 'Dai Stablecoin', decimals: 18 },
	WETH: { symbol: 'WETH', name: 'Wrapped Ethereum', decimals: 18 },
} as const;

export type TokenSymbol = keyof typeof TOKEN_CONFIGS;
