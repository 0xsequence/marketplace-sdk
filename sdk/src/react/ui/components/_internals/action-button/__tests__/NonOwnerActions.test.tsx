'use client';

import { render, screen } from '@test';
import { createMockWallet } from '@test/mocks/wallet';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockOrder } from '../../../../../../react/_internal/api/__mocks__/marketplace.msw';
import * as walletModule from '../../../../../../react/_internal/wallet/useWallet';
import { CollectibleCardAction, OrderSide } from '../../../../../../types';
import { NonOwnerActions } from '../components/NonOwnerActions';

describe('NonOwnerActions', () => {
	const baseProps = {
		action: CollectibleCardAction.BUY,
		tokenId: '1',
		collectionAddress: zeroAddress,
		chainId: 1,
	};

	const marketProps = {
		...baseProps,
		marketplaceType: 'market' as const,
		lowestListing: { ...mockOrder, side: OrderSide.listing },
	};

	beforeEach(() => {
		vi.clearAllMocks();
		vi.resetAllMocks();
		vi.restoreAllMocks();

		vi.spyOn(walletModule, 'useWallet').mockReturnValue({
			wallet: createMockWallet(),
			isLoading: false,
			isError: false,
		});
	});

	it('renders Buy now button for BUY action', () => {
		render(<NonOwnerActions {...marketProps} />);
		expect(screen.getByText('Buy now')).toBeInTheDocument();
	});

	it('renders Buy now button for SHOP marketplace type', () => {
		render(
			<NonOwnerActions
				{...baseProps}
				marketplaceType="shop"
				salesContractAddress="0x123"
				salePrice={{ amount: '0.1', currencyAddress: zeroAddress }}
			/>,
		);
		expect(screen.getByText('Buy now')).toBeInTheDocument();
	});

	it('throws error when lowestListing is missing for BUY action in MARKET marketplace type', () => {
		expect(() => {
			render(<NonOwnerActions {...baseProps} marketplaceType="market" />);
		}).toThrow('lowestListing is required for BUY action and MARKET card type');
	});

	it('renders Make an offer button for OFFER action', () => {
		render(
			<NonOwnerActions
				{...baseProps}
				marketplaceType="market"
				action={CollectibleCardAction.OFFER}
			/>,
		);
		expect(screen.getByText('Make an offer')).toBeInTheDocument();
	});
});
