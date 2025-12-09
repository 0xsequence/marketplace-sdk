import { CollectionStatus, ContractType as ContractType$1, CurrencyStatus, ExecuteType, MarketplaceKind as MarketplaceKind$1, MetadataStatus, OfferType, OrderSide as OrderSide$1, OrderStatus, OrderbookKind as OrderbookKind$1, PropertyType, SortOrder, StepType as StepType$1, TransactionCrypto, TransactionOnRampProvider, WalletKind as WalletKind$1 } from "@0xsequence/api-client";
import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

//#region src/react/_internal/get-provider.ts
const PROVIDER_ID = "sdk-provider";
function getProviderEl() {
	if (!globalThis.document) return null;
	return document.getElementById(PROVIDER_ID);
}

//#endregion
//#region src/react/_internal/query-builder.ts
function requiredParamsFor() {
	return (keys) => keys;
}
/**
* Type Safety:
* - requiredParams must include ALL required fields from TParams
* - TypeScript validates this at compile time
*/
function buildQueryOptions(config, params) {
	const requiredParamsValid = config.requiredParams.every((key) => key in params && params[key] !== void 0);
	const customValid = config.customValidation ? config.customValidation(params) : true;
	const enabled = Boolean(requiredParamsValid && customValid && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: config.getQueryKey(params),
		queryFn: () => {
			return config.fetcher(params);
		},
		...params.query,
		enabled
	});
}
/**
* Type Safety:
* - requiredParams must include ALL required fields from TParams
* - TypeScript validates this at compile time
*/
function buildInfiniteQueryOptions(config, params) {
	const requiredParamsValid = config.requiredParams.every((key) => key in params && params[key] !== void 0);
	const customValid = config.customValidation ? config.customValidation(params) : true;
	const enabled = Boolean(requiredParamsValid && customValid && params.config && (params.query?.enabled ?? true));
	return infiniteQueryOptions({
		queryKey: config.getQueryKey(params),
		queryFn: async ({ pageParam }) => {
			return config.fetcher(params, pageParam);
		},
		initialPageParam: {
			page: 1,
			pageSize: 30
		},
		getNextPageParam: (lastPage) => {
			const pageInfo = config.getPageInfo(lastPage);
			return pageInfo?.more ? pageInfo : void 0;
		},
		...params.query,
		enabled
	});
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
export { getProviderEl as S, TransactionType as _, MarketplaceKind$1 as a, requiredParamsFor as b, OrderSide$1 as c, PropertyType as d, SortOrder as f, WalletKind$1 as g, TransactionOnRampProvider as h, ExecuteType as i, OrderStatus as l, TransactionCrypto as m, ContractType$1 as n, MetadataStatus as o, StepType$1 as p, CurrencyStatus as r, OfferType as s, CollectionStatus as t, OrderbookKind$1 as u, buildInfiniteQueryOptions as v, PROVIDER_ID as x, buildQueryOptions as y };
//# sourceMappingURL=_internal.js.map