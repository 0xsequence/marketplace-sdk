import { getQueryClient } from "./get-query-client-D19vvfJo.js";
import { currencyKeys, getMarketplaceClient } from "./api-BiMGqWdz.js";
import { queryOptions, skipToken } from "@tanstack/react-query";

//#region src/react/queries/currency.ts
/**
* Fetches currency details from the marketplace API
*/
async function fetchCurrency(params) {
	const { chainId, currencyAddress, config } = params;
	const queryClient = getQueryClient();
	let currencies = queryClient.getQueryData([...currencyKeys.lists, chainId]);
	if (!currencies) {
		const marketplaceClient = getMarketplaceClient(config);
		currencies = await marketplaceClient.listCurrencies({ chainId: String(chainId) }).then((resp) => resp.currencies);
	}
	if (!currencies?.length) throw new Error("No currencies returned");
	const currency = currencies.find((currency$1) => currency$1.contractAddress.toLowerCase() === currencyAddress.toLowerCase());
	if (!currency) throw new Error("Currency not found");
	return currency;
}
function currencyQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.currencyAddress && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...currencyKeys.details, params],
		queryFn: params.chainId && params.currencyAddress ? () => fetchCurrency({
			chainId: params.chainId,
			currencyAddress: params.currencyAddress,
			config: params.config
		}) : skipToken,
		...params.query,
		enabled
	});
}

//#endregion
export { currencyQueryOptions, fetchCurrency };
//# sourceMappingURL=currency-D5SWIT_9.js.map