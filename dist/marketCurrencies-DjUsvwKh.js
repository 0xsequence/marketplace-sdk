import { _ as getQueryClient, p as currencyKeys, r as getMarketplaceClient } from "./api-aX60quJA.js";
import { S as OrderbookKind } from "./marketplace.gen-tQfigxXM.js";
import { l as compareAddress } from "./utils-BfcOcwTy.js";
import { n as marketplaceConfigOptions } from "./marketplaceConfig-DsDqJlRk.js";
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
		const marketplaceConfig = await getQueryClient().fetchQuery(marketplaceConfigOptions(config));
		const isOpensea = marketplaceConfig.market.collections.find((collection) => compareAddress(collection.itemsAddress, collectionAddress))?.destinationMarketplace === OrderbookKind.opensea;
		const currenciesOptions = marketplaceConfig.market.collections.find((collection) => compareAddress(collection.itemsAddress, collectionAddress))?.currencyOptions;
		if (currenciesOptions && !isOpensea) currencies = currencies.filter((currency) => currenciesOptions.includes(currency.contractAddress));
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
export { getMarketCurrenciesQueryKey as n, marketCurrenciesQueryOptions as r, fetchMarketCurrencies as t };
//# sourceMappingURL=marketCurrencies-DjUsvwKh.js.map