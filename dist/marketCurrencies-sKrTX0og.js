import { currencyKeys, getMarketplaceClient, getQueryClient } from "./api-BoO0V5aJ.js";
import { compareAddress } from "./utils-BfpDVibN.js";
import { marketplaceConfigOptions } from "./marketplaceConfig-UHQMM9fq.js";
import { queryOptions } from "@tanstack/react-query";
import { zeroAddress } from "viem";

//#region src/react/queries/market/marketCurrencies.ts
/**
* Fetches supported currencies for a marketplace
*/
async function fetchMarketCurrencies(params) {
	const { chainId, includeNativeCurrency, collectionAddress, config } = params;
	const includeNativeCurrencyOption = includeNativeCurrency ?? true;
	let currencies = await getMarketplaceClient(config).listCurrencies({ chainId: String(chainId) }).then((resp) => resp.currencies.map((currency) => ({
		...currency,
		contractAddress: currency.contractAddress || zeroAddress
	})));
	if (collectionAddress) {
		const currenciesOptions = (await getQueryClient().fetchQuery(marketplaceConfigOptions(config))).market.collections.find((collection) => compareAddress(collection.itemsAddress, collectionAddress))?.currencyOptions;
		if (currenciesOptions) currencies = currencies.filter((currency) => currenciesOptions.includes(currency.contractAddress));
	}
	if (!includeNativeCurrencyOption) currencies = currencies.filter((currency) => !currency.nativeCurrency);
	return currencies;
}
function getMarketCurrenciesQueryKey(params) {
	const apiArgs = { chainId: String(params.chainId) };
	return [
		...currencyKeys.lists,
		apiArgs,
		{
			includeNativeCurrency: params.includeNativeCurrency,
			collectionAddress: params.collectionAddress
		}
	];
}
function marketCurrenciesQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getMarketCurrenciesQueryKey(params),
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
export { fetchMarketCurrencies, getMarketCurrenciesQueryKey, marketCurrenciesQueryOptions };
//# sourceMappingURL=marketCurrencies-sKrTX0og.js.map