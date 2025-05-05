import { TEST_COLLECTIBLE, TEST_CURRENCY } from '@test/const';
import { fireEvent, render, screen } from '@test/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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
import { ShopCollectibleCard } from '../cards';
import { CollectibleCardType } from '../types';

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
	cardType: CollectibleCardType.MARKETPLACE,
};

describe('CollectibleCard', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.restoreAllMocks();

		const useCurrencySpy = vi.spyOn(hooks, 'useCurrency');
		useCurrencySpy.mockReturnValue({
			data: TEST_CURRENCY,
		} as ReturnType<typeof hooks.useCurrency>);
	});

	it('Renders correctly with valid props and shows proper collectible details', () => {
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

	it('Handles loading state by showing skeleton component', () => {
		render(<CollectibleCard {...defaultProps} cardLoading={true} />);
		expect(screen.getByTestId('collectible-card-skeleton')).toBeInTheDocument();
	});

	it('Triggers appropriate callbacks when collectible or action buttons are clicked', () => {
		const onCollectibleClick = vi.fn();
		const onOfferClick = vi.fn();

		render(
			<CollectibleCard
				{...defaultProps}
				onCollectibleClick={onCollectibleClick}
				onOfferClick={onOfferClick}
			/>,
		);

		const notificationBell = screen.getByRole('button', {
			name: 'Notification Bell',
		});
		fireEvent.click(notificationBell);
		expect(onOfferClick).toHaveBeenCalled();

		const collectibleCard = screen.getByTestId('collectible-card');
		fireEvent.click(collectibleCard);
		expect(onCollectibleClick).toHaveBeenCalled();
	});

	it('Displays correct information when supply is 0 for store card type', () => {
		render(
			<ShopCollectibleCard
				{...defaultProps}
				supply={0}
				salesContractAddress="0x123"
			/>,
		);

		const nameElement = screen.getByText('Mock NFT');
		expect(nameElement).toHaveClass('text-text-50');

		expect(screen.getByText('Out of stock')).toBeInTheDocument();
	});
});
