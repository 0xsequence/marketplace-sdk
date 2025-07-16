import { getQueryClient } from "./get-query-client-D19vvfJo.js";
import { currencyKeys, getMarketplaceClient } from "./api-BiMGqWdz.js";
import { compareAddress } from "./utils-D4D4JVMo.js";
import { marketplaceConfigOptions } from "./marketplaceConfig-GQTTmihy.js";
import { queryOptions } from "@tanstack/react-query";
import { zeroAddress } from "viem";

//#region src/react/queries/marketCurrencies.ts
/**
* Fetches supported currencies for a marketplace
*/
async function fetchMarketCurrencies(params) {
	const { chainId, includeNativeCurrency, collectionAddress, config } = params;
	const includeNativeCurrencyOption = includeNativeCurrency ?? true;
	const marketplaceClient = getMarketplaceClient(config);
	let currencies = await marketplaceClient.listCurrencies({ chainId: String(chainId) }).then((resp) => resp.currencies.map((currency) => ({
		...currency,
		contractAddress: currency.contractAddress || zeroAddress
	})));
	if (collectionAddress) {
		const queryClient = getQueryClient();
		const marketplaceConfig = await queryClient.fetchQuery(marketplaceConfigOptions(config));
		const currenciesOptions = marketplaceConfig.market.collections.find((collection) => compareAddress(collection.itemsAddress, collectionAddress))?.currencyOptions;
		if (currenciesOptions) currencies = currencies.filter((currency) => currenciesOptions.includes(currency.contractAddress));
	}
	if (!includeNativeCurrencyOption) currencies = currencies.filter((currency) => !currency.nativeCurrency);
	return currencies;
}
function marketCurrenciesQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...currencyKeys.lists, params],
		queryFn: () => fetchMarketCurrencies({
			chainId: params.chainId,
			config: params.config,
			includeNativeCurrency: params.includeNativeCurrency,
			collectionAddress: params.collectionAddress
		}),
		...params.query,
		enabled
	});
}

//#endregion
export { fetchMarketCurrencies, marketCurrenciesQueryOptions };
//# sourceMappingURL=marketCurrencies-DnKtp0ka.js.map