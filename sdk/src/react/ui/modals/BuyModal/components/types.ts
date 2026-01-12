import type { Address } from '@0xsequence/api-client';
import type { CheckoutOptions } from '../../../../_internal';

export type ShopData = {
	salesContractAddress: Address;
	item: { tokenId?: bigint; quantity?: bigint };
	salePrice?: { currencyAddress?: Address; amount?: bigint };
	checkoutOptions?: CheckoutOptions;
};
