// MSW mocks for metadata API
// These mocks use RAW types directly from @0xsequence/metadata

import type {
	ContractInfo,
	GetContractInfoBatchArgs,
	PropertyFilter,
	TokenMetadata,
} from '@0xsequence/metadata';
import { PropertyType, ResourceStatus } from '@0xsequence/metadata';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';

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

export const mockEthCollection: ContractInfo = {
	address: zeroAddress,
	chainId: 1,
	name: 'Mock Collection',
	symbol: 'MOCK',
	source: 'https://example.com/source',
	status: ResourceStatus.AVAILABLE,
	type: 'ERC721',
	deployed: true,
	updatedAt: new Date('2025-05-01T04:39:56.936Z').toISOString(),
	bytecodeHash: '0x1234567890',
	extensions: {
		description: 'A mock collection for testing',
		link: 'https://example.com',
		ogImage: 'https://example.com/image.png',
		ogName: 'Mock Collection',
		originAddress: '0x0000000000000000000000000000000000000000',
		originChainId: 1,
		verified: true,
		categories: ['Mock'],
		blacklist: false,
		verifiedBy: '0x',
		featured: true,
		featureIndex: 0,
	},
	logoURI: 'https://example.com/logo.png',
};

export const mockPolCollection: ContractInfo = {
	...mockEthCollection,
	address: '0x1234567890123456789012345678901234567890',
	chainId: 137,
};

export const mockCollections = [mockEthCollection, mockPolCollection];

export const mockTokenMetadata: TokenMetadata = {
	tokenId: '1',
	name: 'Mock NFT #1',
	description: 'A mock NFT for testing purposes',
	image: 'https://example.com/nft.png',
	video: 'https://example.com/nft.mp4',
	audio: 'https://example.com/nft.mp3',
	properties: {
		series: 'Mock Series',
		edition: 1,
	},
	attributes: [
		{ trait_type: 'Type', value: 'Mock' },
		{ trait_type: 'Rarity', value: 'Common' },
	],
	image_data: 'data:image/svg+xml;base64,...',
	external_url: 'https://example.com/nft/1',
	background_color: '#ffffff',
	animation_url: 'https://example.com/nft/1/animation',
	decimals: 0,
	updatedAt: new Date('2025-05-01T04:39:56.936Z').toISOString(),
	assets: [
		{
			id: 1,
			collectionId: 1,
			tokenId: '1',
			url: 'https://example.com/nft.png',
			metadataField: 'image',
			name: 'Main Image',
			filesize: 1024,
			mimeType: 'image/png',
			width: 1000,
			height: 1000,
			updatedAt: new Date('2025-05-01T04:39:56.936Z').toISOString(),
		},
	],
	source: '',
	status: ResourceStatus.NOT_AVAILABLE,
};

export const mockPropertyFilters: PropertyFilter[] = [
	{
		name: 'Type',
		type: PropertyType.STRING,
		values: ['Mock', 'Test', 'Sample'],
	},
	{
		name: 'Rarity',
		type: PropertyType.STRING,
		values: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
	},
];

// The transformed format that the hook returns when not using showAllFilters
export const mockFilters = [
	{
		id: 'type',
		name: 'Type',
		values: ['Mock', 'Test', 'Sample'],
	},
	{
		id: 'rarity',
		name: 'Rarity',
		values: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
	},
];

// Import transforms for normalized mocks
import * as transforms from '../adapters/metadata/transforms';
import type * as Normalized from '../adapters/metadata/types';

// Normalized mock data (with BigInt types) - for use in SDK tests
export const mockTokenMetadataNormalized: Normalized.TokenMetadata =
	transforms.toTokenMetadata(mockTokenMetadata);

export const mockEthCollectionNormalized: Normalized.ContractInfo =
	transforms.toContractInfo(mockEthCollection);

export const mockPolCollectionNormalized: Normalized.ContractInfo =
	transforms.toContractInfo(mockPolCollection);

type Endpoint =
	| 'GetContractInfo'
	| 'GetContractInfoBatch'
	| 'GetTokenMetadata'
	| 'GetTokenMetadataPropertyFilters'
	| 'SearchTokenMetadata';

export const mockMetadataEndpoint = (endpoint: Endpoint) =>
	`*/rpc/Metadata/${endpoint}`;

export const mockMetadataHandler = <T extends Record<string, unknown>>(
	endpoint: Endpoint,
	response: T,
) => {
	return http.post(mockMetadataEndpoint(endpoint), () => {
		debugLog(endpoint, {}, response);
		return HttpResponse.json(response);
	});
};

// MSW handlers
export const handlers = [
	mockMetadataHandler('GetContractInfo', {
		contractInfo: mockEthCollection,
	}),

	mockMetadataHandler('GetTokenMetadata', {
		tokenMetadata: [mockTokenMetadata],
	}),

	mockMetadataHandler('GetTokenMetadataPropertyFilters', {
		filters: mockPropertyFilters,
	}),

	mockMetadataHandler('SearchTokenMetadata', {
		tokenMetadata: [mockTokenMetadata],
		page: { page: 1, pageSize: 10, more: false },
	}),

	http.post(mockMetadataEndpoint('GetContractInfoBatch'), async (request) => {
		const body = (await request.request.json()) as GetContractInfoBatchArgs;
		const chainId = Number(body.chainID);
		const contractAddresses = body.contractAddresses;

		const response = {
			contractInfoMap: mockCollections.filter((collection) => {
				return (
					collection.chainId === chainId &&
					contractAddresses.includes(collection.address)
				);
			}),
		};

		debugLog('GetContractInfoBatch', request, response);
		return HttpResponse.json(response);
	}),
];
