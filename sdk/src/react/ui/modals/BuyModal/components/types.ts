import type { CheckoutOptions } from '../../../../_internal';

export interface ShopData {
	salesContractAddress: string;
	items: Array<{ tokenId?: string; quantity?: string }>;
	salePrice?: { currencyAddress?: string; amount?: string };
	checkoutOptions?: CheckoutOptions;
}
