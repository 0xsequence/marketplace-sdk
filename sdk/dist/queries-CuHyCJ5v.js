import { LaosAPI, balanceQueries, collectableKeys, collectionKeys, currencyKeys, getIndexerClient, getMarketplaceClient, getMetadataClient, getQueryClient, tokenKeys } from "./api-BwkAXGhb.js";
import { OrderSide } from "./marketplace.gen-lc2B0D_7.js";
import { compareAddress } from "./utils-Y02I14cD.js";
import { fetchMarketplaceConfig, marketplaceConfigOptions } from "./marketplaceConfig-D0832T_-.js";
import { infiniteQueryOptions, queryOptions, skipToken } from "@tanstack/react-query";
import { zeroAddress } from "viem";

//#region src/react/queries/balanceOfCollectible.ts
/**
* Fetches the balance of a specific collectible for a user
*
* @param args - Arguments for the API call
* @param config - SDK configuration
* @returns The balance data
*/
async function fetchBalanceOfCollectible(args, config) {
	if (args.isLaos721) {
		const laosApi = new LaosAPI();
		const response = await laosApi.getTokenBalances({
			chainId: args.chainId.toString(),
			contractAddress: args.collectionAddress,
			accountAddress: args.userAddress,
			includeMetadata: true
		});
		return response.balances[0] || null;
	}
	const indexerClient = getIndexerClient(args.chainId, config);
	return indexerClient.getTokenBalances({
		accountAddress: args.userAddress,
		contractAddress: args.collectionAddress,
		tokenID: args.collectableId,
		includeMetadata: false,
		metadataOptions: {
			verifiedOnly: true,
			includeContracts: [args.collectionAddress]
		}
	}).then((res) => res.balances[0] || null);
}
/**
* Creates a tanstack query options object for the balance query
*
* @param args - The query arguments
* @param config - SDK configuration
* @returns Query options configuration
*/
function balanceOfCollectibleOptions(args, config) {
	const enabled = !!args.userAddress && (args.query?.enabled ?? true);
	return queryOptions({
		queryKey: [...collectableKeys.userBalances, args],
		queryFn: enabled ? () => fetchBalanceOfCollectible({
			...args,
			userAddress: args.userAddress
		}, config) : skipToken
	});
}

