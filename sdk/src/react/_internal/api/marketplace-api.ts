import { MarketplaceClient } from '@0xsequence/api-client';
import { serializeBigInts } from '../utils';

export class SequenceMarketplace extends MarketplaceClient {
	public projectAccessKey: string;
	public jwtAuth?: string;

	constructor(hostname: string, projectAccessKey: string, jwtAuth?: string) {
		// Create custom fetch function with auth headers
		const authenticatedFetch: typeof globalThis.fetch = (
			input: RequestInfo | URL,
			init?: RequestInit,
		): Promise<Response> => {
			const headers: Record<string, string> = {};

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

		super(
			hostname.endsWith('/') ? hostname.slice(0, -1) : hostname,
			authenticatedFetch,
		);

		this.projectAccessKey = projectAccessKey;
		this.jwtAuth = jwtAuth;

		// Wrap the parent's queryKey object to automatically serialize bigint values
		const parentQueryKey = this.queryKey;
		this.queryKey = new Proxy(parentQueryKey, {
			get: (target, prop: string) => {
				const originalMethod = target[prop as keyof typeof target];
				if (typeof originalMethod === 'function') {
					// biome-ignore lint/suspicious/noExplicitAny: Required for proxy wrapper to handle any query key method signature
					// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for proxy wrapper to handle any query key method signature
					return (req: any) => {
						const result = originalMethod(req);
						// Query keys from the RPC client are tuples like ["Marketplace", "methodName", params]
						// We need to serialize the params (3rd element)
						if (Array.isArray(result) && result.length === 3) {
							return [
								result[0],
								result[1],
								serializeBigInts(result[2]),
							] as const;
						}
						return result;
					};
				}
				return originalMethod;
			},
		});
	}
}
