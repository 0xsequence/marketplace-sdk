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
let CollectibleCardAction = /* @__PURE__ */ function(CollectibleCardAction$1) {
	CollectibleCardAction$1["BUY"] = "Buy";
	CollectibleCardAction$1["SELL"] = "Sell";
	CollectibleCardAction$1["LIST"] = "Create listing";
	CollectibleCardAction$1["OFFER"] = "Make an offer";
	CollectibleCardAction$1["TRANSFER"] = "Transfer";
	return CollectibleCardAction$1;
}({});

//#endregion
export { NATIVE_TOKEN_ADDRESS as n, TransactionType as r, CollectibleCardAction as t };
//# sourceMappingURL=types.js.map