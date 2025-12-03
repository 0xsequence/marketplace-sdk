import type { Currency } from './api-types';
import type { MarketplaceConfig } from './new-marketplace-types';

export * from './new-marketplace-types';

export type Price = {
	amountRaw: string;
	currency: Currency;
};

export type CardType = 'market' | 'shop' | 'inventory-non-tradable';

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
