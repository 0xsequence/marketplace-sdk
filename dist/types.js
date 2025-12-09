import { CollectionStatus, ContractType as ContractType$1, FilterCondition as FilterCondition$1, MarketplaceKind as MarketplaceKind$1, OrderSide as OrderSide$1, OrderStatus, OrderbookKind as OrderbookKind$1, PropertyType, SortOrder, StepType as StepType$1, TransactionCrypto, WalletKind as WalletKind$1 } from "@0xsequence/api-client";

//#region src/types/transactions.ts
/**
* Transaction types supported by the new buy modal
*/
let TransactionType = /* @__PURE__ */ function(TransactionType$1) {
	TransactionType$1["MARKET_BUY"] = "MARKET_BUY";
	TransactionType$1["PRIMARY_SALE"] = "PRIMARY_SALE";
	return TransactionType$1;
}({});
/**
* Native token address constant
*/
const NATIVE_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";

//#endregion
//#region src/types/types.ts
/**
* Type guard to check if a collection is a ShopCollection
* Shop collections are for primary sales
*/
function isShopCollection(collection) {
	return collection.marketplaceCollectionType === "shop";
}
/**
* Type guard to check if a collection is a MarketCollection
* Market collections are for secondary market trading
*/
function isMarketCollection(collection) {
	return collection.marketplaceCollectionType === "market";
}
let CollectibleCardAction = /* @__PURE__ */ function(CollectibleCardAction$1) {
	CollectibleCardAction$1["BUY"] = "Buy";
	CollectibleCardAction$1["SELL"] = "Sell";
	CollectibleCardAction$1["LIST"] = "Create listing";
	CollectibleCardAction$1["OFFER"] = "Make an offer";
	CollectibleCardAction$1["TRANSFER"] = "Transfer";
	return CollectibleCardAction$1;
}({});

//#endregion
export { WalletKind$1 as _, NATIVE_TOKEN_ADDRESS as a, ContractType$1 as c, OrderStatus as d, OrderbookKind$1 as f, TransactionCrypto as g, StepType$1 as h, isShopCollection as i, MarketplaceKind$1 as l, SortOrder as m, CollectibleCardAction as n, TransactionType as o, PropertyType as p, isMarketCollection as r, CollectionStatus as s, FilterCondition$1 as t, OrderSide$1 as u };
//# sourceMappingURL=types.js.map