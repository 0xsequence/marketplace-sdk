import { Builder, MarketplaceService } from '@0xsequence/api-client';

/**
 * BuilderAPI wraps the generated MarketplaceService to apply type transformations
 * Transforms raw API responses to use bigint primitives and nested structures
 */
export class BuilderAPI {
	private client: MarketplaceService;

	constructor(
		hostname: string,
		public projectAccessKey?: string,
		public jwtAuth?: string,
	) {
		this.client = new MarketplaceService(
			hostname.endsWith('/') ? hostname.slice(0, -1) : hostname,
			this._fetch,
		);
	}

	_fetch = (input: RequestInfo, init?: RequestInit): Promise<Response> => {
		const headers: Record<string, string> = {};

		const jwtAuth = this.jwtAuth;
		const projectAccessKey = this.projectAccessKey;

		if (jwtAuth && jwtAuth.length > 0) {
			headers.Authorization = `BEARER ${jwtAuth}`;
		}

		if (projectAccessKey && projectAccessKey.length > 0) {
			headers['X-Access-Key'] = projectAccessKey;
		}

		const requestInit = init || {};
		requestInit.headers = { ...init?.headers, ...headers };

		return fetch(input, requestInit);
	};

	/**
	 * Lookup marketplace configuration with transformed types
	 * - Nests collections within market/shop pages
	 * - Converts tokenIds to bigint[]
	 */
	async lookupMarketplace(
		args: Builder.LookupMarketplaceArgs,
		headers?: object,
		signal?: AbortSignal,
	): Promise<Builder.LookupMarketplaceReturn> {
		const result = await this.client.lookupMarketplace(args, headers, signal);
		return Builder.toLookupMarketplaceReturn(result);
	}
}
