import * as kit from '@0xsequence/kit';
import { fireEvent, render, screen } from '@test';
import type { Hex } from 'viem';
import { describe, expect, it, vi } from 'vitest';
import * as wagmi from 'wagmi';
import {
	MarketplaceKind,
	OrderSide,
	OrderStatus,
} from '../../../../_internal/api/marketplace.gen';
import { CollectibleCard } from '../CollectibleCard';

describe.skip('CollectibleCard', () => {
	const defaultProps = {
		collectibleId: '1',
		chainId: '1',
		collectionAddress: '0x123' as Hex,
		lowestListing: {
			metadata: {
				name: 'Test NFT',
				image: 'test-image.jpg',
				tokenId: '1',
				attributes: [],
			},
			order: {
				orderId: '1',
				marketplace: MarketplaceKind.sequence_marketplace_v2,
				side: OrderSide.listing,
				status: OrderStatus.active,
				chainId: 1,
				originName: 'test',
				collectionContractAddress: '0x123',
				tokenId: '1',
				createdBy: '0x456',
				priceAmount: '1000000000000000000',
				priceAmountFormatted: '1',
				priceAmountNet: '1000000000000000000',
				priceAmountNetFormatted: '1',
				priceCurrencyAddress: '0x456' as Hex,
				priceDecimals: 18,
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
			},
		},
	};

	it('renders loading skeleton when cardLoading is true', () => {
		render(<CollectibleCard {...defaultProps} cardLoading={true} />);
		expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
	});

	it('renders collectible image and name', () => {
		render(<CollectibleCard {...defaultProps} />);
		expect(screen.getByAltText('Test NFT')).toBeInTheDocument();
	});

	it('handles image loading error', () => {
		render(<CollectibleCard {...defaultProps} />);
		const image = screen.getByAltText('Test NFT');
		fireEvent.error(image);
		expect(image).toHaveAttribute('src', expect.stringContaining('chess-tile'));
	});

	it('calls onCollectibleClick when clicked', () => {
		const onCollectibleClick = vi.fn();
		render(
			<CollectibleCard
				{...defaultProps}
				onCollectibleClick={onCollectibleClick}
			/>,
		);
		fireEvent.click(screen.getByRole('article'));
		expect(onCollectibleClick).toHaveBeenCalledWith('1');
	});

	it('shows buy action for non-owners', () => {
		// @ts-expect-error
		vi.mocked(wagmi.useAccount).mockReturnValue({ address: '0x789' });
		render(<CollectibleCard {...defaultProps} />);
		expect(screen.getByText('Buy now')).toBeInTheDocument();
	});

	it('shows list action for owners', () => {
		// @ts-expect-error
		vi.mocked(wagmi.useAccount).mockReturnValue({ address: '0x123' });
		const propsWithoutListing = { ...defaultProps, lowestListing: undefined };
		render(<CollectibleCard {...propsWithoutListing} balance="1" />);
		expect(screen.getByText('Create listing')).toBeInTheDocument();
	});

	it('calls onCannotPerformAction when appropriate', () => {
		const onCannotPerformAction = vi.fn();
		const setOpenConnectModal = vi.fn();
		// @ts-expect-error
		vi.mocked(kit.useOpenConnectModal).mockReturnValue({
			setOpenConnectModal,
		});
		// @ts-expect-error
		vi.mocked(wagmi.useAccount).mockReturnValue({ address: undefined });

		render(
			<CollectibleCard
				{...defaultProps}
				onCannotPerformAction={onCannotPerformAction}
			/>,
		);

		const button = screen.getByRole('button', { name: /buy now/i });
		fireEvent.click(button);

		expect(setOpenConnectModal).toHaveBeenCalledWith(true);
	});
});
