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
			if (!pageInfo?.more) return void 0;
			return {
				...pageInfo,
				page: pageInfo.page + 1
			};
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
export { PROVIDER_ID as a, requiredParamsFor as i, buildInfiniteQueryOptions as n, getProviderEl as o, buildQueryOptions as r, TransactionType as t };
//# sourceMappingURL=_internal.js.map