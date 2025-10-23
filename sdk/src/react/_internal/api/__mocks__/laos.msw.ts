import type {
	GetTokenBalancesReturn,
	GetTokenSuppliesReturn,
} from '@0xsequence/indexer';
import { ResourceStatus } from '@0xsequence/metadata';
import { HttpResponse, http } from 'msw';

const mockTokenSuppliesResponse: GetTokenSuppliesReturn = {
	page: {
		pageSize: 50,
		more: false,
		sort: [
			{
				column: 'CREATED_AT',
				// biome-ignore lint/suspicious/noExplicitAny: Mock data requires any type for LAOS extensions
				order: 'DESC' as any,
			},
		],
	},
	// biome-ignore lint/suspicious/noExplicitAny: Mock data requires any type for LAOS extensions
	contractType: 'LAOS-ERC-721' as any,
	tokenIDs: [
		{
			tokenID: '1',
			supply: '1000',
			chainId: 11155111,
			contractInfo: {
				chainId: 11155111,
				address: '0x1234567890123456789012345678901234567890',
				name: 'Test LAOS Collection',
				// biome-ignore lint/suspicious/noExplicitAny: Mock data requires any type for LAOS extensions
				type: 'LAOS-ERC-721' as any,
				symbol: 'TLC',
				decimals: 0,
				logoURI: 'https://example.com/logo.png',
				deployed: true,
				bytecodeHash: '0xhash123',
				source: 'laos',
				updatedAt: '2023-01-01T00:00:00.000Z',
				status: ResourceStatus.AVAILABLE,
				// @ts-expect-error - LAOS extensions
				extensions: {
					link: 'https://example.com',
					description: 'Test LAOS collection for testing',
					ogImage: 'https://example.com/og.png',
					originChainId: 11155111,
					originAddress: '0x1234567890123456789012345678901234567890',
					categories: [],
					ogName: 'LAOS Test',
				},
			},

			tokenMetadata: {
				tokenId: '1',
				contractAddress: '0x1234567890123456789012345678901234567890',
				name: 'Test Token 1',
				description: 'A test token for LAOS testing',
				image: 'https://example.com/token1.png',
				decimals: 0,
				properties: {},
				attributes: [
					{
						trait_type: 'Rarity',
						value: 'Common',
					},
				],
				source: '',
				status: ResourceStatus.NOT_AVAILABLE,
			},
		},
		{
			tokenID: '2',
			supply: '500',
			chainId: 11155111,
			contractInfo: {
				chainId: 11155111,
				address: '0x1234567890123456789012345678901234567890',
				name: 'Test LAOS Collection',
				// biome-ignore lint/suspicious/noExplicitAny: Mock data requires any type for LAOS extensions
				type: 'LAOS-ERC-721' as any,
				symbol: 'TLC',
				decimals: 0,
				logoURI: 'https://example.com/logo.png',
				deployed: true,
				bytecodeHash: '0xhash123',
				source: 'laos',
				updatedAt: '2023-01-01T00:00:00.000Z',
				status: ResourceStatus.AVAILABLE,
				extensions: {
					link: 'https://example.com',
					description: 'Test LAOS collection for testing',
					ogImage: 'https://example.com/og.png',
					originChainId: 11155111,
					originAddress: '0x1234567890123456789012345678901234567890',
					categories: [],
					ogName: 'LAOS Test',
					blacklist: false,
					verified: true,
					verifiedBy: 'system',
					featured: false,
					featureIndex: 0,
				},
			},
			tokenMetadata: {
				tokenId: '2',
				contractAddress: '0x1234567890123456789012345678901234567890',
				name: 'Test Token 2',
				description: 'Another test token for LAOS testing',
				image: 'https://example.com/token2.png',
				decimals: 0,
				properties: {},
				attributes: [
					{
						trait_type: 'Rarity',
						value: 'Rare',
					},
				],
				source: '',
				status: ResourceStatus.NOT_AVAILABLE,
			},
		},
	],
};

