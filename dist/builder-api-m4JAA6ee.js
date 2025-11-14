import { MarketplaceService } from "./builder.gen--XD71cNL.js";

//#region src/react/_internal/api/builder-api.ts
var BuilderAPI = class extends MarketplaceService {
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
export { BuilderAPI as BuilderAPI$1 };
//# sourceMappingURL=builder-api-m4JAA6ee.js.map