import { a as builder_exports, w as MarketplaceService } from "./dist.js";

//#region src/react/_internal/api/builder-api.ts
/**
* BuilderAPI wraps the generated MarketplaceService to apply type transformations
* Transforms raw API responses to use bigint primitives and nested structures
*/
var BuilderAPI = class {
	client;
	constructor(hostname, projectAccessKey, jwtAuth) {
		this.projectAccessKey = projectAccessKey;
		this.jwtAuth = jwtAuth;
		this.client = new MarketplaceService(hostname.endsWith("/") ? hostname.slice(0, -1) : hostname, this._fetch);
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
	/**
	* Lookup marketplace configuration with transformed types
	* - Nests collections within market/shop pages
	* - Converts tokenIds to bigint[]
	*/
	async lookupMarketplace(args, headers, signal) {
		const result = await this.client.lookupMarketplace(args, headers, signal);
		return builder_exports.toLookupMarketplaceReturn(result);
	}
};

//#endregion
export { BuilderAPI as t };
//# sourceMappingURL=builder-api.js.map