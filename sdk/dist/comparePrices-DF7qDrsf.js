import { getQueryClient } from "./get-query-client-D19vvfJo.js";
import { getMarketplaceClient } from "./api-BiMGqWdz.js";
import { marketCurrenciesQueryOptions } from "./marketCurrencies-DnKtp0ka.js";
import { queryOptions } from "@tanstack/react-query";
import { formatUnits } from "viem";

//#region src/react/queries/checkoutOptions.ts
/**
* Fetches checkout options from the Marketplace API
*/
async function fetchCheckoutOptions(params) {
	const { chainId, walletAddress, orders, config, additionalFee } = params;
	const client = getMarketplaceClient(config);
	const apiArgs = {
		chainId: String(chainId),
		wallet: walletAddress,
		orders: orders.map((order) => ({
			contractAddress: order.collectionAddress,
			orderId: order.orderId,
			marketplace: order.marketplace
		})),
		additionalFee: additionalFee ?? 0
	};
	const result = await client.checkoutOptionsMarketplace(apiArgs);
	return result;
}
function checkoutOptionsQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.walletAddress && params.orders?.length && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [
			"checkout",
			"options",
			params
		],
		queryFn: () => fetchCheckoutOptions({
			chainId: params.chainId,
			walletAddress: params.walletAddress,
			orders: params.orders,
			config: params.config,
			additionalFee: params.additionalFee ?? 0
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/checkoutOptionsSalesContract.ts
/**
* Fetches checkout options for sales contract from the Marketplace API
*/
async function fetchCheckoutOptionsSalesContract(params) {
	const { chainId, walletAddress, contractAddress, collectionAddress, items, config } = params;
	const client = getMarketplaceClient(config);
	const apiArgs = {
		chainId: String(chainId),
		wallet: walletAddress,
		contractAddress,
		collectionAddress,
		items
	};
	const result = await client.checkoutOptionsSalesContract(apiArgs);
	return result;
}
function checkoutOptionsSalesContractQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.walletAddress && params.contractAddress && params.collectionAddress && params.items?.length && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [
			"checkout",
			"options",
			"salesContract",
			params
		],
		queryFn: () => fetchCheckoutOptionsSalesContract({
			chainId: params.chainId,
			walletAddress: params.walletAddress,
			contractAddress: params.contractAddress,
			collectionAddress: params.collectionAddress,
			items: params.items,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/convertPriceToUSD.ts
/**
* Converts a price amount from a specific currency to USD using exchange rates
*/
async function fetchConvertPriceToUSD(params) {
	const { chainId, currencyAddress, amountRaw, config } = params;
	const queryClient = getQueryClient();
	const currencies = await queryClient.fetchQuery(marketCurrenciesQueryOptions({
		chainId,
		config
	}));
	const currencyDetails = currencies.find((c) => c.contractAddress.toLowerCase() === currencyAddress.toLowerCase());
	if (!currencyDetails) throw new Error("Currency not found");
	const amountDecimal = Number(formatUnits(BigInt(amountRaw), currencyDetails.decimals));
	const usdAmount = amountDecimal * currencyDetails.exchangeRate;
	return {
		usdAmount,
		usdAmountFormatted: usdAmount.toFixed(2)
	};
}
function convertPriceToUSDQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.currencyAddress && params.amountRaw && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [
			"currency",
			"convertPriceToUSD",
			params
		],
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
//#region src/react/queries/comparePrices.ts
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
function comparePricesQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.priceAmountRaw && params.priceCurrencyAddress && params.compareToPriceAmountRaw && params.compareToPriceCurrencyAddress && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [
			"currency",
			"conversion",
			"compare",
			params
		],
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
export { checkoutOptionsQueryOptions, checkoutOptionsSalesContractQueryOptions, comparePricesQueryOptions, convertPriceToUSDQueryOptions, fetchCheckoutOptions, fetchCheckoutOptionsSalesContract, fetchComparePrices, fetchConvertPriceToUSD };
//# sourceMappingURL=comparePrices-DF7qDrsf.js.map