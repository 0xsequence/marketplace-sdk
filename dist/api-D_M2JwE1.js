import { t as BuilderAPI } from "./builder-api-BNmN_UEH.js";
import { p as Marketplace } from "./marketplace.gen-Cjbln5Lz.js";
import { t as getNetwork } from "./network-CbrL_hu0.js";
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
//#region src/react/_internal/api/laos-api.ts
var LaosAPI = class {
	baseUrl = "https://extensions.api.laosnetwork.io";
	constructor(baseUrl) {
		if (baseUrl) this.baseUrl = baseUrl;
	}
	async getTokenSupplies({ chainId, contractAddress, includeMetadata = true, page = { sort: [{
		column: "CREATED_AT",
		order: "DESC"
	}] } }) {
		const response = await fetch(`${this.baseUrl}/token/GetTokenSupplies`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				chainId,
				contractAddress,
				includeMetadata,
				page
			})
		});
		if (!response.ok) throw new Error(`Failed to get token supplies: ${response.statusText}`);
		return await response.json();
	}
	async getTokenBalances({ chainId, accountAddress, contractAddress, includeMetadata = true, page = { sort: [{
		column: "CREATED_AT",
		order: "DESC"
	}] } }) {
		const response = await fetch(`${this.baseUrl}/token/GetTokenBalances`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				chainId,
				accountAddress,
				contractAddress,
				includeMetadata,
				page
			})
		});
		if (!response.ok) throw new Error(`Failed to get token balances: ${response.statusText}`);
		return await response.json();
	}
};

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
	static filter = [...CollectableKeys.all, "filter"];
	static counts = [...CollectableKeys.all, "counts"];
	static collectibleActivities = [...CollectableKeys.all, "collectibleActivities"];
};
var CollectionKeys = class CollectionKeys {
	static all = ["collections"];
	static list = [...CollectionKeys.all, "list"];
	static detail = [...CollectionKeys.all, "detail"];
	static collectionActivities = [...CollectionKeys.all, "collectionActivities"];
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
export { getQueryClient as _, getSequenceApiClient as a, checkoutKeys as c, configKeys as d, currencyKeys as f, LaosAPI as g, SequenceMarketplace as h, getMetadataClient as i, collectableKeys as l, tokenSuppliesKeys as m, getIndexerClient as n, sequenceApiUrl as o, tokenKeys as p, getMarketplaceClient as r, balanceQueries as s, getBuilderClient as t, collectionKeys as u };
//# sourceMappingURL=api-D_M2JwE1.js.map