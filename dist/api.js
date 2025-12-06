import { t as BuilderAPI } from "./builder-api.js";
import { t as getNetwork } from "./network.js";
import { i as serializeBigInts } from "./utils2.js";
import { MarketplaceClient, SequenceIndexer, SequenceMetadata } from "@0xsequence/api-client";
import { stringTemplate } from "@0xsequence/network";
import { QueryClient, defaultShouldDehydrateQuery } from "@tanstack/react-query";
import { hashFn } from "wagmi/query";
import { SequenceAPIClient } from "@0xsequence/api";

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
var SequenceMarketplace = class extends MarketplaceClient {
	projectAccessKey;
	jwtAuth;
	constructor(hostname, projectAccessKey, jwtAuth) {
		const authenticatedFetch = (input, init) => {
			const headers = {};
			if (jwtAuth && jwtAuth.length > 0) headers.Authorization = `BEARER ${jwtAuth}`;
			if (projectAccessKey && projectAccessKey.length > 0) headers["X-Access-Key"] = projectAccessKey;
			const requestInit = init || {};
			requestInit.headers = {
				...init?.headers,
				...headers
			};
			return fetch(input, requestInit);
		};
		super(hostname.endsWith("/") ? hostname.slice(0, -1) : hostname, authenticatedFetch);
		this.projectAccessKey = projectAccessKey;
		this.jwtAuth = jwtAuth;
		const parentQueryKey = this.queryKey;
		this.queryKey = new Proxy(parentQueryKey, { get: (target, prop) => {
			const originalMethod = target[prop];
			if (typeof originalMethod === "function") return (req) => {
				const result = originalMethod(req);
				if (Array.isArray(result) && result.length === 3) return [
					result[0],
					result[1],
					serializeBigInts(result[2])
				];
				return result;
			};
			return originalMethod;
		} });
	}
};

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
export { getSequenceApiClient as a, SequenceMarketplace as c, getMetadataClient as i, getQueryClient as l, getIndexerClient as n, marketplaceApiURL as o, getMarketplaceClient as r, sequenceApiUrl as s, getBuilderClient as t };
//# sourceMappingURL=api.js.map