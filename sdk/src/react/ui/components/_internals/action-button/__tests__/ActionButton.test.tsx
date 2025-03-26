import { fireEvent, render, screen } from '@test';
import type { Hex } from 'viem';
import { describe, expect, it, vi } from 'vitest';
import * as wagmi from 'wagmi';
import {
	MarketplaceKind,
	OrderSide,
	OrderStatus,
} from '../../../../../_internal/api/marketplace.gen';
import { ActionButton } from '../ActionButton';
import { CollectibleCardAction } from '../types';

describe.skip('ActionButton', () => {
	const defaultProps = {
		chainId: '1',
		collectionAddress: '0x123' as Hex,
		tokenId: '1',
		action: CollectibleCardAction.BUY,
		onCannotPerformAction: vi.fn(),
		lowestListing: {
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
			priceCurrencyAddress:
				'0x0000000000000000000000000000000000000000' as `0x${string}`,
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
	};

	it('renders buy action for non-owners', () => {
		// @ts-expect-error
		vi.mocked(wagmi.useAccount).mockReturnValue({ address: undefined });
		render(<ActionButton {...defaultProps} />);
		expect(screen.getByText('Buy now')).toBeInTheDocument();
	});

	it('renders list action for owners', () => {
		// @ts-expect-error
		vi.mocked(wagmi.useAccount).mockReturnValue({ address: '0x456' });
		render(
			<ActionButton {...defaultProps} action={CollectibleCardAction.LIST} />,
		);
		expect(screen.getByText('Create listing')).toBeInTheDocument();
	});

	it('calls onClick when clicked and user is connected', () => {
		// @ts-expect-error
		vi.mocked(wagmi.useAccount).mockReturnValue({ address: '0x456' });
		const onCannotPerformAction = vi.fn();
		render(
			<ActionButton
				{...defaultProps}
				onCannotPerformAction={onCannotPerformAction}
			/>,
		);
		fireEvent.click(screen.getByRole('button'));
		expect(onCannotPerformAction).not.toHaveBeenCalled();
	});

	it('calls onCannotPerformAction when user is not connected', () => {
		// @ts-expect-error
		vi.mocked(wagmi.useAccount).mockReturnValue({ address: undefined });
		const onCannotPerformAction = vi.fn();
		render(
			<ActionButton
				{...defaultProps}
				onCannotPerformAction={onCannotPerformAction}
			/>,
		);
		fireEvent.click(screen.getByRole('button'));
		expect(onCannotPerformAction).toHaveBeenCalledWith(
			CollectibleCardAction.BUY,
		);
	});

	it('shows loading state when loading', () => {
		render(<ActionButton {...defaultProps} />);
		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('data-loading', 'false');
	});
});
