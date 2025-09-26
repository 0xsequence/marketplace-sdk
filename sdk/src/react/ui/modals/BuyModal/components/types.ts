import type { SelectPaymentSettings } from '@0xsequence/checkout';
import type {
	CheckoutOptions,
	CheckoutOptionsSalesContractArgs,
} from '../../../../_internal';

export interface ShopData {
	salesContractAddress: string;
	items: Array<{ tokenId?: string; quantity?: string }>;
	salePrice?: { currencyAddress?: string; amount?: string };
	checkoutOptions?: CheckoutOptions;
}

// https://github.com/0xsequence/web-sdk/blob/60b34de2c81a193fcd0c20ff3081bee51d583fd4/packages/checkout/src/hooks/useERC1155SaleContractCheckout.ts#L139
export type SaleContractSettings = Omit<
	SelectPaymentSettings,
	| 'txData'
	| 'collectibles'
	| 'price'
	| 'currencyAddress'
	| 'recipientAddress'
	| 'targetContractAddress'
>;
export type ERC1155CheckoutOptionsSalesContractArgs = Omit<
	CheckoutOptionsSalesContractArgs,
	'chainId'
> &
	SaleContractSettings;
