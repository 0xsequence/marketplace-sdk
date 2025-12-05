import { t as BuilderAPI } from "./builder-api.js";
import { p as Marketplace } from "./marketplace.gen.js";
import { t as getNetwork } from "./network.js";
import { stringTemplate } from "@0xsequence/network";
import { QueryClient, defaultShouldDehydrateQuery } from "@tanstack/react-query";
import { hashFn } from "wagmi/query";
import { SequenceAPIClient } from "@0xsequence/api";
import { SequenceIndexer } from "@0xsequence/indexer";
import { SequenceMetadata } from "@0xsequence/metadata";

//#region src/react/_internal/api/get-query-client.ts
function makeQueryClient() {
	return new QueryClient({ defaultOptions: {
		queries: {
			staleTime: 60 * 1e3,
			queryKeyHashFn: hashFn
		},
		dehydrate: { shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === "pending" }
	} });
}
let browserQueryClient;
function getQueryClient() {
	if (typeof globalThis.document === "undefined") return makeQueryClient();
	if (!browserQueryClient) browserQueryClient = makeQueryClient();
	return browserQueryClient;
}

//#endregion
//#region src/react/_internal/api/marketplace-api.ts
var SequenceMarketplace = class extends Marketplace {
	constructor(hostname, projectAccessKey, jwtAuth) {
		super(hostname.endsWith("/") ? hostname.slice(0, -1) : hostname, fetch);
		this.projectAccessKey = projectAccessKey;
		this.jwtAuth = jwtAuth;
		this.fetch = this._fetch;
	}
	_fetch = (input, init) => {
		const headers = {};
		const jwtAuth = this.jwtAuth;
		const projectAccessKey = this.projectAccessKey;
		if (jwtAuth && jwtAuth.length > 0) headers.Authorization = `BEARER ${jwtAuth}`;
		if (projectAccessKey && projectAccessKey.length > 0) headers["X-Access-Key"] = projectAccessKey;
		const requestInit = init || {};
		requestInit.headers = {
			...init?.headers,
			...headers
		};
		return fetch(input, requestInit);
	};
};

//#endregion
//#region src/react/_internal/api/query-keys.ts
var CollectableKeys = class CollectableKeys {
	static all = ["collectable"];
	static details = [...CollectableKeys.all, "details"];
	static lists = [...CollectableKeys.all, "list"];
	static floorOrders = [...CollectableKeys.all, "floorOrders"];
	static userBalances = [
		...CollectableKeys.all,
		...CollectableKeys.details,
		"userBalances"
	];
	static royaltyPercentage = [...CollectableKeys.all, "royaltyPercentage"];
	static highestOffers = [
		...CollectableKeys.all,
		...CollectableKeys.details,
		"highestOffers"
	];
	static lowestListings = [
		...CollectableKeys.all,
		...CollectableKeys.details,
		"lowestListings"
	];
	static offers = [...CollectableKeys.all, "offers"];
	static offersCount = [...CollectableKeys.all, "offersCount"];
	static listings = [...CollectableKeys.all, "listings"];
	static listingsCount = [...CollectableKeys.all, "listingsCount"];
	static listPrimarySaleItems = ["listPrimarySaleItems"];
	static primarySaleItem = ["primarySaleItem"];
	static primarySaleItemsCount = ["primarySaleItemsCount"];
	static filter = [...CollectableKeys.all, "filter"];
	static counts = [...CollectableKeys.all, "counts"];
	static collectibleActivities = [...CollectableKeys.all, "collectibleActivities"];
};
var CollectionKeys = class CollectionKeys {
	static all = ["collections"];
	static list = [...CollectionKeys.all, "list"];
	static detail = [...CollectionKeys.all, "detail"];
	static collectionActivities = [...CollectionKeys.all, "collectionActivities"];
	static collectionItemsOrders = [...CollectionKeys.all, "collectionItemsOrders"];
	static collectionItemsOrdersCount = [...CollectionKeys.all, "collectionItemsOrdersCount"];
	static getCountOfFilteredOrders = [...CollectionKeys.all, "getCountOfFilteredOrders"];
	static activeListingsCurrencies = [...CollectionKeys.all, "activeListingsCurrencies"];
	static activeOffersCurrencies = [...CollectionKeys.all, "activeOffersCurrencies"];
};
var BalanceQueries = class BalanceQueries {
	static all = ["balances"];
	static lists = [...BalanceQueries.all, "tokenBalances"];
	static collectionBalanceDetails = [...BalanceQueries.all, "collectionBalanceDetails"];
	static inventory = ["inventory"];
};
var CheckoutKeys = class CheckoutKeys {
	static all = ["checkouts"];
	static options = [...CheckoutKeys.all, "options"];
	static cartItems = [...CheckoutKeys.all, "cartItems"];
};
var CurrencyKeys = class CurrencyKeys {
	static all = ["currencies"];
	static lists = [...CurrencyKeys.all, "list"];
	static details = [...CurrencyKeys.all, "details"];
	static conversion = [...CurrencyKeys.all, "conversion"];
};
var ConfigKeys = class ConfigKeys {
	static all = ["configs"];
	static marketplace = [...ConfigKeys.all, "marketplace"];
};
var TokenKeys = class TokenKeys {
	static all = ["tokens"];
	static metadata = [...TokenKeys.all, "metadata"];
	static supplies = [...TokenKeys.all, "supplies"];
	static ranges = [...TokenKeys.all, "ranges"];
};
var TokenSuppliesKeys = class TokenSuppliesKeys {
	static all = ["tokenSupplies"];
	static maps = [...TokenSuppliesKeys.all, "map"];
};
const collectableKeys = CollectableKeys;
const collectionKeys = CollectionKeys;
const balanceQueries = BalanceQueries;
const checkoutKeys = CheckoutKeys;
const currencyKeys = CurrencyKeys;
const configKeys = ConfigKeys;
const tokenKeys = TokenKeys;
const tokenSuppliesKeys = TokenSuppliesKeys;

