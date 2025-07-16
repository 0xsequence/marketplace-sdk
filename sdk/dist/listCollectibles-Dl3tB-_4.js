import { collectableKeys, getMarketplaceClient } from "./api-BiMGqWdz.js";
import { OrderSide } from "./marketplace.gen-HpnpL5xU.js";
import { compareAddress } from "./utils-D4D4JVMo.js";
import { fetchMarketplaceConfig } from "./marketplaceConfig-GQTTmihy.js";
import { fetchBalances } from "./listBalances-DuufjTG6.js";
import { infiniteQueryOptions } from "@tanstack/react-query";

//#region src/react/queries/listCollectibles.ts
/**
* Fetches a list of collectibles with pagination support from the Marketplace API
*/
async function fetchListCollectibles(params, marketplaceConfig, page) {
	const { collectionAddress, chainId, config,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		page,
		...additionalApiParams
	};
	if (params.marketplaceType === "shop") {
		const shopCollection = marketplaceConfig.shop.collections.find((collection) => compareAddress(collection.itemsAddress, params.collectionAddress));
		if (!shopCollection) return { collectibles: [] };
		const primarySaleItemsList = await marketplaceClient.listPrimarySaleItems({
			chainId: params.chainId.toString(),
			primarySaleContractAddress: shopCollection.saleAddress
		}, marketplaceConfig);
		return { collectibles: primarySaleItemsList.primarySaleItems.map((item) => ({
			metadata: item.metadata,
			primarySale: {
				price: {
					amount: item.primarySaleItem.priceAmount,
					formatted: item.primarySaleItem.priceAmountFormatted,
					decimals: item.primarySaleItem.priceDecimals,
					currencyAddress: item.primarySaleItem.currencyAddress
				},
				startDate: item.primarySaleItem.startDate,
				endDate: item.primarySaleItem.endDate,
				supplyCap: item.primarySaleItem.supply,
				itemType: item.primarySaleItem.itemType
			}
		})) };
	}
	if (params.isLaos721 && params.side === OrderSide.listing) try {
		const fetchBalancesArgs = {
			chainId: params.chainId,
			accountAddress: params.filter?.inAccounts?.[0],
			contractAddress: params.collectionAddress,
			page,
			includeMetadata: true,
			isLaos721: true
		};
		const balances = await fetchBalances(fetchBalancesArgs, config, page);
		const collectibles = balances.balances.map((balance) => {
			if (!balance.tokenMetadata) throw new Error("Token metadata not found");
			return { metadata: {
				tokenId: balance.tokenID ?? "",
				attributes: balance.tokenMetadata.attributes,
				image: balance.tokenMetadata.image,
				name: balance.tokenMetadata.name,
				description: balance.tokenMetadata.description,
				video: balance.tokenMetadata.video,
				audio: balance.tokenMetadata.audio
			} };
		});
		return {
			collectibles,
			page: balances.page
		};
	} catch (error) {
		console.error(error);
	}
	return await marketplaceClient.listCollectibles(apiArgs);
}
function listCollectiblesQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.side && params.config && (params.query?.enabled ?? true));
	return infiniteQueryOptions({
		queryKey: [...collectableKeys.lists, params],
		queryFn: async ({ pageParam }) => {
			const marketplaceConfig = await fetchMarketplaceConfig({ config: params.config });
			return fetchListCollectibles({
				chainId: params.chainId,
				collectionAddress: params.collectionAddress,
				config: params.config,
				side: params.side,
				filter: params.filter,
				isLaos721: params.isLaos721,
				marketplaceType: params.marketplaceType
			}, marketplaceConfig, pageParam);
		},
		initialPageParam: {
			page: 1,
			pageSize: 30
		},
		getNextPageParam: (lastPage) => lastPage.page?.more ? lastPage.page : void 0,
		...params.query,
		enabled
	});
}

//#endregion
export { fetchListCollectibles, listCollectiblesQueryOptions };
//# sourceMappingURL=listCollectibles-Dl3tB-_4.js.map