const mockTokenBalancesResponse: GetTokenBalancesReturn = {
	page: {
		pageSize: 50,
		more: false,
		sort: [
			{
				column: 'CREATED_AT',
				// biome-ignore lint/suspicious/noExplicitAny: Mock data requires any type for LAOS extensions
				order: 'DESC' as any,
			},
		],
	},
	balances: [
		{
			// biome-ignore lint/suspicious/noExplicitAny: Mock data requires any type for LAOS extensions
			contractType: 'LAOS-ERC-721' as any,
			contractAddress: '0x1234567890123456789012345678901234567890',
			accountAddress: '0xuser1234567890123456789012345678901234567890',
			tokenID: '1',
			balance: '5',
			blockHash: '0xblock123',
			blockNumber: 12345,
			chainId: 11155111,
			uniqueCollectibles: '1',
			isSummary: false,
			contractInfo: {
				chainId: 11155111,
				address: '0x1234567890123456789012345678901234567890',
				name: 'Test LAOS Collection',
				// biome-ignore lint/suspicious/noExplicitAny: Mock data requires any type for LAOS extensions
				type: 'LAOS-ERC-721' as any,
				symbol: 'TLC',
				decimals: 0,
				logoURI: 'https://example.com/logo.png',
				deployed: true,
				bytecodeHash: '0xhash123',
				source: 'laos',
				updatedAt: '2023-01-01T00:00:00.000Z',
				status: ResourceStatus.AVAILABLE,
				extensions: {
					link: 'https://example.com',
					description: 'Test LAOS collection for testing',
					ogImage: 'https://example.com/og.png',
					originChainId: 11155111,
					originAddress: '0x1234567890123456789012345678901234567890',
					categories: [],
					ogName: 'LAOS Test',
					blacklist: false,
					verified: true,
					verifiedBy: 'system',
					featured: false,
					featureIndex: 0,
				},
			},
			tokenMetadata: {
				tokenId: '1',
				contractAddress: '0x1234567890123456789012345678901234567890',
				name: 'Test Token 1',
				description: 'A test token for LAOS testing',
				image: 'https://example.com/token1.png',
				decimals: 0,
				properties: {},
				source: 'onchain',
				// biome-ignore lint/suspicious/noExplicitAny: Mock data requires any type for LAOS extensions
				status: 'verified' as any,
				attributes: [
					{
						trait_type: 'Rarity',
						value: 'Common',
					},
				],
			},
		},
		{
			// biome-ignore lint/suspicious/noExplicitAny: Mock data requires any type for LAOS extensions
			contractType: 'LAOS-ERC-721' as any,
			contractAddress: '0x1234567890123456789012345678901234567890',
			accountAddress: '0xuser1234567890123456789012345678901234567890',
			tokenID: '2',
			balance: '2',
			blockHash: '0xblock124',
			blockNumber: 12346,
			chainId: 11155111,
			uniqueCollectibles: '1',
			isSummary: false,
			contractInfo: {
				chainId: 11155111,
				address: '0x1234567890123456789012345678901234567890',
				name: 'Test LAOS Collection',
				// biome-ignore lint/suspicious/noExplicitAny: Mock data requires any type for LAOS extensions
				type: 'LAOS-ERC-721' as any,
				symbol: 'TLC',
				decimals: 0,
				logoURI: 'https://example.com/logo.png',
				deployed: true,
				bytecodeHash: '0xhash123',
				source: 'laos',
				updatedAt: '2023-01-01T00:00:00.000Z',
				status: ResourceStatus.AVAILABLE,
				extensions: {
					link: 'https://example.com',
					description: 'Test LAOS collection for testing',
					ogImage: 'https://example.com/og.png',
					originChainId: 11155111,
					originAddress: '0x1234567890123456789012345678901234567890',
					categories: [],
					ogName: 'LAOS Test',
					blacklist: false,
					verified: true,
					verifiedBy: 'system',
					featured: false,
					featureIndex: 0,
				},
			},
			tokenMetadata: {
				tokenId: '2',
				contractAddress: '0x1234567890123456789012345678901234567890',
				name: 'Test Token 2',
				description: 'Another test token for LAOS testing',
				image: 'https://example.com/token2.png',
				decimals: 0,
				properties: {},
				attributes: [
					{
						trait_type: 'Rarity',
						value: 'Rare',
					},
				],
				source: '',
				status: ResourceStatus.NOT_AVAILABLE,
			},
		},
	],
};

