import { _ as getQueryClient, p as currencyKeys } from "./api.js";
import { r as marketCurrenciesQueryOptions } from "./marketCurrencies.js";
import { queryOptions } from "@tanstack/react-query";
import * as dn from "dnum";
import { formatUnits } from "viem";

//#region src/react/queries/utils/convertPriceToUSD.ts
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
	const apiArgs = {
		chainId: params.chainId,
		currencyAddress: params.currencyAddress,
		amountRaw: params.amountRaw
	};
	return [
		...currencyKeys.conversion,
		"usd",
		apiArgs
	];
}
function convertPriceToUSDQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.currencyAddress && params.amountRaw && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getConvertPriceToUSDQueryKey(params),
		queryFn: () => fetchConvertPriceToUSD({
			chainId: params.chainId,
			currencyAddress: params.currencyAddress,
			amountRaw: params.amountRaw,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/utils/comparePrices.ts
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
	const absPercentage = Math.abs(percentageDifference);
	return {
		percentageDifference,
		percentageDifferenceFormatted: dn.format([BigInt(Math.round(absPercentage * 100)), 2], {
			digits: 2,
			trailingZeros: true,
			locale: "en-US"
		}),
		status: isAbove ? "above" : isSame ? "same" : "below"
	};
}
function getComparePricesQueryKey(params) {
	const apiArgs = {
		chainId: params.chainId,
		priceAmountRaw: params.priceAmountRaw,
		priceCurrencyAddress: params.priceCurrencyAddress,
		compareToPriceAmountRaw: params.compareToPriceAmountRaw,
		compareToPriceCurrencyAddress: params.compareToPriceCurrencyAddress
	};
	return [
		...currencyKeys.conversion,
		"compare",
		apiArgs
	];
}
function comparePricesQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.priceAmountRaw && params.priceCurrencyAddress && params.compareToPriceAmountRaw && params.compareToPriceCurrencyAddress && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getComparePricesQueryKey(params),
		queryFn: () => fetchComparePrices({
			chainId: params.chainId,
			priceAmountRaw: params.priceAmountRaw,
			priceCurrencyAddress: params.priceCurrencyAddress,
			compareToPriceAmountRaw: params.compareToPriceAmountRaw,
			compareToPriceCurrencyAddress: params.compareToPriceCurrencyAddress,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
export { fetchConvertPriceToUSD as a, convertPriceToUSDQueryOptions as i, fetchComparePrices as n, getConvertPriceToUSDQueryKey as o, getComparePricesQueryKey as r, comparePricesQueryOptions as t };
//# sourceMappingURL=utils2.js.map