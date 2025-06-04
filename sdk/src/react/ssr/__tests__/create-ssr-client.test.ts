import { describe, expect, it } from 'vitest';
import type { SdkConfig } from '../../../types';
import { createSSRClient } from '../create-ssr-client';

const wagmiCookie =
	'wagmi.store={"state":{"connections":{"__type":"Map","value":[]},"chainId":1,"current":null},"version":2}; ';

const config = {
	projectId: 'test-project',
	projectAccessKey: 'test-key',
} satisfies SdkConfig;

const client = createSSRClient({
	cookie: wagmiCookie,
	config,
});

describe('createSSRClient', () => {
	it('should fetch marketplace config successfully', async () => {
		const marketplaceConfig = await client.getMarketplaceConfig();

		expect(marketplaceConfig).toMatchSnapshot();
	});

	it('should get initial state configuration', async () => {
		const state = await client.getInitialState();

		expect(state).toMatchInlineSnapshot(`
			{
			  "wagmi": {
			    "chainId": 1,
			    "connections": Map {},
			    "current": null,
			  },
			}
		`);
	});

	it('should preserve provided config in the client', () => {
		expect(client.config).toEqual(config);
	});
});
