import { TEST_COLLECTIBLE, TEST_CURRENCY } from '@test/const';
import { fireEvent, render, screen } from '@test/test-utils';
import type { Address } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CollectibleCard } from '..';
import type { MarketplaceType } from '../../../../../types';
import {
	type CollectibleOrder,
	ContractType,
	OrderSide,
	OrderbookKind,
	type TokenMetadata,
} from '../../../../_internal';
import { mockTokenMetadata } from '../../../../_internal/api/__mocks__/indexer.msw';
import { mockOrder } from '../../../../_internal/api/__mocks__/marketplace.msw';
import * as hooks from '../../../../hooks';
import { MarketplaceCollectibleCard } from '../MarketplaceCollectibleCard';

// Create a properly typed version of the mock token metadata
const typedTokenMetadata: TokenMetadata = {
	...mockTokenMetadata,
	tokenId: mockTokenMetadata.tokenId as string,
	assets: mockTokenMetadata.assets
		? mockTokenMetadata.assets.map((asset) => ({
				...asset,
				tokenId: asset.tokenId || '',
			}))
		: undefined,
};

const mockCollectibleOrder: CollectibleOrder = {
	order: mockOrder,
	listing: { ...mockOrder, side: OrderSide.listing },
	offer: { ...mockOrder, side: OrderSide.offer },
	metadata: typedTokenMetadata,
};

// Base props shared by all tests
const baseProps = {
	collectibleId: '1',
	chainId: 1,
	collectionAddress: TEST_COLLECTIBLE.collectionAddress,
	assetSrcPrefixUrl: 'https://example.com/',
	cardLoading: false,
};

// Market-specific props
const marketProps = {
	...baseProps,
	marketplaceType: 'market' as MarketplaceType,
	collectible: mockCollectibleOrder,
	balance: '100',
	balanceIsLoading: false,
	onCannotPerformAction: vi.fn(),
	orderbookKind: OrderbookKind.sequence_marketplace_v2,
	collectionType: ContractType.ERC721,
};

// Shop-specific props with explicitly typed MarketplaceType.SHOP
const shopProps = {
	...baseProps,
	marketplaceType: 'shop' as const,
	tokenMetadata: typedTokenMetadata,
	salesContractAddress: '0x123' as Address,
	salePrice: {
		amount: '100',
		currencyAddress: TEST_CURRENCY.contractAddress as Address,
	},
	quantityDecimals: 0,
	quantityInitial: '10',
	quantityRemaining: '10',
	saleStartsAt: '2021-01-01',
	saleEndsAt: '2021-01-02',
	collectionType: ContractType.ERC1155,
};

describe('MarketplaceCollectibleCard', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.restoreAllMocks();

		const useCurrencySpy = vi.spyOn(hooks, 'useCurrency');
		useCurrencySpy.mockReturnValue({
			data: TEST_CURRENCY,
		} as ReturnType<typeof hooks.useCurrency>);
	});

	describe('Common functionality', () => {
		it('Handles loading state by showing skeleton component', () => {
			render(
				<MarketplaceCollectibleCard {...marketProps} cardLoading={true} />,
			);
			expect(
				screen.getByTestId('collectible-card-skeleton'),
			).toBeInTheDocument();
		});
	});

	describe('MARKET type', () => {
		it('Renders correctly with market props and shows proper collectible details', () => {
			render(<MarketplaceCollectibleCard {...marketProps} />);

			expect(screen.getByText('Mock NFT')).toBeInTheDocument();
			expect(screen.getByText('1 TEST')).toBeInTheDocument();
			// Verify there is an offer
			expect(screen.getByTitle('Notification Bell')).toBeInTheDocument();
			expect(screen.getByRole('img', { name: 'Mock NFT' })).toHaveAttribute(
				'src',
				marketProps.assetSrcPrefixUrl + marketProps.collectible.metadata.image,
			);
		});

		it('Triggers appropriate callbacks when collectible or action buttons are clicked', () => {
			const onCollectibleClick = vi.fn();
			const onOfferClick = vi.fn();

			render(
				<MarketplaceCollectibleCard
					{...marketProps}
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
	});

	describe('SHOP type', () => {
		it('Renders shop card with correct details', () => {
			const typedShopProps = { ...shopProps };
			render(<CollectibleCard {...typedShopProps} />);

			// Verify name and price display correctly for shop type
			expect(screen.getByText('Mock NFT')).toBeInTheDocument();
			expect(screen.getByText('0.0001 TEST')).toBeInTheDocument();
			expect(screen.getByRole('img', { name: 'Mock NFT' })).toBeInTheDocument();
		});

		it('Handles shop card with no sale dates available', () => {
			const noSaleDatesProps = {
				...shopProps,
				saleStartsAt: undefined,
				saleEndsAt: undefined,
			};
			render(<CollectibleCard {...noSaleDatesProps} />);

			// For ERC1155 with quantity remaining, the image should not be dimmed
			const mediaContainer = screen
				.getByTestId('collectible-card')
				.querySelector('.bg-background-secondary');
			expect(mediaContainer).toHaveClass('opacity-100');
		});

		it('Handles shop card with no quantity remaining for ERC721', () => {
			const noQuantityProps = {
				...shopProps,
				collectionType: ContractType.ERC721,
				quantityRemaining: undefined,
			};
			render(<CollectibleCard {...noQuantityProps} />);

			// When quantity remaining is undefined for ERC721, the image should be dimmed
			const mediaContainer = screen
				.getByTestId('collectible-card')
				.querySelector('.bg-background-secondary');
			expect(mediaContainer).toHaveClass('opacity-50');
		});
	});
});
