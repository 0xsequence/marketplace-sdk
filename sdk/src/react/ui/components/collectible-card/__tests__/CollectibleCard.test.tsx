import { TEST_COLLECTIBLE } from '@test/const';
import { render, screen } from '@test/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { ContractType, OrderbookKind } from '../../../../_internal';
import { mockTokenMetadata } from '../../../../_internal/api/__mocks__/indexer.msw';
import { mockOrder } from '../../../../_internal/api/__mocks__/marketplace.msw';
import { CollectibleCard } from '../CollectibleCard';

const defaultProps = {
	collectibleId: '1',
	chainId: 1,
	collectionAddress: TEST_COLLECTIBLE.collectionAddress,
	collectible: {
		...mockOrder,
		metadata: {
			...mockTokenMetadata,
			tokenId: mockTokenMetadata.tokenId as string,
			assets: mockTokenMetadata.assets
				? mockTokenMetadata.assets.map((asset) => ({
						...asset,
						tokenId: asset.tokenId || '',
					}))
				: undefined,
		},
	},
	balance: '100',
	balanceIsLoading: false,
	cardLoading: false,
	onCannotPerformAction: vi.fn(),
	assetSrcPrefixUrl: 'https://example.com/',
	orderbookKind: OrderbookKind.sequence_marketplace_v2,
	collectionType: ContractType.ERC721,
};

describe('CollectibleCard', () => {
	it('Renders correctly with valid props and shows proper collectible details', () => {
		render(<CollectibleCard {...defaultProps} />);

		expect(screen.getByText('Mock NFT')).toBeInTheDocument();
		console.log(screen.debug());
	});
});
