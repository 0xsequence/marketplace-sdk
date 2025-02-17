import { type ContractInfo, ResourceStatus } from '@0xsequence/metadata';
import { http, HttpResponse } from 'msw';

export const mockContractInfo: ContractInfo = {
	address: '0x0000000000000000000000000000000000000000',
	chainId: 1,
	name: 'Mock Collection',
	symbol: 'MOCK',
	type: 'ERC721',
	status: ResourceStatus.AVAILABLE,
	notFound: false,
	deployed: true,
	queuedAt: '2021-01-01T00:00:00Z',
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
		categories: ['test'],
		blacklist: false,
		verifiedBy: '0x',
		featured: true,
	},
	source: '0x',
	logoURI: 'https://example.com/logo.png',
};

export const handlers = [
	http.post('*/rpc/Metadata/GetContractInfo', () => {
		return HttpResponse.json({
			contractInfo: mockContractInfo,
		});
	}),
];
