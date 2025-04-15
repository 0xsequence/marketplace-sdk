import { TEST_COLLECTIBLE, TEST_CURRENCY } from '@test/const';
import { render, screen } from '@test/test-utils';
import { describe, expect, it, vi } from 'vitest';
import {
	type CollectibleOrder,
	ContractType,
	OrderSide,
	OrderbookKind,
} from '../../../../_internal';
import { mockTokenMetadata } from '../../../../_internal/api/__mocks__/indexer.msw';
import { mockOrder } from '../../../../_internal/api/__mocks__/marketplace.msw';
import * as hooks from '../../../../hooks';
import { CollectibleCard } from '../CollectibleCard';

const defaultProps = {
	collectibleId: '1',
	chainId: 1,
	collectionAddress: TEST_COLLECTIBLE.collectionAddress,
	collectible: {
		order: mockOrder,
		listing: { ...mockOrder, side: OrderSide.listing },
		offer: { ...mockOrder, side: OrderSide.offer },
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
	} as CollectibleOrder,
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
		const useCurrencySpy = vi.spyOn(hooks, 'useCurrency');
		useCurrencySpy.mockReturnValue({
			data: TEST_CURRENCY,
		} as ReturnType<typeof hooks.useCurrency>);

		render(<CollectibleCard {...defaultProps} />);

		expect(screen.getByText('Mock NFT')).toBeInTheDocument();
		expect(screen.getByText('1 TEST')).toBeInTheDocument();
		// there is an offer
		expect(screen.getByTitle('Notification Bell')).toBeInTheDocument();
		expect(screen.getByRole('img', { name: 'Mock NFT' })).toHaveAttribute(
			'src',
			defaultProps.assetSrcPrefixUrl + defaultProps.collectible.metadata.image,
		);
	});
});
