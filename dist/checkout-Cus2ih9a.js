import { r as getMarketplaceClient } from "./api-D2fhCs18.js";
import { queryOptions } from "@tanstack/react-query";

//#region src/react/queries/checkout/market-checkout-options.ts
/**
* Fetches checkout options from the Marketplace API
*/
async function fetchMarketCheckoutOptions(params) {
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
	return await client.checkoutOptionsMarketplace(apiArgs);
}
function getMarketCheckoutOptionsQueryKey(params) {
	return [
		"checkout",
		"market-checkout-options",
		{
			chainId: String(params.chainId),
			wallet: params.walletAddress,
			orders: params.orders?.map((order) => ({
				contractAddress: order.collectionAddress,
				orderId: order.orderId,
				marketplace: order.marketplace
			})),
			additionalFee: params.additionalFee
		}
	];
}
function marketCheckoutOptionsQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.walletAddress && params.orders?.length && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getMarketCheckoutOptionsQueryKey(params),
		queryFn: () => fetchMarketCheckoutOptions({
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
//#region src/react/queries/checkout/primary-sale-checkout-options.ts
/**
* Fetches checkout options for primary sales contract from the Marketplace API
*/
async function fetchPrimarySaleCheckoutOptions(params) {
	const { chainId, walletAddress, contractAddress, collectionAddress, items, config } = params;
	const client = getMarketplaceClient(config);
	const apiArgs = {
		chainId: String(chainId),
		wallet: walletAddress,
		contractAddress,
		collectionAddress,
		items
	};
	return await client.checkoutOptionsSalesContract(apiArgs);
}
function getPrimarySaleCheckoutOptionsQueryKey(params) {
	return [
		"checkout",
		"primary-sale-checkout-options",
		{
			chainId: String(params.chainId),
			wallet: params.walletAddress,
			contractAddress: params.contractAddress,
			collectionAddress: params.collectionAddress,
			items: params.items
		}
	];
}
function primarySaleCheckoutOptionsQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.walletAddress && params.contractAddress && params.collectionAddress && params.items?.length && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: getPrimarySaleCheckoutOptionsQueryKey(params),
		queryFn: () => fetchPrimarySaleCheckoutOptions({
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
export { getMarketCheckoutOptionsQueryKey as a, fetchMarketCheckoutOptions as i, getPrimarySaleCheckoutOptionsQueryKey as n, marketCheckoutOptionsQueryOptions as o, primarySaleCheckoutOptionsQueryOptions as r, fetchPrimarySaleCheckoutOptions as t };
//# sourceMappingURL=checkout-Cus2ih9a.js.map