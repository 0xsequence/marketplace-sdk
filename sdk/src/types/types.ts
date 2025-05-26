import type { Currency } from './api-types';
export * from './new-marketplace-types';

export type Price = {
	amountRaw: string;
	currency: Currency;
};

// export type Order = Omit<APIOrder, 'priceAmount' | 'priceAmountNet'> & {
// 	priceAmount: bigint;
// 	priceAmountNet: bigint;
// };
