import { cleanup, render, renderHook, waitFor } from '@test';
import { TEST_COLLECTIBLE } from '@test/const';
import { createMockWallet } from '@test/mocks/wallet';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CurrencyStatus } from '../../../../_internal';
import * as walletModule from '../../../../_internal/wallet/useWallet';
import { useMakeOfferModal } from '..';
import { MakeOfferModal } from '../Modal';
import { makeOfferModal$ } from '../store';

const defaultArgs = {
	collectionAddress: TEST_COLLECTIBLE.collectionAddress,
	chainId: TEST_COLLECTIBLE.chainId,
	collectibleId: TEST_COLLECTIBLE.collectibleId,
};

// Mock currency object with all required properties
const mockCurrency = {
	chainId: 1,
	contractAddress: '0x123',
	status: CurrencyStatus.active,
	name: 'Test Token',
	symbol: 'TEST',
	decimals: 18,
	imageUrl: 'https://example.com/test.png',
	exchangeRate: 1,
	defaultChainCurrency: false,
	nativeCurrency: false,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
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

	it('should show/hide CTAs based on approval step existence in store', async () => {
		// test case 1: approval.exist = true
		makeOfferModal$.open(defaultArgs);
		makeOfferModal$.offerPrice.set({
			amountRaw: '1000000000000000000',
			currency: mockCurrency,
		});
		makeOfferModal$.offerPriceChanged.set(true);
		makeOfferModal$.steps.approval.exist.set(true);

		const { getByText, unmount } = render(<MakeOfferModal />);

		await waitFor(() => {
			// Approve TOKEN button should be visible
			const approveButton = getByText('Approve TOKEN');
			expect(approveButton).toBeDefined();

			// Make offer button should be disabled
			const makeOfferButton = getByText('Make offer');
			expect(makeOfferButton.closest('button')).toHaveAttribute('disabled');
		});

		unmount();
		cleanup();

		// test case 2: approval.exist = false
		makeOfferModal$.open(defaultArgs);
		makeOfferModal$.offerPrice.set({
			amountRaw: '1000000000000000000',
			currency: mockCurrency,
		});
		makeOfferModal$.offerPriceChanged.set(true);
		makeOfferModal$.steps.approval.exist.set(false);

		const { queryByText, getByText: getByText2 } = render(<MakeOfferModal />);

		await waitFor(() => {
			// Approve TOKEN button should not exist or be hidden
			const approveButton = queryByText('Approve TOKEN');
			expect(approveButton).toBeNull();

			// Make offer button should be enabled
			const makeOfferButton = getByText2('Make offer');
			expect(makeOfferButton.closest('button')).not.toHaveAttribute('disabled');
		});

		makeOfferModal$.close();
	});
});
