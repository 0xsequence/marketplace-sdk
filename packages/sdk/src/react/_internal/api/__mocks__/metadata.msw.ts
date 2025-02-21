import {
	ResourceStatus,
	type ContractInfo,
	PropertyType,
} from '@0xsequence/metadata';
import { http, HttpResponse } from 'msw';
import type { TokenMetadata, PropertyFilter } from '../marketplace.gen';
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

// Mock data
export const mockContractInfo: ContractInfo = {
	address: zeroAddress,
	chainId: 1,
	name: 'Mock Collection',
	symbol: 'MOCK',
	source: 'https://example.com/source',
	notFound: false,
	status: ResourceStatus.AVAILABLE,
	type: 'ERC721',
	deployed: true,
	updatedAt: new Date().toISOString(),
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
	},
	logoURI: 'https://example.com/logo.png',
};

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
	updatedAt: new Date().toISOString(),
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
			updatedAt: new Date().toISOString(),
		},
	],
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

type Endpoint =
	| 'GetContractInfo'
	| 'GetTokenMetadata'
	| 'TokenCollectionFilters'
	| 'GetContractInfoBatch';

export const mockMetadataEndpoint = (endpoint: Endpoint) =>
	`*/rpc/Metadata/${endpoint}`;

// Add JsonValue type constraint to ensure response is JSON-serializable
export const mockMetadataHandler = <T extends Record<string, unknown>>(
	endpoint: Endpoint,
	response: T,
) => {
	return http.post(mockMetadataEndpoint(endpoint), (request) => {
		debugLog(endpoint, request, response);
		return HttpResponse.json(response);
	});
};

// MSW handlers
export const handlers = [
	mockMetadataHandler('GetContractInfo', {
		contractInfo: mockContractInfo,
	}),

	mockMetadataHandler('GetTokenMetadata', {
		tokenMetadata: [mockTokenMetadata],
	}),

	mockMetadataHandler('TokenCollectionFilters', {
		filters: mockPropertyFilters,
	}),

	mockMetadataHandler('GetContractInfoBatch', {
		contractInfoMap: {
			[mockContractInfo.address]: mockContractInfo,
		},
	}),
];
