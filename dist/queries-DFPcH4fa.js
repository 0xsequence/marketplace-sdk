import { FilterCondition } from "./builder.gen-B9wR2nvF.js";
import { LaosAPI, balanceQueries, collectableKeys, collectionKeys, currencyKeys, getIndexerClient, getMarketplaceClient, getMetadataClient, getQueryClient, tokenKeys } from "./api-BmEQfSQa.js";
import { OrderSide } from "./marketplace.gen-JzNYpM0U.js";
import { compareAddress } from "./utils-CKJd-CRf.js";
import { fetchMarketplaceConfig, marketplaceConfigOptions } from "./marketplaceConfig-sNh-MA5M.js";
import { infiniteQueryOptions, queryOptions, skipToken } from "@tanstack/react-query";
import { formatUnits, zeroAddress } from "viem";

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
//#region src/react/queries/countOfCollectables.ts
/**
* Fetches count of collectibles from the marketplace API
*/
async function fetchCountOfCollectables(params) {
	const { collectionAddress, chainId, config, filter, side } = params;
	const client = getMarketplaceClient(config);
	if (filter && side) {
		const apiArgs$1 = {
			contractAddress: collectionAddress,
			chainId: String(chainId),
			filter,
			side
		};
		const result$1 = await client.getCountOfFilteredCollectibles(apiArgs$1);
		return result$1.count;
	}
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId)
	};
	const result = await client.getCountOfAllCollectibles(apiArgs);
	return result.count;
}
function countOfCollectablesQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.counts, params],
		queryFn: () => fetchCountOfCollectables({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config,
			filter: params.filter,
			side: params.side
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/listCollectibleActivities.ts
/**
* Fetches collectible activities from the Marketplace API
*/
async function fetchListCollectibleActivities(params) {
	const { collectionAddress, chainId, config, page, pageSize, sort,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const pageParams = page || pageSize || sort ? {
		page: page ?? 1,
		pageSize: pageSize ?? 10,
		sort
	} : void 0;
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		page: pageParams,
		...additionalApiParams
	};
	return await marketplaceClient.listCollectibleActivities(apiArgs);
}
function listCollectibleActivitiesQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.tokenId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.collectibleActivities, params],
		queryFn: () => fetchListCollectibleActivities({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config,
			tokenId: params.tokenId,
			page: params.page,
			pageSize: params.pageSize,
			sort: params.sort
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
async function fetchListCollectibles(params, page) {
	const { collectionAddress, chainId, config,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const marketplaceConfig = await fetchMarketplaceConfig({ config });
	const isMarketCollection = marketplaceConfig?.market.collections.some((collection) => compareAddress(collection.itemsAddress, collectionAddress));
	if (params.enabled === false || !isMarketCollection) return {
		collectibles: [],
		page: {
			page: 1,
			pageSize: 30,
			more: false
		}
	};
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		page,
		...additionalApiParams
	};
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
			return fetchListCollectibles({
				chainId: params.chainId,
				collectionAddress: params.collectionAddress,
				config: params.config,
				side: params.side,
				filter: params.filter,
				isLaos721: params.isLaos721,
				marketplaceType: params.marketplaceType
			}, pageParam);
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
//#region src/react/queries/listCollectiblesPaginated.ts
/**
* Fetches a list of collectibles with pagination support from the Marketplace API
*/
async function fetchListCollectiblesPaginated(params) {
	const { collectionAddress, chainId, config, page = 1, pageSize = 30,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const pageParams = {
		page,
		pageSize
	};
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		page: pageParams,
		...additionalApiParams
	};
	return await marketplaceClient.listCollectibles(apiArgs);
}
function listCollectiblesPaginatedQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.side && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [
			...collectableKeys.lists,
			"paginated",
			params
		],
		queryFn: () => fetchListCollectiblesPaginated({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config,
			side: params.side,
			filter: params.filter,
			page: params.page,
			pageSize: params.pageSize
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/collection.ts
/**
* Fetches collection information from the metadata API
*/
async function fetchCollection(params) {
	const { collectionAddress, chainId, config } = params;
	const metadataClient = getMetadataClient(config);
	const result = await metadataClient.getContractInfo({
		chainID: chainId.toString(),
		contractAddress: collectionAddress
	});
	return result.contractInfo;
}
function collectionQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectionKeys.detail, params],
		queryFn: () => fetchCollection({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/collectionBalanceDetails.ts
/**
* Fetches detailed balance information for multiple accounts from the Indexer API
*/
async function fetchCollectionBalanceDetails(params) {
	const { chainId, filter, config } = params;
	const indexerClient = getIndexerClient(chainId, config);
	const promises = filter.accountAddresses.map((accountAddress) => indexerClient.getTokenBalancesDetails({ filter: {
		accountAddresses: [accountAddress],
		contractWhitelist: filter.contractWhitelist,
		omitNativeBalances: filter.omitNativeBalances
	} }));
	const responses = await Promise.all(promises);
	const mergedResponse = responses.reduce((acc, curr) => {
		if (!curr) return acc;
		return {
			page: curr.page,
			nativeBalances: [...acc.nativeBalances || [], ...curr.nativeBalances || []],
			balances: [...acc.balances || [], ...curr.balances || []]
		};
	}, {
		page: {},
		nativeBalances: [],
		balances: []
	});
	if (!mergedResponse) throw new Error("Failed to fetch collection balance details");
	return mergedResponse;
}
function collectionBalanceDetailsQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.filter?.accountAddresses?.length && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [
			"balances",
			"collectionBalanceDetails",
			params
		],
		queryFn: () => fetchCollectionBalanceDetails({
			chainId: params.chainId,
			filter: params.filter,
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
//#region src/react/queries/listCollectionActivities.ts
/**
* Fetches collection activities from the Marketplace API
*/
async function fetchListCollectionActivities(params) {
	const { collectionAddress, chainId, config, page, pageSize, sort,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const pageParams = page || pageSize || sort ? {
		page: page ?? 1,
		pageSize: pageSize ?? 10,
		sort
	} : void 0;
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		page: pageParams,
		...additionalApiParams
	};
	return await marketplaceClient.listCollectionActivities(apiArgs);
}
function listCollectionActivitiesQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectionKeys.collectionActivities, params],
		queryFn: () => fetchListCollectionActivities({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config,
			page: params.page,
			pageSize: params.pageSize,
			sort: params.sort
		}),
		...params.query,
		enabled
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
//#region src/react/queries/countListingsForCollectible.ts
/**
* Fetches count of listings for a collectible from the marketplace API
*/
async function fetchCountListingsForCollectible(params) {
	const { collectionAddress, chainId, collectibleId, config, filter } = params;
	const client = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		tokenId: collectibleId,
		filter
	};
	const result = await client.getCountOfListingsForCollectible(apiArgs);
	return result.count;
}
function countListingsForCollectibleQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.collectibleId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.listingsCount, params],
		queryFn: () => fetchCountListingsForCollectible({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			collectibleId: params.collectibleId,
			config: params.config,
			filter: params.filter
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/countOffersForCollectible.ts
/**
* Fetches count of offers for a collectible from the marketplace API
*/
async function fetchCountOffersForCollectible(params) {
	const { collectionAddress, chainId, collectibleId, config, filter } = params;
	const client = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		tokenId: collectibleId,
		filter
	};
	const result = await client.getCountOfOffersForCollectible(apiArgs);
	return result.count;
}
function countOffersForCollectibleQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.collectibleId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.offersCount, params],
		queryFn: () => fetchCountOffersForCollectible({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			collectibleId: params.collectibleId,
			config: params.config,
			filter: params.filter
		}),
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
//#region src/react/queries/listListingsForCollectible.ts
/**
* Fetches listings for a specific collectible from the Marketplace API
*/
async function fetchListListingsForCollectible(params) {
	const { collectionAddress, chainId, collectibleId, config,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		tokenId: collectibleId,
		...additionalApiParams
	};
	return await marketplaceClient.listCollectibleListings(apiArgs);
}
function listListingsForCollectibleQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.collectibleId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.listings, params],
		queryFn: () => fetchListListingsForCollectible({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			collectibleId: params.collectibleId,
			config: params.config,
			filter: params.filter,
			page: params.page
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
//#region src/react/queries/filters.ts
/**
* Fetches collection filters from the Metadata API with optional marketplace filtering
*/
async function fetchFilters(params) {
	const { chainId, collectionAddress, showAllFilters, excludePropertyValues, config } = params;
	const metadataClient = getMetadataClient(config);
	const filters = await metadataClient.getTokenMetadataPropertyFilters({
		chainID: chainId.toString(),
		contractAddress: collectionAddress,
		excludeProperties: [],
		excludePropertyValues
	}).then((resp) => resp.filters);
	if (showAllFilters) return filters;
	const queryClient = getQueryClient();
	const marketplaceConfig = await queryClient.fetchQuery(marketplaceConfigOptions(config));
	const collectionFilters = marketplaceConfig.market.collections.find((c) => compareAddress(c.itemsAddress, collectionAddress))?.filterSettings;
	if (!collectionFilters?.exclusions || collectionFilters.exclusions.length === 0 || !collectionFilters.filterOrder || collectionFilters.filterOrder.length === 0) return filters;
	const { filterOrder, exclusions } = collectionFilters;
	const sortedFilters = filters.toSorted((a, b) => {
		const aIndex = filterOrder.indexOf(a.name) > -1 ? filterOrder.indexOf(a.name) : filterOrder.length;
		const bIndex = filterOrder.indexOf(b.name) > -1 ? filterOrder.indexOf(b.name) : filterOrder.length;
		return aIndex - bIndex;
	});
	const filteredResults = sortedFilters.reduce((acc, filter) => {
		const exclusionRule = exclusions.find((rule) => rule.key === filter.name);
		if (!exclusionRule) {
			acc.push(filter);
			return acc;
		}
		if (exclusionRule.condition === FilterCondition.ENTIRE_KEY) return acc;
		if (exclusionRule.condition === FilterCondition.SPECIFIC_VALUE && exclusionRule.value) {
			const filteredValues = filter.values?.filter((value) => value !== exclusionRule.value) || [];
			if (filteredValues.length > 0) acc.push({
				...filter,
				values: filteredValues
			});
		}
		return acc;
	}, []);
	return filteredResults;
}
function filtersQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.collectionAddress && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: ["filters", params],
		queryFn: () => fetchFilters({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			showAllFilters: params.showAllFilters,
			excludePropertyValues: params.excludePropertyValues,
			config: params.config
		}),
		...params.query,
		enabled
	});
}

//#endregion
//#region src/react/queries/getTokenRanges.ts
/**
* Fetches token ID ranges for a collection from the Indexer API
*/
async function fetchGetTokenRanges(params) {
	const { chainId, collectionAddress, config } = params;
	const indexerClient = getIndexerClient(chainId, config);
	const response = await indexerClient.getTokenIDRanges({ contractAddress: collectionAddress });
	if (!response) throw new Error("Failed to fetch token ranges");
	return response;
}
function getTokenRangesQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.collectionAddress && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [
			"indexer",
			"tokenRanges",
			params
		],
		queryFn: () => fetchGetTokenRanges({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			config: params.config
		}),
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
		marketFinished: false,
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
function processRemainingIndexerTokens(state, page, isTradable) {
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
		},
		isTradable
	};
}
function processMarketCollectibles(collectibles, state, page) {
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
	const marketTokenIds = new Set(enrichedCollectibles.map((c) => c.metadata.tokenId));
	const missingTokens = Array.from(state.indexerTokenBalances.entries()).filter(([tokenId]) => !marketTokenIds.has(tokenId)).map(([_, balance]) => balance).slice(0, page.pageSize);
	return {
		enrichedCollectibles,
		missingTokens
	};
}
async function fetchInventory(args, config, page) {
	const { accountAddress, collectionAddress, chainId, isLaos721 } = args;
	const collectionKey = getCollectionKey(args);
	const state = getOrInitState(collectionKey);
	const marketplaceConfig = await fetchMarketplaceConfig({ config });
	const marketCollections = marketplaceConfig?.market.collections || [];
	const isMarketCollection = marketCollections.some((collection) => compareAddress(collection.itemsAddress, collectionAddress));
	if (!state.indexerTokensFetched) await fetchAllIndexerTokens(chainId, accountAddress, collectionAddress, config, state, isLaos721);
	const isTradable = isMarketCollection;
	if (state.marketFinished) return processRemainingIndexerTokens(state, page, isTradable);
	const marketCollectibles = await fetchListCollectibles({
		chainId,
		collectionAddress,
		filter: {
			inAccounts: [accountAddress],
			includeEmpty: true
		},
		side: OrderSide.listing,
		config
	}, page);
	const { enrichedCollectibles: enrichedMarketCollectibles, missingTokens } = processMarketCollectibles(marketCollectibles.collectibles, state, page);
	if (!marketCollectibles.page?.more) {
		state.marketFinished = true;
		return {
			collectibles: [...enrichedMarketCollectibles, ...missingTokens],
			page: {
				page: marketCollectibles.page?.page ?? page.page,
				pageSize: marketCollectibles.page?.pageSize ?? page.pageSize,
				more: missingTokens.length > 0
			},
			isTradable
		};
	}
	return {
		collectibles: enrichedMarketCollectibles,
		page: {
			page: marketCollectibles.page?.page ?? page.page,
			pageSize: marketCollectibles.page?.pageSize ?? page.pageSize,
			more: Boolean(marketCollectibles.page?.more)
		},
		isTradable
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
//#region src/react/queries/primarySaleItems.ts
/**
* Fetches primary sale items from the marketplace API
*/
async function fetchPrimarySaleItems(params) {
	const { chainId, primarySaleContractAddress, filter, page, config } = params;
	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.listPrimarySaleItems({
		chainId: String(chainId),
		primarySaleContractAddress,
		filter,
		page
	});
}
const listPrimarySaleItemsQueryOptions = (params) => {
	const enabled = Boolean(params.primarySaleContractAddress && params.chainId && params.config && (params.query?.enabled ?? true));
	const initialPage = params.page || {
		page: 1,
		pageSize: 30
	};
	return infiniteQueryOptions({
		queryKey: ["listPrimarySaleItems", params],
		queryFn: async ({ pageParam }) => {
			return fetchPrimarySaleItems({
				chainId: params.chainId,
				primarySaleContractAddress: params.primarySaleContractAddress,
				filter: params.filter,
				page: pageParam,
				config: params.config
			});
		},
		initialPageParam: initialPage,
		getNextPageParam: (lastPage) => lastPage.page?.more ? lastPage.page : void 0,
		...params.query,
		enabled
	});
};

//#endregion
//#region src/react/queries/primarySaleItemsCount.ts
/**
* Fetches the count of primary sale items from the marketplace API
*/
async function fetchPrimarySaleItemsCount(params) {
	const { chainId, primarySaleContractAddress, filter, config } = params;
	const marketplaceClient = getMarketplaceClient(config);
	return marketplaceClient.getCountOfPrimarySaleItems({
		chainId: String(chainId),
		primarySaleContractAddress,
		filter
	});
}
const primarySaleItemsCountQueryOptions = (args) => {
	const enabled = Boolean(args.primarySaleContractAddress && args.chainId && args.config && (args.query?.enabled ?? true));
	return queryOptions({
		queryKey: ["primarySaleItemsCount", args],
		queryFn: () => fetchPrimarySaleItemsCount({
			chainId: args.chainId,
			primarySaleContractAddress: args.primarySaleContractAddress,
			filter: args.filter,
			config: args.config
		}),
		...args.query,
		enabled
	});
};

//#endregion
//#region src/react/queries/searchTokenMetadata.ts
/**
* Fetches token metadata from the metadata API using search filters
*/
async function fetchSearchTokenMetadata(params) {
	const { chainId, collectionAddress, filter, page, config } = params;
	const metadataClient = getMetadataClient(config);
	const response = await metadataClient.searchTokenMetadata({
		chainID: chainId.toString(),
		contractAddress: collectionAddress,
		filter: filter ?? {},
		page
	});
	return {
		tokenMetadata: response.tokenMetadata,
		page: response.page
	};
}
function searchTokenMetadataQueryOptions(params) {
	const enabled = Boolean(params.chainId && params.collectionAddress && params.config && (params.query?.enabled ?? true));
	const initialPageParam = {
		page: 1,
		pageSize: 30
	};
	return infiniteQueryOptions({
		queryKey: [
			...tokenKeys.metadata,
			"search",
			params
		],
		queryFn: ({ pageParam = initialPageParam }) => fetchSearchTokenMetadata({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			filter: params.filter,
			config: params.config,
			page: pageParam
		}),
		initialPageParam,
		getNextPageParam: (lastPage) => {
			if (!lastPage.page?.more) return void 0;
			return {
				page: (lastPage.page.page || 1) + 1,
				pageSize: lastPage.page.pageSize || 20
			};
		},
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
	const initialPageParam = {
		page: 1,
		pageSize: 30
	};
	const queryFn = async ({ pageParam = initialPageParam }) => fetchTokenSupplies({
		chainId: params.chainId,
		collectionAddress: params.collectionAddress,
		config: params.config,
		isLaos721: params.isLaos721,
		includeMetadata: params.includeMetadata,
		metadataOptions: params.metadataOptions,
		page: pageParam
	});
	return infiniteQueryOptions({
		queryKey: [...tokenKeys.supplies, params],
		queryFn,
		initialPageParam,
		getNextPageParam: (lastPage) => lastPage.page?.more ? lastPage.page : void 0,
		...params.query,
		enabled
	});
}

//#endregion
export { balanceOfCollectibleOptions, checkoutOptionsQueryOptions, checkoutOptionsSalesContractQueryOptions, clearInventoryState, collectibleQueryOptions, collectionBalanceDetailsQueryOptions, collectionDetailsQueryOptions, collectionQueryOptions, comparePricesQueryOptions, convertPriceToUSDQueryOptions, countListingsForCollectibleQueryOptions, countOfCollectablesQueryOptions, countOfPrimarySaleItemsOptions, countOffersForCollectibleQueryOptions, currencyQueryOptions, fetchBalanceOfCollectible, fetchBalances, fetchCheckoutOptions, fetchCheckoutOptionsSalesContract, fetchCollectible, fetchCollection, fetchCollectionBalanceDetails, fetchCollectionDetails, fetchComparePrices, fetchConvertPriceToUSD, fetchCountListingsForCollectible, fetchCountOfCollectables, fetchCountOfPrimarySaleItems, fetchCountOffersForCollectible, fetchCurrency, fetchFilters, fetchFloorOrder, fetchGetTokenRanges, fetchHighestOffer, fetchInventory, fetchListCollectibleActivities, fetchListCollectibles, fetchListCollectiblesPaginated, fetchListCollectionActivities, fetchListCollections, fetchListListingsForCollectible, fetchListTokenMetadata, fetchLowestListing, fetchMarketCurrencies, fetchPrimarySaleItems, fetchPrimarySaleItemsCount, fetchSearchTokenMetadata, fetchTokenSupplies, filtersQueryOptions, floorOrderQueryOptions, getTokenRangesQueryOptions, highestOfferQueryOptions, inventoryOptions, listBalancesOptions, listCollectibleActivitiesQueryOptions, listCollectiblesPaginatedQueryOptions, listCollectiblesQueryOptions, listCollectionActivitiesQueryOptions, listCollectionsOptions, listCollectionsQueryOptions, listListingsForCollectibleQueryOptions, listPrimarySaleItemsQueryOptions, listTokenMetadataQueryOptions, lowestListingQueryOptions, marketCurrenciesQueryOptions, primarySaleItemsCountQueryOptions, searchTokenMetadataQueryOptions, tokenSuppliesQueryOptions };
//# sourceMappingURL=queries-DFPcH4fa.js.map