//#endregion
//#region src/react/queries/collectible.ts
/**
* Fetches collectible metadata from the metadata API
*/
async function fetchCollectible(params) {
	const { collectionAddress, collectibleId, chainId, config } = params;
	const metadataClient = getMetadataClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainID: String(chainId),
		tokenIDs: [collectibleId]
	};
	const result = await metadataClient.getTokenMetadata(apiArgs);
	return result.tokenMetadata[0];
}
function collectibleQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.collectibleId && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.details, params],
		queryFn: () => fetchCollectible({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			collectibleId: params.collectibleId,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/collectionDetails.ts
/**
* Fetches collection details from the marketplace API
*/
async function fetchCollectionDetails(params) {
	const { collectionAddress, chainId, config,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		...additionalApiParams
	};
	const result = await marketplaceClient.getCollectionDetail(apiArgs);
	return result.collection;
}
function collectionDetailsQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectionKeys.detail, params],
		queryFn: () => fetchCollectionDetails({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
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
//#region src/react/queries/countOfPrimarySaleItems.ts
async function fetchCountOfPrimarySaleItems(args, config) {
	const marketplaceClient = getMarketplaceClient(config);
	const { chainId, primarySaleContractAddress, filter } = args;
	const data = await marketplaceClient.getCountOfPrimarySaleItems({
		chainId: String(chainId),
		primarySaleContractAddress,
		filter
	});
	return data.count;
}
function countOfPrimarySaleItemsOptions(args, config) {
	return queryOptions({
		enabled: args.query?.enabled ?? true,
		queryKey: ["countOfPrimarySaleItems", args],
		queryFn: () => fetchCountOfPrimarySaleItems(args, config)
	});
}

//#endregion
//#region src/react/queries/currency.ts
/**
* Fetches currency details from the marketplace API
*/
async function fetchCurrency(params) {
	const { chainId, currencyAddress, config } = params;
	const queryClient = getQueryClient();
	let currencies = queryClient.getQueryData([...currencyKeys.lists, chainId]);
	if (!currencies) {
		const marketplaceClient = getMarketplaceClient(config);
		currencies = await marketplaceClient.listCurrencies({ chainId: String(chainId) }).then((resp) => resp.currencies);
	}
	if (!currencies?.length) throw new Error("No currencies returned");
	const currency = currencies.find((currency$1) => currency$1.contractAddress.toLowerCase() === currencyAddress.toLowerCase());
	if (!currency) throw new Error("Currency not found");
	return currency;
}
function currencyQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.currencyAddress && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...currencyKeys.details, params],
		queryFn: params.chainId && params.currencyAddress ? () => fetchCurrency({
			chainId: params.chainId,
			currencyAddress: params.currencyAddress,
			config: params.config
		}) : skipToken,
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/floorOrder.ts
/**
* Fetches the floor order for a collection from the marketplace API
*/
async function fetchFloorOrder(params) {
	const { collectionAddress, chainId, config,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		...additionalApiParams
	};
	const result = await marketplaceClient.getFloorOrder(apiArgs);
	return result.collectible;
}
function floorOrderQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.floorOrders, params],
		queryFn: () => fetchFloorOrder({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config,
			...params.filter && { filter: params.filter } || {}
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/highestOffer.ts
/**
* Fetches the highest offer for a collectible from the marketplace API
*/
async function fetchHighestOffer(params) {
	const { collectionAddress, chainId, config,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		...additionalApiParams
	};
	const result = await marketplaceClient.getCollectibleHighestOffer(apiArgs);
	return result.order ?? null;
}
function highestOfferQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.tokenId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.highestOffers, params],
		queryFn: () => fetchHighestOffer({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			tokenId: params.tokenId,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/listBalances.ts
async function fetchBalances(args, config, page) {
	if (args.isLaos721 && args.accountAddress) {
		const laosClient = new LaosAPI();
		return laosClient.getTokenBalances({
			chainId: args.chainId.toString(),
			accountAddress: args.accountAddress,
			contractAddress: args.contractAddress,
			includeMetadata: args.includeMetadata,
			page: { sort: [{
				column: "CREATED_AT",
				order: "DESC"
			}] }
		});
	}
	const indexerClient = getIndexerClient(args.chainId, config);
	return indexerClient.getTokenBalances({
		...args,
		tokenID: args.tokenId,
		page
	});
}
/**
* Creates a tanstack infinite query options object for the balances query
*
* @param args - The query arguments
* @param config - SDK configuration
* @returns Query options configuration
*/
function listBalancesOptions(args, config) {
	return infiniteQueryOptions({
		...args.query,
		queryKey: [
			...balanceQueries.lists,
			args,
			config
		],
		queryFn: ({ pageParam }) => fetchBalances(args, config, pageParam),
		initialPageParam: {
			page: 1,
			pageSize: 30
		},
		getNextPageParam: (lastPage) => lastPage.page.after
	});
}

//#endregion
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
//#region src/react/queries/inventory.ts
const stateByCollection = /* @__PURE__ */ new Map();
const clearInventoryState = () => {
	stateByCollection.clear();
};
const getCollectionKey = (args) => `${args.chainId}-${args.collectionAddress}-${args.accountAddress}`;
function getOrInitState(collectionKey) {
	if (!stateByCollection.has(collectionKey)) stateByCollection.set(collectionKey, {
		seenTokenIds: /* @__PURE__ */ new Set(),
		marketplaceFinished: false,
		indexerTokensFetched: false,
		indexerTokenBalances: /* @__PURE__ */ new Map()
	});
	return stateByCollection.get(collectionKey);
}
function collectibleFromTokenBalance(token) {
	return {
		metadata: {
			tokenId: token.tokenID ?? "",
			attributes: token.tokenMetadata?.attributes ?? [],
			image: token.tokenMetadata?.image,
			name: token.tokenMetadata?.name ?? "",
			description: token.tokenMetadata?.description,
			video: token.tokenMetadata?.video,
			audio: token.tokenMetadata?.audio
		},
		contractInfo: token.contractInfo,
		contractType: token.contractType,
		balance: token.balance
	};
}
async function fetchAllIndexerTokens(chainId, accountAddress, collectionAddress, config, state, isLaos721) {
	if (isLaos721) {
		const laosClient = new LaosAPI();
		const { balances } = await laosClient.getTokenBalances({
			chainId: chainId.toString(),
			accountAddress,
			includeMetadata: true,
			contractAddress: collectionAddress,
			page: { sort: [{
				column: "CREATED_AT",
				order: "DESC"
			}] }
		});
		for (const balance of balances) if (balance.tokenID) state.indexerTokenBalances.set(balance.tokenID, collectibleFromTokenBalance(balance));
		state.indexerTokensFetched = true;
		return;
	}
	const indexerClient = getIndexerClient(chainId, config);
	let page = { pageSize: 50 };
	while (true) {
		const { balances, page: nextPage } = await indexerClient.getTokenBalances({
			accountAddress,
			contractAddress: collectionAddress,
			includeMetadata: true,
			page
		});
		for (const balance of balances) if (balance.tokenID) state.indexerTokenBalances.set(balance.tokenID, collectibleFromTokenBalance(balance));
		if (!nextPage.more) break;
		page = nextPage;
	}
	state.indexerTokensFetched = true;
}
function processRemainingIndexerTokens(state, page) {
	const allTokens = Array.from(state.indexerTokenBalances.values());
	const newTokens = allTokens.filter((token) => !state.seenTokenIds.has(token.metadata.tokenId));
	const startIndex = (page.page - 1) * page.pageSize;
	const endIndex = startIndex + page.pageSize;
	const paginatedTokens = newTokens.slice(startIndex, endIndex);
	for (const token of paginatedTokens) state.seenTokenIds.add(token.metadata.tokenId);
	return {
		collectibles: paginatedTokens,
		page: {
			page: page.page,
			pageSize: page.pageSize,
			more: endIndex < newTokens.length
		}
	};
}
function processMarketplaceCollectibles(collectibles, state, page) {
	for (const c of collectibles) state.seenTokenIds.add(c.metadata.tokenId);
	const enrichedCollectibles = collectibles.map((c) => {
		const tokenId = c.metadata.tokenId;
		const indexerData = state.indexerTokenBalances.get(tokenId);
		return {
			...c,
			balance: indexerData?.balance,
			contractInfo: indexerData?.contractInfo,
			contractType: indexerData?.contractType
		};
	});
	const marketplaceTokenIds = new Set(enrichedCollectibles.map((c) => c.metadata.tokenId));
	const missingTokens = Array.from(state.indexerTokenBalances.entries()).filter(([tokenId]) => !marketplaceTokenIds.has(tokenId)).map(([_, balance]) => balance).slice(0, page.pageSize);
	return {
		enrichedCollectibles,
		missingTokens
	};
}
async function fetchInventory(args, config, page) {
	const { accountAddress, collectionAddress, chainId, isLaos721 } = args;
	const collectionKey = getCollectionKey(args);
	const state = getOrInitState(collectionKey);
	if (!state.indexerTokensFetched) await fetchAllIndexerTokens(chainId, accountAddress, collectionAddress, config, state, isLaos721);
	if (state.marketplaceFinished) return processRemainingIndexerTokens(state, page);
	const marketplaceConfig = await fetchMarketplaceConfig({ config });
	const collectibles = await fetchListCollectibles({
		chainId,
		collectionAddress,
		filter: {
			inAccounts: [accountAddress],
			includeEmpty: true
		},
		side: OrderSide.listing,
		config
	}, marketplaceConfig, page);
	const { enrichedCollectibles, missingTokens } = processMarketplaceCollectibles(collectibles.collectibles, state, page);
	if (!collectibles.page?.more) {
		state.marketplaceFinished = true;
		return {
			collectibles: [...enrichedCollectibles, ...missingTokens],
			page: {
				page: collectibles.page?.page ?? page.page,
				pageSize: collectibles.page?.pageSize ?? page.pageSize,
				more: missingTokens.length > 0
			}
		};
	}
	return {
		collectibles: enrichedCollectibles,
		page: {
			page: collectibles.page?.page ?? page.page,
			pageSize: collectibles.page?.pageSize ?? page.pageSize,
			more: Boolean(collectibles.page?.more)
		}
	};
}
function inventoryOptions(args, config) {
	const collectionKey = getCollectionKey(args);
	const enabledQuery = args.query?.enabled ?? true;
	const enabled = enabledQuery && !!args.accountAddress && !!args.collectionAddress;
	return infiniteQueryOptions({
		queryKey: [
			"inventory",
			args.accountAddress,
			args.collectionAddress,
			args.chainId
		],
		queryFn: ({ pageParam }) => fetchInventory({
			...args,
			isLaos721: args.isLaos721 ?? false
		}, config, pageParam),
		initialPageParam: {
			page: 1,
			pageSize: 30
		},
		getNextPageParam: (lastPage) => lastPage.page?.more ? lastPage.page : void 0,
		enabled,
		meta: { onInvalidate: () => {
			stateByCollection.delete(collectionKey);
		} }
	});
}

//#endregion
//#region src/react/queries/listCollections.ts
const allCollections = (marketplaceConfig) => {
	return [...marketplaceConfig.market.collections, ...marketplaceConfig.shop.collections];
};
/**
* Fetches collections from the metadata API with marketplace config filtering
*/
async function fetchListCollections(params) {
	const { marketplaceType, marketplaceConfig, config } = params;
	const metadataClient = getMetadataClient(config);
	let collections = allCollections(marketplaceConfig);
	if (!collections?.length) return [];
	if (marketplaceType) collections = collections.filter((collection) => collection.marketplaceType === marketplaceType);
	const collectionsByChain = collections.reduce((acc, curr) => {
		const { chainId, itemsAddress } = curr;
		if (!acc[chainId]) acc[chainId] = [];
		acc[chainId].push(itemsAddress);
		return acc;
	}, {});
	const promises = Object.entries(collectionsByChain).map(([chainId, addresses]) => metadataClient.getContractInfoBatch({
		chainID: chainId,
		contractAddresses: addresses
	}).then((resp) => Object.values(resp.contractInfoMap)));
	const settled = await Promise.allSettled(promises);
	if (settled.every((result) => result.status === "rejected")) {
		const firstError = settled[0];
		throw firstError.reason;
	}
	const results = settled.filter((r) => r.status === "fulfilled").flatMap((r) => r.value);
	const collectionsWithMetadata = collections.map((collection) => {
		const metadata = results.find((result) => compareAddress(result.address, collection.itemsAddress));
		return {
			collection,
			metadata
		};
	}).filter((item) => item.metadata !== void 0).map(({ collection, metadata }) => ({
		...collection,
		...metadata
	}));
	return collectionsWithMetadata;
}
function listCollectionsQueryOptions(params) {
	const enabled = Boolean(params.marketplaceConfig && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectionKeys.list, params],
		queryFn: enabled ? () => fetchListCollections({
			marketplaceConfig: params.marketplaceConfig,
			config: params.config,
			marketplaceType: params.marketplaceType
		}) : skipToken,
		...params.query,
		enabled
	});
}
const listCollectionsOptions = ({ marketplaceType, marketplaceConfig, config }) => {
	return queryOptions({
		queryKey: [...collectionKeys.list, {
			marketplaceType,
			marketplaceConfig,
			config
		}],
		queryFn: marketplaceConfig ? () => fetchListCollections({
			marketplaceConfig,
			config,
			marketplaceType
		}) : skipToken,
		enabled: Boolean(marketplaceConfig)
	});
};

//#endregion
//#region src/react/queries/listTokenMetadata.ts
/**
* Fetches token metadata from the metadata API
*/
async function fetchListTokenMetadata(params) {
	const { chainId, contractAddress, tokenIds, config } = params;
	const metadataClient = getMetadataClient(config);
	const response = await metadataClient.getTokenMetadata({
		chainID: chainId.toString(),
		contractAddress,
		tokenIDs: tokenIds
	});
	return response.tokenMetadata;
}
function listTokenMetadataQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.contractAddress && params.tokenIds?.length && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...tokenKeys.metadata, params],
		queryFn: () => fetchListTokenMetadata({
			chainId: params.chainId,
			contractAddress: params.contractAddress,
			tokenIds: params.tokenIds,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/lowestListing.ts
/**
* Fetches the lowest listing for a collectible from the marketplace API
*/
async function fetchLowestListing(params) {
	const { collectionAddress, chainId, config,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		...additionalApiParams
	};
	const result = await marketplaceClient.getCollectibleLowestListing(apiArgs);
	return result.order || null;
}
function lowestListingQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.tokenId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.lowestListings, params],
		queryFn: () => fetchLowestListing({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			tokenId: params.tokenId,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/tokenSupplies.ts
/**
* Fetches token supplies with support for both indexer and LAOS APIs
* Uses the more efficient single-contract APIs from both services
*/
async function fetchTokenSupplies(params) {
	const { chainId, collectionAddress, config, isLaos721,...rest } = params;
	if (isLaos721) {
		const laosApi = new LaosAPI();
		const laosPage = rest.page ? { sort: rest.page.sort?.map((sortBy) => ({
			column: sortBy.column,
			order: sortBy.order
		})) || [] } : void 0;
		const result$1 = await laosApi.getTokenSupplies({
			chainId: chainId.toString(),
			contractAddress: collectionAddress,
			includeMetadata: rest.includeMetadata,
			page: laosPage
		});
		return result$1;
	}
	const indexerClient = getIndexerClient(chainId, config);
	const apiArgs = {
		contractAddress: collectionAddress,
		...rest
	};
	const result = await indexerClient.getTokenSupplies(apiArgs);
	return result;
}
function tokenSuppliesQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.collectionAddress && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...tokenKeys.supplies, params],
		queryFn: () => fetchTokenSupplies({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config,
			isLaos721: params.isLaos721,
			includeMetadata: params.includeMetadata,
			metadataOptions: params.metadataOptions,
			page: params.page
		}),
		...params.query,
		enabled
	});
}

//#endregion
export { balanceOfCollectibleOptions, clearInventoryState, collectibleQueryOptions, collectionDetailsQueryOptions, countOfPrimarySaleItemsOptions, currencyQueryOptions, fetchBalanceOfCollectible, fetchBalances, fetchCollectible, fetchCollectionDetails, fetchCountOfPrimarySaleItems, fetchCurrency, fetchFloorOrder, fetchHighestOffer, fetchInventory, fetchListCollectibles, fetchListCollections, fetchListTokenMetadata, fetchLowestListing, fetchMarketCurrencies, fetchTokenSupplies, floorOrderQueryOptions, highestOfferQueryOptions, inventoryOptions, listBalancesOptions, listCollectiblesQueryOptions, listCollectionsOptions, listCollectionsQueryOptions, listTokenMetadataQueryOptions, lowestListingQueryOptions, marketCurrenciesQueryOptions, tokenSuppliesQueryOptions };
//# sourceMappingURL=queries-CuHyCJ5v.js.map