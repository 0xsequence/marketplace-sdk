import { cleanup, fireEvent, render, renderHook, waitFor } from '@test';
import { TEST_COLLECTIBLE, USDC_ADDRESS } from '@test/const';
import { createMockWallet } from '@test/mocks/wallet';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMakeOfferModal } from '..';
import { WalletKind } from '../../../../_internal';
import type { Currency } from '../../../../_internal/api/marketplace.gen';
import * as walletModule from '../../../../_internal/wallet/useWallet';
import { MakeOfferModal } from '../Modal';
import { makeOfferModal$ } from '../store';

const defaultArgs = {
	collectionAddress: TEST_COLLECTIBLE.collectionAddress,
	chainId: TEST_COLLECTIBLE.chainId,
	collectibleId: TEST_COLLECTIBLE.collectibleId,
};

describe('MakeOfferModal', () => {
	const mockWallet = createMockWallet();

	beforeEach(() => {
		cleanup();
		// Reset all mocks
		vi.clearAllMocks();
		vi.resetAllMocks();
		vi.restoreAllMocks();
	});

	it('should show main button if there is no approval step', async () => {
		// Mock sequence wallet
		const sequenceWallet = {
			...mockWallet,
			walletKind: WalletKind.sequence,
		};
		vi.spyOn(walletModule, 'useWallet').mockReturnValue({
			wallet: sequenceWallet,
			isLoading: false,
			isError: false,
		});

		// Render the modal
		const { result } = renderHook(() => useMakeOfferModal());
		result.current.show(defaultArgs);

		const { queryByText } = render(<MakeOfferModal />);

		// Wait for the component to update
		await waitFor(() => {
			// The Approve TOKEN button should not exist
			const approveButton = queryByText('Approve TOKEN');
			expect(approveButton).toBeNull();

			const makeOfferButton = queryByText('Make offer');
			expect(makeOfferButton).toBeDefined();
		});
	});

	it('(non-sequence wallets) should show approve token button if there is an approval step, disable main button', async () => {
		const nonSequenceWallet = {
			...mockWallet,
			walletKind: 'unknown' as WalletKind,
		};
		vi.spyOn(walletModule, 'useWallet').mockReturnValue({
			wallet: nonSequenceWallet,
			isLoading: false,
			isError: false,
		});

		// Render the modal
		const { result } = renderHook(() => useMakeOfferModal());
		result.current.show(defaultArgs);

		const { getByText } = render(<MakeOfferModal />);

		await waitFor(() => {
			// find the Approve TOKEN button
			const approveButton = getByText('Approve TOKEN');
			expect(approveButton).toBeDefined();

			// main button is disabled when approval step exists
			const makeOfferButton = getByText('Make offer');
			expect(makeOfferButton.closest('button')).toHaveAttribute('disabled');
		});
	});

	it('should show spinner on approval button when executing', async () => {
		const { result } = renderHook(() => useMakeOfferModal());
		result.current.show(defaultArgs);

		// Set steps through the store
		makeOfferModal$.set({
			...defaultArgs,
			isOpen: true,
			offerPrice: {
				amountRaw: '1000',
				currency: {
					chainId: 1,
					contractAddress: USDC_ADDRESS,
					status: 'active',
					name: 'Test Currency',
					symbol: 'TEST',
					decimals: 18,
					imageUrl: '',
					exchangeRate: 1,
					defaultChainCurrency: false,
					nativeCurrency: false,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				} as Currency,
			},
			offerPriceChanged: true,
			quantity: '1',
			invalidQuantity: false,
			expiry: new Date(),
			collectionType: undefined,
			steps: {
				approval: {
					exist: true,
					isExecuting: false,
					execute: () => Promise.resolve(),
				},
				transaction: {
					exist: true,
					isExecuting: false,
					execute: () => Promise.resolve(),
				},
			},
			offerIsBeingProcessed: false,
			callbacks: undefined,
			orderbookKind: undefined,
			open: expect.any(Function),
			close: expect.any(Function),
		});

		const { getByText } = render(<MakeOfferModal />);

		await waitFor(() => {
			expect(getByText('Make an offer')).toBeDefined();
			expect(getByText('Approve TOKEN')).toBeDefined();
		});

		const approvalButton = getByText('Approve TOKEN');
		const makeOfferButton = getByText('Make offer');
		// approve button is enabled
		expect(approvalButton.closest('button')).not.toHaveAttribute('disabled');
		// main button is disabled when approval step exists
		expect(makeOfferButton.closest('button')).toHaveAttribute('disabled');

		fireEvent.click(approvalButton);
		waitFor(() => {
			expect(makeOfferModal$.steps.approval.isExecuting.get()).toBe(true);
		});
		// spinner should be shown
		expect(approvalButton.querySelector('.animate-spin')).toBeDefined();
	});
});
