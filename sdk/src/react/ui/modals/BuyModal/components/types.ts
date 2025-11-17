import type { CheckoutOptions } from '../../../../_internal';

export interface ShopData {
	salesContractAddress: string;
	items: Array<{ tokenId?: bigint; quantity?: bigint }>;
	salePrice?: { currencyAddress?: string; amount?: bigint };
	checkoutOptions?: CheckoutOptions;
}
