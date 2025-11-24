'use client';

import { MarketplaceMocks, OrderSide } from '@0xsequence/api-client';
import { render, screen } from '@test';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockOrder } = MarketplaceMocks;

import { CollectibleCardAction } from '../../../../../../types';
import { OwnerActions } from '../components/OwnerActions';

describe('OwnerActions', () => {
	const defaultProps = {
		action: CollectibleCardAction.BUY,
		tokenId: 1n,
		collectionAddress: zeroAddress,
		chainId: 1,
		lowestListing: { ...mockOrder, side: OrderSide.listing } as any,
		highestOffer: { ...mockOrder, side: OrderSide.offer } as any,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.resetAllMocks();
		vi.restoreAllMocks();
	});

	it('renders Create listing button for LIST action', () => {
		render(
			<OwnerActions {...defaultProps} action={CollectibleCardAction.LIST} />,
		);

		expect(screen.getByText('Create listing')).toBeInTheDocument();
	});

	it('renders Transfer button for TRANSFER action', () => {
		render(
			<OwnerActions
				{...defaultProps}
				action={CollectibleCardAction.TRANSFER}
			/>,
		);

		expect(screen.getByText('Transfer')).toBeInTheDocument();
	});

	it('renders Sell button for SELL action', () => {
		render(
			<OwnerActions {...defaultProps} action={CollectibleCardAction.SELL} />,
		);

		expect(screen.getByText('Sell')).toBeInTheDocument();
	});

	it.skip('returns null for unsupported actions', () => {
		const props = {
			...defaultProps,
			action: CollectibleCardAction.BUY,
		};

		const { container } = render(
			<OwnerActions {...(props as Parameters<typeof OwnerActions>[0])} />,
		);
		expect(container).toBeEmptyDOMElement();
	});
});