//#endregion
//#region src/react/_internal/api/services.ts
const SERVICES = {
	sequenceApi: "https://${prefix}api.sequence.app",
	metadata: "https://${prefix}metadata.sequence.app",
	indexer: "https://${prefix}${network}-indexer.sequence.app",
	marketplaceApi: "https://${prefix}marketplace-api.sequence.app",
	builderRpcApi: "https://${prefix}api.sequence.build"
};
const metadataURL = (env = "production") => {
	const prefix = getPrefix(env);
	return stringTemplate(SERVICES.metadata, { prefix });
};
const indexerURL = (chain, env = "production") => {
	const prefix = getPrefix(env);
	const network = getNetwork(chain).name;
	return stringTemplate(SERVICES.indexer, {
		network,
		prefix
	});
};
const marketplaceApiURL = (env = "production") => {
	const prefix = getPrefix(env);
	return stringTemplate(SERVICES.marketplaceApi, { prefix });
};
const builderRpcApiURL = (env = "production") => {
	const prefix = getPrefix(env);
	return stringTemplate(SERVICES.builderRpcApi, { prefix });
};
const sequenceApiUrl = (env = "production") => {
	const prefix = getPrefix(env);
	return stringTemplate(SERVICES.sequenceApi, { prefix });
};
const getBuilderClient = (config) => {
	const overrides = config._internal?.overrides?.api?.builder;
	return new BuilderAPI(overrides?.url || builderRpcApiURL(overrides?.env || "production"), overrides?.accessKey || config.projectAccessKey);
};
const getMetadataClient = (config) => {
	const overrides = config._internal?.overrides?.api?.metadata;
	return new SequenceMetadata(overrides?.url || metadataURL(overrides?.env || "production"), overrides?.accessKey || config.projectAccessKey);
};
const getIndexerClient = (chain, config) => {
	const overrides = config._internal?.overrides?.api?.indexer;
	return new SequenceIndexer(overrides?.url || indexerURL(chain, overrides?.env || "production"), overrides?.accessKey || config.projectAccessKey);
};
const getMarketplaceClient = (config) => {
	const overrides = config._internal?.overrides?.api?.marketplace;
	return new SequenceMarketplace(overrides?.url || marketplaceApiURL(overrides?.env || "production"), overrides?.accessKey || config.projectAccessKey);
};
const getSequenceApiClient = (config) => {
	const overrides = config._internal?.overrides?.api?.sequenceApi;
	return new SequenceAPIClient(overrides?.url || sequenceApiUrl(overrides?.env || "production"), overrides?.accessKey || config.projectAccessKey);
};
const getPrefix = (env) => {
	switch (env) {
		case "development": return "dev-";
		case "production": return "";
		case "next": return "next-";
	}
};

//#endregion
export { getQueryClient as _, getSequenceApiClient as a, balanceQueries as c, collectionKeys as d, configKeys as f, SequenceMarketplace as g, tokenSuppliesKeys as h, getMetadataClient as i, checkoutKeys as l, tokenKeys as m, getIndexerClient as n, marketplaceApiURL as o, currencyKeys as p, getMarketplaceClient as r, sequenceApiUrl as s, getBuilderClient as t, collectableKeys as u };
//# sourceMappingURL=api.js.map