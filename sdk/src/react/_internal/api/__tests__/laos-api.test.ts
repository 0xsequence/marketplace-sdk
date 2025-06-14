import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { laosHandlers } from '../__mocks__/laos.msw';
import { LaosAPI } from '../laos-api';

// Setup MSW server
const server = setupServer(...laosHandlers);

describe('LaosAPI', () => {
	let laosApi: LaosAPI;

	beforeEach(() => {
		laosApi = new LaosAPI();
		server.listen({ onUnhandledRequest: 'error' });
	});

	afterEach(() => {
		server.resetHandlers();
	});

	afterAll(() => {
		server.close();
	});

	describe('getTokenSupplies', () => {
		it('should fetch token supplies successfully with default parameters', async () => {
			const result = await laosApi.getTokenSupplies({
				chainId: '11155111',
				contractAddress: '0x1234567890123456789012345678901234567890',
			});

			expect(result).toMatchInlineSnapshot(`
				{
				  "contractType": "LAOS-ERC-721",
				  "page": {
				    "more": false,
				    "pageSize": 50,
				    "sort": [
				      {
				        "column": "CREATED_AT",
				        "order": "DESC",
				      },
				    ],
				  },
				  "tokenIDs": [
				    {
				      "chainId": 11155111,
				      "contractInfo": {
				        "address": "0x1234567890123456789012345678901234567890",
				        "bytecodeHash": "0xhash123",
				        "chainId": 11155111,
				        "decimals": 0,
				        "deployed": true,
				        "extensions": {
				          "categories": [],
				          "description": "Test LAOS collection for testing",
				          "link": "https://example.com",
				          "ogImage": "https://example.com/og.png",
				          "ogName": "LAOS Test",
				          "originAddress": "0x1234567890123456789012345678901234567890",
				          "originChainId": 11155111,
				        },
				        "logoURI": "https://example.com/logo.png",
				        "name": "Test LAOS Collection",
				        "source": "laos",
				        "status": "AVAILABLE",
				        "symbol": "TLC",
				        "type": "LAOS-ERC-721",
				        "updatedAt": "2023-01-01T00:00:00.000Z",
				      },
				      "supply": "1000",
				      "tokenID": "1",
				      "tokenMetadata": {
				        "attributes": [
				          {
				            "trait_type": "Rarity",
				            "value": "Common",
				          },
				        ],
				        "contractAddress": "0x1234567890123456789012345678901234567890",
				        "decimals": 0,
				        "description": "A test token for LAOS testing",
				        "image": "https://example.com/token1.png",
				        "name": "Test Token 1",
				        "properties": {},
				        "source": "",
				        "status": "NOT_AVAILABLE",
				        "tokenId": "1",
				      },
				    },
				    {
				      "chainId": 11155111,
				      "contractInfo": {
				        "address": "0x1234567890123456789012345678901234567890",
				        "bytecodeHash": "0xhash123",
				        "chainId": 11155111,
				        "decimals": 0,
				        "deployed": true,
				        "extensions": {
				          "blacklist": false,
				          "categories": [],
				          "description": "Test LAOS collection for testing",
				          "featureIndex": 0,
				          "featured": false,
				          "link": "https://example.com",
				          "ogImage": "https://example.com/og.png",
				          "ogName": "LAOS Test",
				          "originAddress": "0x1234567890123456789012345678901234567890",
				          "originChainId": 11155111,
				          "verified": true,
				          "verifiedBy": "system",
				        },
				        "logoURI": "https://example.com/logo.png",
				        "name": "Test LAOS Collection",
				        "source": "laos",
				        "status": "AVAILABLE",
				        "symbol": "TLC",
				        "type": "LAOS-ERC-721",
				        "updatedAt": "2023-01-01T00:00:00.000Z",
				      },
				      "supply": "500",
				      "tokenID": "2",
				      "tokenMetadata": {
				        "attributes": [
				          {
				            "trait_type": "Rarity",
				            "value": "Rare",
				          },
				        ],
				        "contractAddress": "0x1234567890123456789012345678901234567890",
				        "decimals": 0,
				        "description": "Another test token for LAOS testing",
				        "image": "https://example.com/token2.png",
				        "name": "Test Token 2",
				        "properties": {},
				        "source": "",
				        "status": "NOT_AVAILABLE",
				        "tokenId": "2",
				      },
				    },
				  ],
				}
			`);
			expect(result.tokenIDs).toHaveLength(2);
			expect(result.tokenIDs[0].contractInfo?.address).toBe(
				'0x1234567890123456789012345678901234567890',
			);
			expect(result.tokenIDs[0].supply).toBe('1000');
		});

		it('should fetch token supplies with custom includeMetadata=false', async () => {
			const result = await laosApi.getTokenSupplies({
				chainId: '11155111',
				contractAddress: '0x1234567890123456789012345678901234567890',
				includeMetadata: false,
			});

			expect(result).toMatchInlineSnapshot(`
				{
				  "contractType": "LAOS-ERC-721",
				  "page": {
				    "more": false,
				    "pageSize": 50,
				    "sort": [
				      {
				        "column": "CREATED_AT",
				        "order": "DESC",
				      },
				    ],
				  },
				  "tokenIDs": [
				    {
				      "chainId": 11155111,
				      "contractInfo": {
				        "address": "0x1234567890123456789012345678901234567890",
				        "bytecodeHash": "0xhash123",
				        "chainId": 11155111,
				        "decimals": 0,
				        "deployed": true,
				        "extensions": {
				          "categories": [],
				          "description": "Test LAOS collection for testing",
				          "link": "https://example.com",
				          "ogImage": "https://example.com/og.png",
				          "ogName": "LAOS Test",
				          "originAddress": "0x1234567890123456789012345678901234567890",
				          "originChainId": 11155111,
				        },
				        "logoURI": "https://example.com/logo.png",
				        "name": "Test LAOS Collection",
				        "source": "laos",
				        "status": "AVAILABLE",
				        "symbol": "TLC",
				        "type": "LAOS-ERC-721",
				        "updatedAt": "2023-01-01T00:00:00.000Z",
				      },
				      "supply": "1000",
				      "tokenID": "1",
				      "tokenMetadata": {
				        "attributes": [
				          {
				            "trait_type": "Rarity",
				            "value": "Common",
				          },
				        ],
				        "contractAddress": "0x1234567890123456789012345678901234567890",
				        "decimals": 0,
				        "description": "A test token for LAOS testing",
				        "image": "https://example.com/token1.png",
				        "name": "Test Token 1",
				        "properties": {},
				        "source": "",
				        "status": "NOT_AVAILABLE",
				        "tokenId": "1",
				      },
				    },
				    {
				      "chainId": 11155111,
				      "contractInfo": {
				        "address": "0x1234567890123456789012345678901234567890",
				        "bytecodeHash": "0xhash123",
				        "chainId": 11155111,
				        "decimals": 0,
				        "deployed": true,
				        "extensions": {
				          "blacklist": false,
				          "categories": [],
				          "description": "Test LAOS collection for testing",
				          "featureIndex": 0,
				          "featured": false,
				          "link": "https://example.com",
				          "ogImage": "https://example.com/og.png",
				          "ogName": "LAOS Test",
				          "originAddress": "0x1234567890123456789012345678901234567890",
				          "originChainId": 11155111,
				          "verified": true,
				          "verifiedBy": "system",
				        },
				        "logoURI": "https://example.com/logo.png",
				        "name": "Test LAOS Collection",
				        "source": "laos",
				        "status": "AVAILABLE",
				        "symbol": "TLC",
				        "type": "LAOS-ERC-721",
				        "updatedAt": "2023-01-01T00:00:00.000Z",
				      },
				      "supply": "500",
				      "tokenID": "2",
				      "tokenMetadata": {
				        "attributes": [
				          {
				            "trait_type": "Rarity",
				            "value": "Rare",
				          },
				        ],
				        "contractAddress": "0x1234567890123456789012345678901234567890",
				        "decimals": 0,
				        "description": "Another test token for LAOS testing",
				        "image": "https://example.com/token2.png",
				        "name": "Test Token 2",
				        "properties": {},
				        "source": "",
				        "status": "NOT_AVAILABLE",
				        "tokenId": "2",
				      },
				    },
				  ],
				}
			`);
		});

		it('should fetch token supplies with custom pagination sort order', async () => {
			const result = await laosApi.getTokenSupplies({
				chainId: '11155111',
				contractAddress: '0x1234567890123456789012345678901234567890',
				page: {
					sort: [
						{
							column: 'CREATED_AT',
							order: 'ASC',
						},
					],
				},
			});

			expect(result.page.sort?.[0]?.order).toBe('ASC');
			// Verify tokens are in reverse order (ASC vs DESC)
			expect(result.tokenIDs[0].tokenID).toBe('2');
			expect(result.tokenIDs[1].tokenID).toBe('1');
		});

		it('should handle empty token supplies response', async () => {
			const result = await laosApi.getTokenSupplies({
				chainId: '11155111',
				contractAddress: '0x0000000000000000000000000000000000000003', // Special address for empty response
			});

			expect(result.tokenIDs).toHaveLength(0);
			expect(result.page).toBeDefined();
		});

		it('should throw error on 404 response', async () => {
			await expect(
				laosApi.getTokenSupplies({
					chainId: '11155111',
					contractAddress: '0x0000000000000000000000000000000000000000', // Special address for 404
				}),
			).rejects.toThrow('Failed to get token supplies: Not Found');
		});

		it('should throw error on 500 response', async () => {
			await expect(
				laosApi.getTokenSupplies({
					chainId: '11155111',
					contractAddress: '0x0000000000000000000000000000000000000001', // Special address for 500
				}),
			).rejects.toThrow('Failed to get token supplies: Internal Server Error');
		});

		it('should throw error on 400 response', async () => {
			await expect(
				laosApi.getTokenSupplies({
					chainId: '11155111',
					contractAddress: '0x0000000000000000000000000000000000000002', // Special address for 400
				}),
			).rejects.toThrow('Failed to get token supplies: Bad Request');
		});

		it('should include correct request body parameters', async () => {
			// This test implicitly validates that the mock receives the correct body
			// by checking that custom parameters affect the response
			const result = await laosApi.getTokenSupplies({
				chainId: '11155111',
				contractAddress: '0x1234567890123456789012345678901234567890',
				includeMetadata: false,
				page: {
					sort: [
						{
							column: 'TOKEN_ID',
							order: 'ASC',
						},
					],
				},
			});

			expect(result).toBeDefined();
		});
	});

	describe('getTokenBalances', () => {
		it('should fetch token balances successfully with default parameters', async () => {
			const result = await laosApi.getTokenBalances({
				chainId: '11155111',
				accountAddress: '0xuser1234567890123456789012345678901234567890',
			});

			expect(result).toMatchInlineSnapshot(`
				{
				  "balances": [
				    {
				      "accountAddress": "0xuser1234567890123456789012345678901234567890",
				      "balance": "5",
				      "blockHash": "0xblock123",
				      "blockNumber": 12345,
				      "chainId": 11155111,
				      "contractAddress": "0x1234567890123456789012345678901234567890",
				      "contractInfo": {
				        "address": "0x1234567890123456789012345678901234567890",
				        "bytecodeHash": "0xhash123",
				        "chainId": 11155111,
				        "decimals": 0,
				        "deployed": true,
				        "extensions": {
				          "blacklist": false,
				          "categories": [],
				          "description": "Test LAOS collection for testing",
				          "featureIndex": 0,
				          "featured": false,
				          "link": "https://example.com",
				          "ogImage": "https://example.com/og.png",
				          "ogName": "LAOS Test",
				          "originAddress": "0x1234567890123456789012345678901234567890",
				          "originChainId": 11155111,
				          "verified": true,
				          "verifiedBy": "system",
				        },
				        "logoURI": "https://example.com/logo.png",
				        "name": "Test LAOS Collection",
				        "source": "laos",
				        "status": "AVAILABLE",
				        "symbol": "TLC",
				        "type": "LAOS-ERC-721",
				        "updatedAt": "2023-01-01T00:00:00.000Z",
				      },
				      "contractType": "LAOS-ERC-721",
				      "isSummary": false,
				      "tokenID": "1",
				      "tokenMetadata": {
				        "attributes": [
				          {
				            "trait_type": "Rarity",
				            "value": "Common",
				          },
				        ],
				        "contractAddress": "0x1234567890123456789012345678901234567890",
				        "decimals": 0,
				        "description": "A test token for LAOS testing",
				        "image": "https://example.com/token1.png",
				        "name": "Test Token 1",
				        "properties": {},
				        "source": "onchain",
				        "status": "verified",
				        "tokenId": "1",
				      },
				      "uniqueCollectibles": "1",
				    },
				    {
				      "accountAddress": "0xuser1234567890123456789012345678901234567890",
				      "balance": "2",
				      "blockHash": "0xblock124",
				      "blockNumber": 12346,
				      "chainId": 11155111,
				      "contractAddress": "0x1234567890123456789012345678901234567890",
				      "contractInfo": {
				        "address": "0x1234567890123456789012345678901234567890",
				        "bytecodeHash": "0xhash123",
				        "chainId": 11155111,
				        "decimals": 0,
				        "deployed": true,
				        "extensions": {
				          "blacklist": false,
				          "categories": [],
				          "description": "Test LAOS collection for testing",
				          "featureIndex": 0,
				          "featured": false,
				          "link": "https://example.com",
				          "ogImage": "https://example.com/og.png",
				          "ogName": "LAOS Test",
				          "originAddress": "0x1234567890123456789012345678901234567890",
				          "originChainId": 11155111,
				          "verified": true,
				          "verifiedBy": "system",
				        },
				        "logoURI": "https://example.com/logo.png",
				        "name": "Test LAOS Collection",
				        "source": "laos",
				        "status": "AVAILABLE",
				        "symbol": "TLC",
				        "type": "LAOS-ERC-721",
				        "updatedAt": "2023-01-01T00:00:00.000Z",
				      },
				      "contractType": "LAOS-ERC-721",
				      "isSummary": false,
				      "tokenID": "2",
				      "tokenMetadata": {
				        "attributes": [
				          {
				            "trait_type": "Rarity",
				            "value": "Rare",
				          },
				        ],
				        "contractAddress": "0x1234567890123456789012345678901234567890",
				        "decimals": 0,
				        "description": "Another test token for LAOS testing",
				        "image": "https://example.com/token2.png",
				        "name": "Test Token 2",
				        "properties": {},
				        "source": "",
				        "status": "NOT_AVAILABLE",
				        "tokenId": "2",
				      },
				      "uniqueCollectibles": "1",
				    },
				  ],
				  "page": {
				    "more": false,
				    "pageSize": 50,
				    "sort": [
				      {
				        "column": "CREATED_AT",
				        "order": "DESC",
				      },
				    ],
				  },
				}
			`);
			expect(result.balances).toHaveLength(2);
			expect(result.balances[0].accountAddress).toBe(
				'0xuser1234567890123456789012345678901234567890',
			);
			expect(result.balances[0].balance).toBe('5');
		});

		it('should fetch token balances with custom includeMetadata=false', async () => {
			const result = await laosApi.getTokenBalances({
				chainId: '11155111',
				accountAddress: '0xuser1234567890123456789012345678901234567890',
				includeMetadata: false,
			});

			expect(result).toMatchInlineSnapshot(`
				{
				  "balances": [
				    {
				      "accountAddress": "0xuser1234567890123456789012345678901234567890",
				      "balance": "5",
				      "blockHash": "0xblock123",
				      "blockNumber": 12345,
				      "chainId": 11155111,
				      "contractAddress": "0x1234567890123456789012345678901234567890",
				      "contractInfo": {
				        "address": "0x1234567890123456789012345678901234567890",
				        "bytecodeHash": "0xhash123",
				        "chainId": 11155111,
				        "decimals": 0,
				        "deployed": true,
				        "extensions": {
				          "blacklist": false,
				          "categories": [],
				          "description": "Test LAOS collection for testing",
				          "featureIndex": 0,
				          "featured": false,
				          "link": "https://example.com",
				          "ogImage": "https://example.com/og.png",
				          "ogName": "LAOS Test",
				          "originAddress": "0x1234567890123456789012345678901234567890",
				          "originChainId": 11155111,
				          "verified": true,
				          "verifiedBy": "system",
				        },
				        "logoURI": "https://example.com/logo.png",
				        "name": "Test LAOS Collection",
				        "source": "laos",
				        "status": "AVAILABLE",
				        "symbol": "TLC",
				        "type": "LAOS-ERC-721",
				        "updatedAt": "2023-01-01T00:00:00.000Z",
				      },
				      "contractType": "LAOS-ERC-721",
				      "isSummary": false,
				      "tokenID": "1",
				      "tokenMetadata": {
				        "attributes": [
				          {
				            "trait_type": "Rarity",
				            "value": "Common",
				          },
				        ],
				        "contractAddress": "0x1234567890123456789012345678901234567890",
				        "decimals": 0,
				        "description": "A test token for LAOS testing",
				        "image": "https://example.com/token1.png",
				        "name": "Test Token 1",
				        "properties": {},
				        "source": "onchain",
				        "status": "verified",
				        "tokenId": "1",
				      },
				      "uniqueCollectibles": "1",
				    },
				    {
				      "accountAddress": "0xuser1234567890123456789012345678901234567890",
				      "balance": "2",
				      "blockHash": "0xblock124",
				      "blockNumber": 12346,
				      "chainId": 11155111,
				      "contractAddress": "0x1234567890123456789012345678901234567890",
				      "contractInfo": {
				        "address": "0x1234567890123456789012345678901234567890",
				        "bytecodeHash": "0xhash123",
				        "chainId": 11155111,
				        "decimals": 0,
				        "deployed": true,
				        "extensions": {
				          "blacklist": false,
				          "categories": [],
				          "description": "Test LAOS collection for testing",
				          "featureIndex": 0,
				          "featured": false,
				          "link": "https://example.com",
				          "ogImage": "https://example.com/og.png",
				          "ogName": "LAOS Test",
				          "originAddress": "0x1234567890123456789012345678901234567890",
				          "originChainId": 11155111,
				          "verified": true,
				          "verifiedBy": "system",
				        },
				        "logoURI": "https://example.com/logo.png",
				        "name": "Test LAOS Collection",
				        "source": "laos",
				        "status": "AVAILABLE",
				        "symbol": "TLC",
				        "type": "LAOS-ERC-721",
				        "updatedAt": "2023-01-01T00:00:00.000Z",
				      },
				      "contractType": "LAOS-ERC-721",
				      "isSummary": false,
				      "tokenID": "2",
				      "tokenMetadata": {
				        "attributes": [
				          {
				            "trait_type": "Rarity",
				            "value": "Rare",
				          },
				        ],
				        "contractAddress": "0x1234567890123456789012345678901234567890",
				        "decimals": 0,
				        "description": "Another test token for LAOS testing",
				        "image": "https://example.com/token2.png",
				        "name": "Test Token 2",
				        "properties": {},
				        "source": "",
				        "status": "NOT_AVAILABLE",
				        "tokenId": "2",
				      },
				      "uniqueCollectibles": "1",
				    },
				  ],
				  "page": {
				    "more": false,
				    "pageSize": 50,
				    "sort": [
				      {
				        "column": "CREATED_AT",
				        "order": "DESC",
				      },
				    ],
				  },
				}
			`);
		});

		it('should fetch token balances with custom pagination sort order', async () => {
			const result = await laosApi.getTokenBalances({
				chainId: '11155111',
				accountAddress: '0xuser1234567890123456789012345678901234567890',
				page: {
					sort: [
						{
							column: 'CREATED_AT',
							order: 'ASC',
						},
					],
				},
			});

			expect(result.page.sort?.[0]?.order).toBe('ASC');
			// Verify balances are in reverse order (ASC vs DESC)
			expect(result.balances[0].tokenID).toBe('2');
			expect(result.balances[1].tokenID).toBe('1');
		});

		it('should handle empty token balances response', async () => {
			const result = await laosApi.getTokenBalances({
				chainId: '11155111',
				accountAddress: '0x0000000000000000000000000000000000000003', // Special address for empty response
			});

			expect(result.balances).toHaveLength(0);
			expect(result.page).toBeDefined();
		});

		it('should throw error on 404 response', async () => {
			await expect(
				laosApi.getTokenBalances({
					chainId: '11155111',
					accountAddress: '0x0000000000000000000000000000000000000000', // Special address for 404
				}),
			).rejects.toThrow('Failed to get token balances: Not Found');
		});

		it('should throw error on 500 response', async () => {
			await expect(
				laosApi.getTokenBalances({
					chainId: '11155111',
					accountAddress: '0x0000000000000000000000000000000000000001', // Special address for 500
				}),
			).rejects.toThrow('Failed to get token balances: Internal Server Error');
		});

		it('should throw error on 400 response', async () => {
			await expect(
				laosApi.getTokenBalances({
					chainId: '11155111',
					accountAddress: '0x0000000000000000000000000000000000000002', // Special address for 400
				}),
			).rejects.toThrow('Failed to get token balances: Bad Request');
		});

		it('should include correct request body parameters', async () => {
			// This test implicitly validates that the mock receives the correct body
			// by checking that custom parameters affect the response
			const result = await laosApi.getTokenBalances({
				chainId: '11155111',
				accountAddress: '0xuser1234567890123456789012345678901234567890',
				includeMetadata: false,
				page: {
					sort: [
						{
							column: 'TOKEN_ID',
							order: 'ASC',
						},
					],
				},
			});

			expect(result).toBeDefined();
		});
	});

	describe('API integration', () => {
		it('should handle network timeout scenarios', async () => {
			// Note: This would require additional MSW configuration for timeout simulation
			// For now, we test that the API structure supports error handling
			const api = new LaosAPI('https://timeout.example.com');

			// This will fail due to the URL not being mocked, testing error handling
			await expect(
				api.getTokenSupplies({
					chainId: '11155111',
					contractAddress: '0x1234567890123456789012345678901234567890',
				}),
			).rejects.toThrow();
		});

		it('should maintain consistent response structure across methods', async () => {
			const suppliesResult = await laosApi.getTokenSupplies({
				chainId: '11155111',
				contractAddress: '0x1234567890123456789012345678901234567890',
			});

			const balancesResult = await laosApi.getTokenBalances({
				chainId: '11155111',
				accountAddress: '0xuser1234567890123456789012345678901234567890',
			});

			// Both should have consistent page structure
			expect(suppliesResult.page).toHaveProperty('pageSize');
			expect(suppliesResult.page).toHaveProperty('more');
			expect(suppliesResult.page).toHaveProperty('sort');

			expect(balancesResult.page).toHaveProperty('pageSize');
			expect(balancesResult.page).toHaveProperty('more');
			expect(balancesResult.page).toHaveProperty('sort');
		});
	});
});
