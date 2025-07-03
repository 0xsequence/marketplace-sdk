//#region src/react/_internal/get-provider.ts
const PROVIDER_ID = "sdk-provider";
function getProviderEl() {
	if (!globalThis.document) return null;
	return document.getElementById(PROVIDER_ID);
}

//#endregion
//#region src/react/_internal/types.ts
let TransactionType = /* @__PURE__ */ function(TransactionType$1) {
	TransactionType$1["BUY"] = "BUY";
	TransactionType$1["SELL"] = "SELL";
	TransactionType$1["LISTING"] = "LISTING";
	TransactionType$1["OFFER"] = "OFFER";
	TransactionType$1["TRANSFER"] = "TRANSFER";
	TransactionType$1["CANCEL"] = "CANCEL";
	return TransactionType$1;
}({});

//#endregion
export { PROVIDER_ID, TransactionType, getProviderEl };
//# sourceMappingURL=_internal-DslqcNC1.js.map