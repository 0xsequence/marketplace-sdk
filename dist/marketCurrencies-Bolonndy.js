import { currencyKeys, getMarketplaceClient, getQueryClient } from "./api-GwTR0dBA.js";
import { OrderbookKind$1 as OrderbookKind } from "./marketplace.gen-906FrJQJ.js";
import { compareAddress } from "./utils-9ToOvt-c.js";
import { marketplaceConfigOptions$1 as marketplaceConfigOptions } from "./marketplaceConfig-Bqjo7NYO.js";
import { queryOptions } from "@tanstack/react-query";
import { zeroAddress } from "viem";

//#region src/react/queries/market/marketCurrencies.ts
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
		const collection = marketplaceConfig.market.collections.find((collection$1) => compareAddress(collection$1.itemsAddress, collectionAddress));
		const isOpensea = collection?.destinationMarketplace === OrderbookKind.opensea;
		const currenciesOptions = marketplaceConfig.market.collections.find((collection$1) => compareAddress(collection$1.itemsAddress, collectionAddress))?.currencyOptions;
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
export { fetchMarketCurrencies, getMarketCurrenciesQueryKey, marketCurrenciesQueryOptions };
//# sourceMappingURL=marketCurrencies-Bolonndy.js.map