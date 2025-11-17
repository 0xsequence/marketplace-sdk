import { r as getMarketplaceClient } from "./api.js";
import { queryOptions } from "@tanstack/react-query";

//#region src/react/queries/orders.ts
/**
* Fetches orders from the marketplace API
*/
async function fetchOrders(params) {
	const { config, ...apiParams } = params;
	return getMarketplaceClient(config).getOrders({
		chainId: String(apiParams.chainId),
		input: apiParams.input,
		page: apiParams.page
	});
}
function ordersQueryOptions(params) {
	const enabled = Boolean(params.config && params.chainId && params.input && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: ["orders", params],
		queryFn: () => fetchOrders({
			chainId: params.chainId,
			input: params.input,
			page: params.page,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
export { ordersQueryOptions as n, fetchOrders as t };
//# sourceMappingURL=queries.js.map