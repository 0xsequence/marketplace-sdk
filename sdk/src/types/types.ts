import type { Currency } from './api-types';

export type Price = {
	amountRaw: string;
	currency: Currency;
};

export enum MarketplaceType {
	MARKET = 'market',
	SHOP = 'shop',
}

export enum CollectibleCardAction {
	BUY = 'Buy',
	SELL = 'Sell',
	LIST = 'Create listing',
	OFFER = 'Make an offer',
	TRANSFER = 'Transfer',
}

// export type Order = Omit<APIOrder, 'priceAmount' | 'priceAmountNet'> & {
// 	priceAmount: bigint;
// 	priceAmountNet: bigint;
// };
