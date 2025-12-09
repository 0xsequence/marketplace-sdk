import type { Address } from 'viem';
import type { CheckoutOptions } from '../../../../_internal';

export interface ShopData {
	salesContractAddress: Address;
	item: { tokenId?: bigint; quantity?: bigint };
	salePrice?: { currencyAddress?: Address; amount?: bigint };
	checkoutOptions?: CheckoutOptions;
}
