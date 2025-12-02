import { getMarketplaceClient } from "./api-GwTR0dBA.js";
import { queryOptions } from "@tanstack/react-query";

//#region src/react/queries/orders.ts
/**
* Fetches orders from the marketplace API
*/
async function fetchOrders(params) {
	const { config,...apiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.getOrders({
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
export { fetchOrders, ordersQueryOptions };
//# sourceMappingURL=queries-Btb-QHu0.js.map