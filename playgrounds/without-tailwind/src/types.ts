import type {
	ContractInfo,
	MarketCollection,
	ShopCollection,
} from '@0xsequence/marketplace-sdk';

//TODO: Unify collection types in SDK
export type Collection = (MarketCollection | ShopCollection) & ContractInfo;
