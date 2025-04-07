import type { Currency } from './api-types';

export type Price = {
	amountRaw: string;
	currency: Currency;
};

// export type Order = Omit<APIOrder, 'priceAmount' | 'priceAmountNet'> & {
// 	priceAmount: bigint;
// 	priceAmountNet: bigint;
// };
