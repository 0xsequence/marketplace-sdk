import { API } from './builder.gen';

export class BuilderAPI extends API {
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

		const requestInit = init || {};
		requestInit.headers = { ...init?.headers, ...headers };

		return fetch(input, requestInit);
	};
}
