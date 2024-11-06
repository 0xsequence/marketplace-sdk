import { Marketplace } from './marketplace.gen';

export class SequenceMarketplace extends Marketplace {
	constructor(
		hostname: string,
		public projectAccessKey: string,
		public jwtAuth?: string,
	) {
		super(hostname.endsWith('/') ? hostname.slice(0, -1) : hostname, fetch);
		this.fetch = this._fetch;
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

		init!.headers = { ...init!.headers, ...headers };

		return fetch(input, init);
	};
}
