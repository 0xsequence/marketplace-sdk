import { t as FilterCondition } from "./builder.gen-D7rQ1F-y.js";
import { _ as getQueryClient, f as currencyKeys, g as LaosAPI, i as getMetadataClient, l as collectableKeys, n as getIndexerClient, p as tokenKeys, r as getMarketplaceClient, s as balanceQueries, u as collectionKeys } from "./api-D_M2JwE1.js";
import { b as OrderSide, h as MetadataStatus } from "./marketplace.gen-Cjbln5Lz.js";
import { s as compareAddress } from "./utils-BcbSNdOG.js";
import { n as marketplaceConfigOptions, t as fetchMarketplaceConfig } from "./marketplaceConfig-CNVyg7Cu.js";
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
	if (args.isLaos721) return (await new LaosAPI().getTokenBalances({
		chainId: args.chainId.toString(),
		contractAddress: args.collectionAddress,
		accountAddress: args.userAddress,
		includeMetadata: true
	})).balances[0] || null;
	return getIndexerClient(args.chainId, config).getTokenBalances({
		accountAddress: args.userAddress,
		contractAddress: args.collectionAddress,
		tokenID: args.collectableId,
		includeMetadata: args.includeMetadata ?? false,
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
	return (await metadataClient.getTokenMetadata(apiArgs)).tokenMetadata[0];
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
		return (await client.getCountOfFilteredCollectibles(apiArgs$1)).count;
	}
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId)
	};
	return (await client.getCountOfAllCollectibles(apiArgs)).count;
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
	if (args.isLaos721 && args.accountAddress) return new LaosAPI().getTokenBalances({
		chainId: args.chainId.toString(),
		accountAddress: args.accountAddress,
		contractAddress: args.contractAddress,
		includeMetadata: args.includeMetadata,
		page: { sort: [{
			column: "CREATED_AT",
			order: "DESC"
		}] }
	});
	return getIndexerClient(args.chainId, config).getTokenBalances({
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
	const isMarketCollection = (await fetchMarketplaceConfig({ config }))?.market.collections.some((collection) => compareAddress(collection.itemsAddress, collectionAddress));
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
		const balances = await fetchBalances({
			chainId: params.chainId,
			accountAddress: params.filter?.inAccounts?.[0],
			contractAddress: params.collectionAddress,
			page,
			includeMetadata: true,
			isLaos721: true
		}, config, page);
		return {
			collectibles: balances.balances.map((balance) => {
				if (!balance.tokenMetadata) throw new Error("Token metadata not found");
				return { metadata: {
					tokenId: balance.tokenID ?? "",
					attributes: balance.tokenMetadata.attributes,
					image: balance.tokenMetadata.image,
					name: balance.tokenMetadata.name,
					description: balance.tokenMetadata.description,
					video: balance.tokenMetadata.video,
					audio: balance.tokenMetadata.audio,
					status: MetadataStatus.AVAILABLE
				} };
			}),
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
				cardType: params.cardType
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
	return (await getMetadataClient(config).getContractInfo({
		chainID: chainId.toString(),
		contractAddress: collectionAddress
	})).contractInfo;
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
	const mergedResponse = (await Promise.all(promises)).reduce((acc, curr) => {
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
	return (await marketplaceClient.getCollectionDetail(apiArgs)).collection;
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
	const { cardType, marketplaceConfig, config } = params;
	const metadataClient = getMetadataClient(config);
	let collections = allCollections(marketplaceConfig);
	if (!collections?.length) return [];
	if (cardType) collections = collections.filter((collection) => collection.cardType === cardType);
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
	if (settled.every((result) => result.status === "rejected")) throw settled[0].reason;
	const results = settled.filter((r) => r.status === "fulfilled").flatMap((r) => r.value);
	return collections.map((collection) => {
		return {
			collection,
			metadata: results.find((result) => compareAddress(result.address, collection.itemsAddress))
		};
	}).filter((item) => item.metadata !== void 0).map(({ collection, metadata }) => ({
		...collection,
		...metadata
	}));
}
function listCollectionsQueryOptions(params) {
	const enabled = Boolean(params.marketplaceConfig && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectionKeys.list, params],
		queryFn: enabled ? () => fetchListCollections({
			marketplaceConfig: params.marketplaceConfig,
			config: params.config,
			cardType: params.cardType
		}) : skipToken,
		...params.query,
		enabled
	});
}
const listCollectionsOptions = ({ cardType, marketplaceConfig, config }) => {
	return queryOptions({
		queryKey: [...collectionKeys.list, {
			cardType,
			marketplaceConfig,
			config
		}],
		queryFn: marketplaceConfig ? () => fetchListCollections({
			marketplaceConfig,
			config,
			cardType
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
	let currencies = getQueryClient().getQueryData([...currencyKeys.lists, chainId]);
	if (!currencies) currencies = await getMarketplaceClient(config).listCurrencies({ chainId: String(chainId) }).then((resp) => resp.currencies);
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
	let currencies = await getMarketplaceClient(config).listCurrencies({ chainId: String(chainId) }).then((resp) => resp.currencies.map((currency) => ({
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
	return (await client.getCountOfListingsForCollectible(apiArgs)).count;
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
	return (await client.getCountOfOffersForCollectible(apiArgs)).count;
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
	return (await marketplaceClient.getFloorOrder(apiArgs)).collectible;
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
	return (await marketplaceClient.getCollectibleHighestOffer(apiArgs)).order ?? null;
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
//#region src/react/queries/listOffersForCollectible.ts
/**
* Fetches offers for a specific collectible from the Marketplace API
*/
async function fetchListOffersForCollectible(params) {
	const { collectionAddress, chainId, collectibleId, config, sort, page,...additionalApiParams } = params;
	const marketplaceClient = getMarketplaceClient(config);
	const finalSort = sort || (page && "sort" in page ? page.sort : void 0);
	let finalPage;
	if (page || finalSort) finalPage = {
		page: page?.page ?? 1,
		pageSize: page?.pageSize ?? 20,
		...page?.more && { more: page.more },
		...finalSort && { sort: finalSort }
	};
	const apiArgs = {
		contractAddress: collectionAddress,
		chainId: String(chainId),
		tokenId: collectibleId,
		page: finalPage,
		...additionalApiParams
	};
	return await marketplaceClient.listCollectibleOffers(apiArgs);
}
function listOffersForCollectibleQueryOptions(params) {
	const enabled = Boolean(params.collectionAddress && params.chainId && params.collectibleId && params.config && (params.query?.enabled ?? true));
	return queryOptions({
		queryKey: [...collectableKeys.offers, params],
		queryFn: () => fetchListOffersForCollectible({
			chainId: params.chainId,
			collectionAddress: params.collectionAddress,
			collectibleId: params.collectibleId,
			config: params.config,
			filter: params.filter,
			page: params.page,
			sort: params.sort
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
	return (await marketplaceClient.getCollectibleLowestListing(apiArgs)).order || null;
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
	return await client.checkoutOptionsMarketplace(apiArgs);
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
	return await client.checkoutOptionsSalesContract(apiArgs);
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
	return (await marketplaceClient.getCountOfPrimarySaleItems({
		chainId: String(chainId),
		primarySaleContractAddress,
		filter
	})).count;
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
	const filters = await getMetadataClient(config).getTokenMetadataPropertyFilters({
		chainID: chainId.toString(),
		contractAddress: collectionAddress,
		excludeProperties: [],
		excludePropertyValues
	}).then((resp) => resp.filters);
	if (showAllFilters) return filters;
	const collectionFilters = (await getQueryClient().fetchQuery(marketplaceConfigOptions(config))).market.collections.find((c) => compareAddress(c.itemsAddress, collectionAddress))?.filterSettings;
	const filterOrder = collectionFilters?.filterOrder;
	const exclusions = collectionFilters?.exclusions;
	let sortedFilters = filters;
	if (filterOrder) sortedFilters = filters.toSorted((a, b) => {
		return (filterOrder.indexOf(a.name) > -1 ? filterOrder.indexOf(a.name) : filterOrder.length) - (filterOrder.indexOf(b.name) > -1 ? filterOrder.indexOf(b.name) : filterOrder.length);
	});
	if (exclusions) sortedFilters = sortedFilters.reduce((acc, filter) => {
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
	return sortedFilters;
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
	const response = await getIndexerClient(chainId, config).getTokenIDRanges({ contractAddress: collectionAddress });
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
//#region src/react/queries/tokenBalances.ts
/**
* Fetches the token balances for a user
*
* @param args - Arguments for the API call
* @param config - SDK configuration
* @returns The balance data
*/
async function fetchTokenBalances(args, config) {
	if (args.isLaos721) return (await new LaosAPI().getTokenBalances({
		chainId: args.chainId.toString(),
		contractAddress: args.collectionAddress,
		accountAddress: args.userAddress,
		includeMetadata: true
	})).balances || [];
	return getIndexerClient(args.chainId, config).getTokenBalances({
		accountAddress: args.userAddress,
		contractAddress: args.collectionAddress,
		includeMetadata: args.includeMetadata ?? false,
		metadataOptions: {
			verifiedOnly: true,
			includeContracts: [args.collectionAddress]
		}
	}).then((res) => res.balances || []);
}
/**
* Creates a tanstack query options object for the token balances query
*
* @param args - The query arguments
* @param config - SDK configuration
* @returns Query options configuration
*/
function tokenBalancesOptions(args, config) {
	const enabled = !!args.userAddress && !!args.collectionAddress && (args.query?.enabled ?? true);
	return queryOptions({
		queryKey: [...collectableKeys.userBalances, args],
		queryFn: enabled ? () => fetchTokenBalances({
			...args,
			userAddress: args.userAddress
		}, config) : skipToken
	});
}

//#endregion
//#region src/react/queries/inventory.ts
function collectibleFromTokenBalance(token) {
	return {
		metadata: {
			tokenId: token.tokenID ?? "",
			attributes: token.tokenMetadata?.attributes ?? [],
			image: token.tokenMetadata?.image,
			name: token.tokenMetadata?.name ?? "",
			description: token.tokenMetadata?.description,
			video: token.tokenMetadata?.video,
			audio: token.tokenMetadata?.audio,
			status: MetadataStatus.AVAILABLE
		},
		contractInfo: token.contractInfo,
		contractType: token.contractType,
		balance: token.balance
	};
}
async function fetchIndexerTokens(chainId, accountAddress, collectionAddress, config, isLaos721) {
	return { collectibles: (await getQueryClient().fetchQuery(tokenBalancesOptions({
		collectionAddress,
		userAddress: accountAddress,
		chainId,
		isLaos721,
		includeMetadata: true
	}, config))).map((balance) => collectibleFromTokenBalance(balance)) };
}
async function fetchInventory(args, config, page) {
	const { accountAddress, collectionAddress, chainId, isLaos721 } = args;
	const isTradable = ((await fetchMarketplaceConfig({ config }))?.market.collections || []).some((collection) => compareAddress(collection.itemsAddress, collectionAddress));
	const { collectibles } = await fetchIndexerTokens(chainId, accountAddress, collectionAddress, config, isLaos721);
	return {
		collectibles,
		page: {
			page: page.page,
			pageSize: page.pageSize
		},
		isTradable
	};
}
function inventoryOptions(args, config) {
	const enabled = (args.query?.enabled ?? true) && !!args.accountAddress && !!args.collectionAddress;
	return queryOptions({
		queryKey: [
			"inventory",
			args.accountAddress,
			args.collectionAddress,
			args.chainId,
			args.query?.page ?? 1,
			args.query?.pageSize ?? 30
		],
		queryFn: () => fetchInventory({
			...args,
			isLaos721: args.isLaos721 ?? false
		}, config, {
			page: args.query?.page ?? 1,
			pageSize: args.query?.pageSize ?? 30
		}),
		enabled
	});
}

//#endregion
//#region src/react/queries/listTokenMetadata.ts
/**
* Fetches token metadata from the metadata API
*/
async function fetchListTokenMetadata(params) {
	const { chainId, contractAddress, tokenIds, config } = params;
	return (await getMetadataClient(config).getTokenMetadata({
		chainID: chainId.toString(),
		contractAddress,
		tokenIDs: tokenIds
	})).tokenMetadata;
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
	return getMarketplaceClient(config).listPrimarySaleItems({
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
	return getMarketplaceClient(config).getCountOfPrimarySaleItems({
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
	const response = await getMetadataClient(config).searchTokenMetadata({
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
		return await laosApi.getTokenSupplies({
			chainId: chainId.toString(),
			contractAddress: collectionAddress,
			includeMetadata: rest.includeMetadata,
			page: laosPage
		});
	}
	const indexerClient = getIndexerClient(chainId, config);
	const apiArgs = {
		contractAddress: collectionAddress,
		...rest
	};
	return await indexerClient.getTokenSupplies(apiArgs);
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
export { fetchCollectionBalanceDetails as $, listOffersForCollectibleQueryOptions as A, fetchCountListingsForCollectible as B, checkoutOptionsSalesContractQueryOptions as C, fetchLowestListing as D, fetchCheckoutOptions as E, fetchFloorOrder as F, fetchListCollections as G, marketCurrenciesQueryOptions as H, floorOrderQueryOptions as I, fetchListCollectionActivities as J, listCollectionsOptions as K, countOffersForCollectibleQueryOptions as L, listListingsForCollectibleQueryOptions as M, fetchHighestOffer as N, lowestListingQueryOptions as O, highestOfferQueryOptions as P, collectionBalanceDetailsQueryOptions as Q, fetchCountOffersForCollectible as R, fetchConvertPriceToUSD as S, checkoutOptionsQueryOptions as T, currencyQueryOptions as U, fetchMarketCurrencies as V, fetchCurrency as W, collectionDetailsQueryOptions as X, listCollectionActivitiesQueryOptions as Y, fetchCollectionDetails as Z, countOfPrimarySaleItemsOptions as _, fetchPrimarySaleItemsCount as a, listCollectiblesQueryOptions as at, fetchComparePrices as b, listPrimarySaleItemsQueryOptions as c, fetchListCollectibleActivities as ct, fetchInventory as d, fetchCountOfCollectables as dt, collectionQueryOptions as et, inventoryOptions as f, collectibleQueryOptions as ft, filtersQueryOptions as g, fetchFilters as h, fetchBalanceOfCollectible as ht, searchTokenMetadataQueryOptions as i, fetchListCollectibles as it, fetchListListingsForCollectible as j, fetchListOffersForCollectible as k, fetchListTokenMetadata as l, listCollectibleActivitiesQueryOptions as lt, getTokenRangesQueryOptions as m, balanceOfCollectibleOptions as mt, tokenSuppliesQueryOptions as n, fetchListCollectiblesPaginated as nt, primarySaleItemsCountQueryOptions as o, fetchBalances as ot, fetchGetTokenRanges as p, fetchCollectible as pt, listCollectionsQueryOptions as q, fetchSearchTokenMetadata as r, listCollectiblesPaginatedQueryOptions as rt, fetchPrimarySaleItems as s, listBalancesOptions as st, fetchTokenSupplies as t, fetchCollection as tt, listTokenMetadataQueryOptions as u, countOfCollectablesQueryOptions as ut, fetchCountOfPrimarySaleItems as v, fetchCheckoutOptionsSalesContract as w, convertPriceToUSDQueryOptions as x, comparePricesQueryOptions as y, countListingsForCollectibleQueryOptions as z };
//# sourceMappingURL=queries-DR0GfHwX.js.map