export const laosHandlers = [
	// Mock GetTokenSupplies endpoint
	http.post(
		'https://extensions.api.laosnetwork.io/token/GetTokenSupplies',
		async ({ request }) => {
			// biome-ignore lint/suspicious/noExplicitAny: Mock data requires any type for LAOS extensions
			const body = (await request.json()) as Record<string, any>;

			// Handle error scenarios for testing
			if (
				body.contractAddress === '0x0000000000000000000000000000000000000000'
			) {
				return new HttpResponse(null, { status: 404 });
			}

			if (
				body.contractAddress === '0x0000000000000000000000000000000000000001'
			) {
				return new HttpResponse('Internal Server Error', { status: 500 });
			}

			if (
				body.contractAddress === '0x0000000000000000000000000000000000000002'
			) {
				return new HttpResponse('Bad Request', { status: 400 });
			}

			// Handle empty results for testing
			if (
				body.contractAddress === '0x0000000000000000000000000000000000000003'
			) {
				return HttpResponse.json({
					...mockTokenSuppliesResponse,
					tokenIDs: [],
				});
			}

			// Handle pagination testing
			if (body.page?.sort?.[0]?.order === 'ASC') {
				const reversedSupplies = [
					...mockTokenSuppliesResponse.tokenIDs,
				].reverse();
				return HttpResponse.json({
					...mockTokenSuppliesResponse,
					tokenIDs: reversedSupplies,
					page: {
						...mockTokenSuppliesResponse.page,
						sort: [
							{
								column: 'CREATED_AT',
								// biome-ignore lint/suspicious/noExplicitAny: Mock data requires any type for LAOS extensions
								order: 'ASC' as any,
							},
						],
					},
				});
			}

			// Default successful response
			return HttpResponse.json(mockTokenSuppliesResponse);
		},
	),

	// Mock GetTokenBalances endpoint
	http.post(
		'https://extensions.api.laosnetwork.io/token/GetTokenBalances',
		async ({ request }) => {
			// biome-ignore lint/suspicious/noExplicitAny: Mock data requires any type for LAOS extensions
			const body = (await request.json()) as Record<string, any>;

			// Handle error scenarios for testing
			if (
				body.accountAddress === '0x0000000000000000000000000000000000000000'
			) {
				return new HttpResponse(null, { status: 404 });
			}

			if (
				body.accountAddress === '0x0000000000000000000000000000000000000001'
			) {
				return new HttpResponse('Internal Server Error', { status: 500 });
			}

			if (
				body.accountAddress === '0x0000000000000000000000000000000000000002'
			) {
				return new HttpResponse('Bad Request', { status: 400 });
			}

			// Handle empty balances for testing
			if (
				body.accountAddress === '0x0000000000000000000000000000000000000003'
			) {
				return HttpResponse.json({
					...mockTokenBalancesResponse,
					balances: [],
				});
			}

			// Handle pagination testing
			if (body.page?.sort?.[0]?.order === 'ASC') {
				const reversedBalances = [
					...mockTokenBalancesResponse.balances,
				].reverse();
				return HttpResponse.json({
					...mockTokenBalancesResponse,
					balances: reversedBalances,
					page: {
						...mockTokenBalancesResponse.page,
						sort: [
							{
								column: 'CREATED_AT',
								// biome-ignore lint/suspicious/noExplicitAny: Mock data requires any type for LAOS extensions
								order: 'ASC' as any,
							},
						],
					},
				});
			}

			// Default successful response
			return HttpResponse.json(mockTokenBalancesResponse);
		},
	),
];

// Export mock data for use in tests
export { mockTokenSuppliesResponse, mockTokenBalancesResponse };
