import { l as compareAddress } from "./utils.js";
import { l as getQueryClient, r as getMarketplaceClient } from "./api.js";
import { y as buildQueryOptions } from "./_internal.js";
import { n as marketplaceConfigOptions } from "./config.js";
import { formatUnits, zeroAddress } from "viem";
import { queryOptions, skipToken } from "@tanstack/react-query";

//#region src/react/queries/currency/list.ts
/**
* Fetches supported currencies for a marketplace
*/
async function fetchMarketCurrencies(params) {
	const { chainId, includeNativeCurrency, collectionAddress, config } = params;
	const includeNativeCurrencyOption = includeNativeCurrency ?? true;
	let currencies = await getMarketplaceClient(config).listCurrencies({ chainId }).then((resp) => resp.currencies.map((currency) => ({
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
	return [
		"currency",
		"list",
		{
			chainId: params.chainId,
			includeNativeCurrency: params.includeNativeCurrency,
			collectionAddress: params.collectionAddress
		}
	];
}
function marketCurrenciesQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getMarketCurrenciesQueryKey,
		requiredParams: ["chainId", "config"],
		fetcher: fetchMarketCurrencies
	}, params);
}

//#endregion
//#region src/react/queries/currency/convert-to-usd.ts
/**
* Converts a price amount from a specific currency to USD using exchange rates
*/
async function fetchConvertPriceToUSD(params) {
	const { chainId, currencyAddress, amountRaw, config } = params;
	const currencyDetails = (await getQueryClient().fetchQuery(marketCurrenciesQueryOptions({
		chainId,
		config
	}))).find((c) => c.contractAddress.toLowerCase() === currencyAddress.toLowerCase());
	if (!currencyDetails) throw new Error("Currency not found");
	const usdAmount = Number(formatUnits(BigInt(amountRaw), currencyDetails.decimals)) * currencyDetails.exchangeRate;
	return {
		usdAmount,
		usdAmountFormatted: usdAmount.toFixed(2)
	};
}
function getConvertPriceToUSDQueryKey(params) {
	return [
		"currency",
		"convert-to-usd",
		{
			chainId: params.chainId,
			currencyAddress: params.currencyAddress,
			amountRaw: params.amountRaw
		}
	];
}
function convertPriceToUSDQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getConvertPriceToUSDQueryKey,
		requiredParams: [
			"chainId",
			"currencyAddress",
			"amountRaw",
			"config"
		],
		fetcher: fetchConvertPriceToUSD
	}, params);
}

//#endregion
//#region src/react/queries/currency/compare-prices.ts
/**
* Compares prices between different currencies by converting both to USD
*/
async function fetchComparePrices(params) {
	const { chainId, priceAmountRaw, priceCurrencyAddress, compareToPriceAmountRaw, compareToPriceCurrencyAddress, config } = params;
	const [priceUSD, compareToPriceUSD] = await Promise.all([fetchConvertPriceToUSD({
		chainId,
		currencyAddress: priceCurrencyAddress,
		amountRaw: priceAmountRaw,
		config
	}), fetchConvertPriceToUSD({
		chainId,
		currencyAddress: compareToPriceCurrencyAddress,
		amountRaw: compareToPriceAmountRaw,
		config
	})]);
	const difference = priceUSD.usdAmount - compareToPriceUSD.usdAmount;
	if (compareToPriceUSD.usdAmount === 0) throw new Error("Cannot compare to zero price");
	const percentageDifference = difference / compareToPriceUSD.usdAmount * 100;
	const isAbove = percentageDifference > 0;
	const isSame = percentageDifference === 0;
	return {
		percentageDifference,
		percentageDifferenceFormatted: Math.abs(percentageDifference).toFixed(2),
		status: isAbove ? "above" : isSame ? "same" : "below"
	};
}
function getComparePricesQueryKey(params) {
	return [
		"currency",
		"compare-prices",
		{
			chainId: params.chainId,
			priceAmountRaw: params.priceAmountRaw,
			priceCurrencyAddress: params.priceCurrencyAddress,
			compareToPriceAmountRaw: params.compareToPriceAmountRaw,
			compareToPriceCurrencyAddress: params.compareToPriceCurrencyAddress
		}
	];
}
function comparePricesQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getComparePricesQueryKey,
		requiredParams: [
			"chainId",
			"priceAmountRaw",
			"priceCurrencyAddress",
			"compareToPriceAmountRaw",
			"compareToPriceCurrencyAddress",
			"config"
		],
		fetcher: fetchComparePrices
	}, params);
}

//#endregion
//#region src/react/queries/currency/currency.ts
/**
* Fetches currency details from the marketplace API
*/
async function fetchCurrency(params) {
	const { chainId, currencyAddress, config } = params;
	let currencies = getQueryClient().getQueryData([
		"currency",
		"list",
		chainId
	]);
	if (!currencies) currencies = (await getMarketplaceClient(config).listCurrencies({ chainId })).currencies;
	if (!currencies?.length) throw new Error("No currencies returned");
	const currency = currencies.find((currency$1) => currency$1.contractAddress.toLowerCase() === currencyAddress.toLowerCase());
	if (!currency) throw new Error("Currency not found");
	return currency;
}
function getCurrencyQueryKey(params) {
	return [
		"currency",
		"currency",
		{
			chainId: String(params.chainId ?? 0),
			currencyAddress: params.currencyAddress ?? ""
		}
	];
}
function currencyQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.currencyAddress && params.config && (params.query?.enabled ?? true));
	const queryFn = params.chainId && params.currencyAddress && params.config ? () => {
		const requiredParams = params;
		return fetchCurrency({
			chainId: requiredParams.chainId,
			currencyAddress: requiredParams.currencyAddress,
			config: requiredParams.config
		});
	} : skipToken;
	return queryOptions({
		queryKey: getCurrencyQueryKey(params),
		queryFn,
		...params.query,
		enabled
	});
}

//#endregion
export { fetchComparePrices as a, fetchConvertPriceToUSD as c, getMarketCurrenciesQueryKey as d, marketCurrenciesQueryOptions as f, comparePricesQueryOptions as i, getConvertPriceToUSDQueryKey as l, fetchCurrency as n, getComparePricesQueryKey as o, getCurrencyQueryKey as r, convertPriceToUSDQueryOptions as s, currencyQueryOptions as t, fetchMarketCurrencies as u };
//# sourceMappingURL=currency.js.map