'use client';

import { render, screen } from '@test';
import { createMockWallet } from '@test/mocks/wallet';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OrderSide } from '../../../../../../_internal';
import { mockOrder } from '../../../../../../_internal/api/__mocks__/marketplace.msw';
import * as walletModule from '../../../../../../_internal/wallet/useWallet';
import { CollectibleCardAction } from '../../types';
import { NonOwnerActions } from '../NonOwnerActions';

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
	});

	it('renders Buy now button for BUY action', () => {
		vi.spyOn(walletModule, 'useWallet').mockReturnValue({
			wallet: createMockWallet(),
			isLoading: false,
			isError: false,
		});

		render(<NonOwnerActions {...defaultProps} />);
	});

	it('renders Make an offer button for OFFER action', () => {
		vi.spyOn(walletModule, 'useWallet').mockReturnValue({
			wallet: createMockWallet(),
			isLoading: false,
			isError: false,
		});

		render(
			<NonOwnerActions
				{...defaultProps}
				action={CollectibleCardAction.OFFER}
			/>,
		);
		expect(screen.getByText('Make an offer')).toBeInTheDocument();
	});

	it('returns null for unsupported actions', () => {
		const props = {
			...defaultProps,
			action: CollectibleCardAction.LIST,
		};

		const { container } = render(
			<NonOwnerActions {...(props as Parameters<typeof NonOwnerActions>[0])} />,
		);
		expect(container).toBeEmptyDOMElement();
	});
});
