import type { Currency } from './api-types';

export type Price = {
	amountRaw: string;
	currency: Currency;
};

export enum MarketplaceType {
	MARKET = 'market',
	SHOP = 'shop',
}

// export type Order = Omit<APIOrder, 'priceAmount' | 'priceAmountNet'> & {
// 	priceAmount: bigint;
// 	priceAmountNet: bigint;
// };
