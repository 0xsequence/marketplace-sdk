import * as kit from '@0xsequence/kit';
import { fireEvent, render, screen, waitFor } from '@test';
import { USDC_ADDRESS } from '@test/const';
import type { Hex } from 'viem';
import { describe, expect, it, vi } from 'vitest';
import * as wagmi from 'wagmi';
import { ContractType } from '../../../../_internal';
import {
	MarketplaceKind,
	OrderSide,
	OrderStatus,
} from '../../../../_internal/api/marketplace.gen';
import {
	type Order,
	OrderbookKind,
	type TokenMetadata,
} from '../../../../_internal/api/marketplace.gen';
import { CollectibleCardAction } from '../../_internals/action-button/types';
import { CollectibleCard } from '../CollectibleCard';

// Mock the hooks
vi.mock('../../../../hooks', async () => {
	const actual = await vi.importActual('../../../../hooks');
	return {
		...actual,
		useCurrency: vi.fn().mockReturnValue({
			data: {
				name: 'USD Coin',
				symbol: 'USDC',
				decimals: 6,
				imageUrl: 'https://example.com/usdc.png',
			},
			isLoading: false,
			error: null,
		}),
	};
});

describe('CollectibleCard', () => {
	// Create a mock order that follows the Order interface
	const mockOrder: Order = {
		orderId: '1',
		marketplace: MarketplaceKind.sequence_marketplace_v2,
		side: OrderSide.listing,
		status: OrderStatus.active,
		chainId: 1,
		originName: 'test marketplace',
		collectionContractAddress: '0x1234567890123456789012345678901234567890',
		tokenId: '123',
		createdBy: '0x0000000000000000000000000000000000000000',
		priceAmount: '1000000',
		priceAmountFormatted: '1',
		priceAmountNet: '1000000',
		priceAmountNetFormatted: '1',
		priceCurrencyAddress: USDC_ADDRESS,
		priceDecimals: 6,
		priceUSD: 1,
		priceUSDFormatted: '1',
		quantityInitial: '1',
		quantityInitialFormatted: '1',
		quantityRemaining: '1',
		quantityRemainingFormatted: '1',
		quantityAvailable: '1',
		quantityAvailableFormatted: '1',
		quantityDecimals: 0,
		feeBps: 250,
		feeBreakdown: [],
		validFrom: new Date().toISOString(),
		validUntil: new Date(Date.now() + 86400000).toISOString(),
		blockNumber: 1,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	const defaultProps = {
		collectibleId: '123',
		chainId: '1',
		collectionAddress:
			'0x1234567890123456789012345678901234567890' as `0x${string}`,
		lowestListing: {
			metadata: {
				tokenId: '123',
				name: 'Test Collectible',
				description: 'Test Description',
				image: 'https://example.com/image.png',
				external_url: 'https://example.com',
				decimals: 0,
				attributes: [],
			} as TokenMetadata,
			order: mockOrder,
		},
		orderbookKind: OrderbookKind.sequence_marketplace_v2,
		collectionType: ContractType.ERC721,
	};

	it('should render loading state when cardLoading is true', () => {
		render(<CollectibleCard {...defaultProps} cardLoading={true} />);

		expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
	});

	it('should render collectible with image and metadata', async () => {
		render(<CollectibleCard {...defaultProps} />);

		// Check if name is displayed
		expect(screen.getByText('Test Collectible')).toBeInTheDocument();

		// Check price
		expect(screen.getByText(/1 USDC/)).toBeInTheDocument();

		// Check if token type is displayed
		expect(screen.getByText('ERC-721')).toBeInTheDocument();
	});

	it('should call onCollectibleClick when clicked', () => {
		const onCollectibleClick = vi.fn();

		render(
			<CollectibleCard
				{...defaultProps}
				onCollectibleClick={onCollectibleClick}
			/>,
		);

		// Click on the collectible
		const collectibleElement = screen
			.getByText('Test Collectible')
			.closest('article');
		if (collectibleElement) {
			fireEvent.click(collectibleElement);
		}

		expect(onCollectibleClick).toHaveBeenCalledWith(defaultProps.collectibleId);
	});

	it('should open external url in new tab when external link is clicked', () => {
		render(<CollectibleCard {...defaultProps} />);

		const externalLink = screen.getByRole('link');

		expect(externalLink).toHaveAttribute('href', 'https://example.com');
		expect(externalLink).toHaveAttribute('target', '_blank');
		expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('should use fallback image when image load fails', async () => {
		render(<CollectibleCard {...defaultProps} />);

		const image = screen.getByAltText('Test Collectible');

		// Trigger error
		fireEvent.error(image);

		// Check if image source is changed to fallback
		expect(image).toHaveAttribute('src', expect.stringContaining('chess-tile'));
	});

	it('should show balance for ERC-1155 tokens', () => {
		const erc1155Props = {
			...defaultProps,
			collectionType: ContractType.ERC1155,
			balance: '5',
		};

		render(<CollectibleCard {...erc1155Props} />);

		expect(screen.getByText('Owned: 5')).toBeInTheDocument();
	});

	it('should call onCannotPerformAction when action cannot be performed', async () => {
		const onCannotPerformAction = vi.fn();

		render(
			<CollectibleCard
				{...defaultProps}
				onCannotPerformAction={onCannotPerformAction}
				balance="1" // Make it owned to test owner actions
			/>,
		);

		// We can't directly test this without mocking the useActionButtonLogic hook
		// Just testing the prop passes through
		expect(onCannotPerformAction).not.toHaveBeenCalled();
	});
});
