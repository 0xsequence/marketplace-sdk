//#region src/types/transactions.ts
/**
* Transaction modes for the buy modal
* Used to distinguish between secondary market purchases and primary sales (minting)
*/
let TransactionType = /* @__PURE__ */ function(TransactionType$1) {
	/** Secondary market purchases from existing orders */
	TransactionType$1["MARKET_BUY"] = "MARKET_BUY";
	/** Primary sales - direct from creator/contract (minting/shop) */
	TransactionType$1["PRIMARY_SALE"] = "PRIMARY_SALE";
	return TransactionType$1;
}({});

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
export { TransactionType as i, isMarketCollection as n, isShopCollection as r, CollectibleCardAction as t };
//# sourceMappingURL=types.js.map