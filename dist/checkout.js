import { r as getMarketplaceClient } from "./api.js";
import { y as buildQueryOptions } from "./_internal.js";

//#region src/react/queries/checkout/primary-sale-checkout-options.ts
/**
* Fetches checkout options for primary sales contract from the Marketplace API
*/
async function fetchPrimarySaleCheckoutOptions(params) {
	const { chainId, walletAddress, contractAddress, collectionAddress, items, config } = params;
	const client = getMarketplaceClient(config);
	const apiArgs = {
		chainId,
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
		"primary-sale",
		{
			chainId: params.chainId ?? 0,
			walletAddress: params.walletAddress ?? "0x",
			contractAddress: params.contractAddress ?? "",
			collectionAddress: params.collectionAddress ?? "",
			items: params.items ?? []
		}
	];
}
function primarySaleCheckoutOptionsQueryOptions(params) {
	return buildQueryOptions({
		getQueryKey: getPrimarySaleCheckoutOptionsQueryKey,
		requiredParams: [
			"chainId",
			"walletAddress",
			"contractAddress",
			"collectionAddress",
			"items",
			"config"
		],
		fetcher: fetchPrimarySaleCheckoutOptions,
		customValidation: (params$1) => (params$1.items?.length ?? 0) > 0
	}, params);
}

//#endregion
export { getPrimarySaleCheckoutOptionsQueryKey as n, primarySaleCheckoutOptionsQueryOptions as r, fetchPrimarySaleCheckoutOptions as t };
//# sourceMappingURL=checkout.js.map