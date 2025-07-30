'use client';

import { render, screen } from '@test';
import { createMockWallet } from '@test/mocks/wallet';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockOrder } from '../../../../../../react/_internal/api/__mocks__/marketplace.msw';
import * as walletModule from '../../../../../../react/_internal/wallet/useWallet';
import { CollectibleCardAction, OrderSide } from '../../../../../../types';
import { OwnerActions } from '../components/OwnerActions';

describe('OwnerActions', () => {
	const defaultProps = {
		action: CollectibleCardAction.BUY,
		tokenId: '1',
		collectionAddress: zeroAddress,
		chainId: 1,
		lowestListing: { ...mockOrder, side: OrderSide.listing },
		highestOffer: { ...mockOrder, side: OrderSide.offer },
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

	it('returns null for unsupported actions', () => {
		const props = {
			...defaultProps,
			action: CollectibleCardAction.BUY,
		};

		const { queryByText } = render(
			<OwnerActions {...(props as Parameters<typeof OwnerActions>[0])} />,
		);
		expect(queryByText('Create listing')).not.toBeInTheDocument();
		expect(queryByText('Transfer')).not.toBeInTheDocument();
		expect(queryByText('Sell')).not.toBeInTheDocument();
	});
});
