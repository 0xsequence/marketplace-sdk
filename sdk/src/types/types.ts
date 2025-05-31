import type { Currency } from './api-types';
import type { MarketplaceConfig } from './new-marketplace-types';
export * from './new-marketplace-types';

export type Price = {
	amountRaw: string;
	currency: Currency;
};

export const MARKETPLACE_TYPES = {
	MARKET: 'market',
	SHOP: 'shop',
} as const;

export type MarketplaceType =
	(typeof MARKETPLACE_TYPES)[keyof typeof MARKETPLACE_TYPES];

export enum CollectibleCardAction {
	BUY = 'Buy',
	SELL = 'Sell',
	LIST = 'Create listing',
	OFFER = 'Make an offer',
	TRANSFER = 'Transfer',
}

export type MarketCollection =
	MarketplaceConfig['market']['collections'][number];

export type ShopCollection = MarketplaceConfig['shop']['collections'][number];

// export type Order = Omit<APIOrder, 'priceAmount' | 'priceAmountNet'> & {
// 	priceAmount: bigint;
// 	priceAmountNet: bigint;
// };
