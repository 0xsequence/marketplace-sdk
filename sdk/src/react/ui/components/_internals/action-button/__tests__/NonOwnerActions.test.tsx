'use client';

import { render, screen } from '@test';
import { createMockWallet } from '@test/mocks/wallet';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CollectibleCardAction } from '../../../../../../types';
import { OrderSide } from '../../../../../_internal';
import { mockOrder } from '../../../../../_internal/api/__mocks__/marketplace.msw';
import * as walletModule from '../../../../../_internal/wallet/useWallet';
import { NonOwnerActions } from '../components/NonOwnerActions';

describe('NonOwnerActions', () => {
	const defaultProps = {
		action: CollectibleCardAction.BUY,
		tokenId: '1',
		collectionAddress: zeroAddress,
		chainId: 1,
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
		render(<NonOwnerActions {...defaultProps} marketplaceType={'market'} />);
		expect(screen.getByText('Buy now')).toBeInTheDocument();
	});

	it('renders Buy now button for SHOP marketplace type', () => {
		render(
			<NonOwnerActions
				{...defaultProps}
				marketplaceType={'shop'}
				salesContractAddress="0x123"
				salePrice={{ amount: '0.1', currencyAddress: zeroAddress }}
			/>,
		);
		expect(screen.getByText('Buy now')).toBeInTheDocument();
	});

	it('throws error when salesContractAddress is missing for SHOP marketplace type', () => {
		expect(() => {
			render(<NonOwnerActions {...defaultProps} marketplaceType={'shop'} />);
		}).toThrow('salesContractAddress is required for SHOP card type');
	});

	it('throws error when lowestListing is missing for BUY action in MARKET marketplace type', () => {
		const { lowestListing, ...propsWithoutLowestListing } = defaultProps;

		expect(() => {
			render(
				<NonOwnerActions
					{...propsWithoutLowestListing}
					marketplaceType={'market'}
				/>,
			);
		}).toThrow('lowestListing is required for BUY action and MARKET card type');
	});

	it('renders Make an offer button for OFFER action', () => {
		render(
			<NonOwnerActions
				{...defaultProps}
				action={CollectibleCardAction.OFFER}
				marketplaceType={'market'}
			/>,
		);
		expect(screen.getByText('Make an offer')).toBeInTheDocument();
	});
});
