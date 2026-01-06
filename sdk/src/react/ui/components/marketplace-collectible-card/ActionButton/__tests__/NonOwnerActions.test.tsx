'use client';

import { OrderSide } from '@0xsequence/api-client';
import * as MarketplaceMocks from '@0xsequence/api-client/mocks/marketplace';
import { render, screen } from '@test';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockOrder } = MarketplaceMocks;

import { CollectibleCardAction } from '../../../../../../types';
import { NonOwnerActions } from '../components/NonOwnerActions';

describe('NonOwnerActions', () => {
	const baseProps = {
		action: CollectibleCardAction.BUY,
		tokenId: 1n,
		collectionAddress: zeroAddress,
		chainId: 1,
	};

	const marketProps = {
		...baseProps,
		cardType: 'market' as const,
		lowestListing: { ...mockOrder, side: OrderSide.listing } as any,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.resetAllMocks();
		vi.restoreAllMocks();
	});

	it('renders Buy now button for BUY action', () => {
		render(<NonOwnerActions {...marketProps} />);
		expect(screen.getByText('Buy now')).toBeInTheDocument();
	});

	it('renders Buy now button for SHOP marketplace type', () => {
		render(
			<NonOwnerActions
				{...baseProps}
				cardType="shop"
				salesContractAddress="0x123"
				salePrice={{
					amount: 100000000000000000n,
					currencyAddress: zeroAddress,
				}}
			/>,
		);
		expect(screen.getByText('Buy now')).toBeInTheDocument();
	});

	it('throws error when lowestListing is missing for BUY action in MARKET marketplace type', () => {
		expect(() => {
			render(<NonOwnerActions {...baseProps} cardType="market" />);
		}).toThrow('lowestListing is required for BUY action and MARKET card type');
	});

	it('renders Make an offer button for OFFER action', () => {
		render(
			<NonOwnerActions
				{...baseProps}
				cardType="market"
				action={CollectibleCardAction.OFFER}
			/>,
		);
		expect(screen.getByText('Make an offer')).toBeInTheDocument();
	});
});
