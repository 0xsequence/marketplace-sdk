import { http, HttpResponse } from 'msw';
import {
	ContractType,
	TransactionStatus,
	TransactionType,
	OrderStatus,
	ResourceStatus,
} from '@0xsequence/indexer';
import type {
	TokenBalance,
	TokenMetadata,
	ContractInfo,
	TokenSupply,
	TransactionReceipt,
	OrderbookOrder,
} from '@0xsequence/indexer';

import { zeroAddress } from 'viem';

// Mock data
export const mockTokenMetadata: TokenMetadata = {
	tokenId: '1',
	name: 'Mock NFT',
	status: ResourceStatus.AVAILABLE,
	description: 'A mock NFT for testing',
	image: 'https://example.com/nft.png',
	properties: {
		series: 'Mock Series',
		edition: 1,
	},
	attributes: [
		{ trait_type: 'Type', value: 'Mock' },
		{ trait_type: 'Rarity', value: 'Common' },
	],
};

export const mockContractInfo: ContractInfo = {
	chainId: 1,
	address: zeroAddress,
	name: 'Mock Contract',
	type: ContractType.ERC721,
	symbol: 'MOCK',
	notFound: false,
	status: ResourceStatus.AVAILABLE,
	decimals: 18,
	logoURI: 'https://example.com/logo.png',
	deployed: true,
	bytecodeHash: '0x1234567890',
	extensions: {
		link: 'https://example.com',
		description: 'A mock contract for testing',
		ogImage: 'https://example.com/og.png',
		categories: ['Mock'],
		ogName: 'Mock Contract',
		originChainId: 1,
		originAddress: zeroAddress,
		blacklist: false,
		verified: true,
		verifiedBy: '0x',
		featured: true,
	},
	updatedAt: new Date().toISOString(),
};

export const mockTokenBalance: TokenBalance = {
	contractType: ContractType.ERC721,
	contractAddress: zeroAddress,
	accountAddress: '0x1234567890123456789012345678901234567890',
	tokenID: '1',
	balance: '1',
	blockHash:
		'0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
	blockNumber: 1234567,
	chainId: 1,
	uniqueCollectibles: '1',
	isSummary: false,
	contractInfo: mockContractInfo,
	tokenMetadata: mockTokenMetadata,
};

export const mockTokenSupply: TokenSupply = {
	tokenID: '1',
	supply: '100',
	chainId: 1,
	contractInfo: mockContractInfo,
	tokenMetadata: mockTokenMetadata,
};

export const mockTransactionReceipt: TransactionReceipt = {
	txnHash: '0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
	txnStatus: TransactionStatus.SUCCESSFUL,
	txnIndex: 0,
	txnType: TransactionType.LegacyTxnType,
	blockHash:
		'0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
	blockNumber: 1234567,
	gasUsed: 100000,
	effectiveGasPrice: '20000000000',
	from: '0x1234567890123456789012345678901234567890',
	to: '0x0987654321098765432109876543210987654321',
	logs: [],
	final: true,
	reorged: false,
};

export const mockOrderbookOrder: OrderbookOrder = {
	orderId: '0x9876543210987654321098765432109876543210',
	tokenContract: zeroAddress,
	tokenId: '1',
	isListing: true,
	quantity: '1',
	quantityRemaining: '1',
	currencyAddress: zeroAddress,
	pricePerToken: '1000000000000000000',
	expiry: new Date(Date.now() + 86400000).toISOString(),
	orderStatus: OrderStatus.OPEN,
	createdBy: '0x1234567890123456789012345678901234567890',
	blockNumber: 1234567,
	orderbookContractAddress: zeroAddress,
	createdAt: Date.now(),
};

// Debug configuration
export let isDebugEnabled = false;
export const enableDebug = () => {
	isDebugEnabled = true;
};
export const disableDebug = () => {
	isDebugEnabled = false;
};

// Debug logger function
const debugLog = (endpoint: string, request: unknown, response: unknown) => {
	if (isDebugEnabled) {
		console.log(`[MSW Debug] ${endpoint}:`, {
			request,
			response,
		});
	}
};

// Define available endpoints
const ENDPOINTS = [
	'GetTokenBalances',
	'GetTokenBalancesDetails',
	'GetTokenSupplies',
	'FetchTransactionReceipt',
	'GetOrderbookOrders',
	'GetTopOrders',
] as const;

type Endpoint = (typeof ENDPOINTS)[number];

export const mockIndexerEndpoint = (endpoint: Endpoint) =>
	`*/rpc/Indexer/${endpoint}`;

const mockIndexerHandler = <T extends Record<string, unknown>>(
	endpoint: Endpoint,
	response: T,
) => {
	return http.post(mockIndexerEndpoint(endpoint), (request) => {
		debugLog(endpoint, request, response);
		return HttpResponse.json(response);
	});
};

// MSW handlers
export const handlers = Object.values({
	GetTokenBalances: mockIndexerHandler('GetTokenBalances', {
		page: { page: 1, pageSize: 10, more: false },
		balances: [mockTokenBalance],
	}),

	GetTokenBalancesDetails: mockIndexerHandler('GetTokenBalancesDetails', {
		page: { page: 1, pageSize: 10, more: false },
		balances: [mockTokenBalance],
	}),

	GetTokenSupplies: mockIndexerHandler('GetTokenSupplies', {
		page: { page: 1, pageSize: 10, more: false },
		contractType: ContractType.ERC721,
		tokenIDs: [mockTokenSupply],
	}),

	FetchTransactionReceipt: mockIndexerHandler('FetchTransactionReceipt', {
		receipt: mockTransactionReceipt,
	}),

	GetOrderbookOrders: mockIndexerHandler('GetOrderbookOrders', {
		page: { page: 1, pageSize: 10, more: false },
		orders: [mockOrderbookOrder],
	}),

	GetTopOrders: mockIndexerHandler('GetTopOrders', {
		orders: [mockOrderbookOrder],
	}),
});
