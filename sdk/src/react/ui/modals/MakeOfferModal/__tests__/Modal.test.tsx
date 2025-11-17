import { cleanup, render, renderHook, waitFor } from '@test';
import { TEST_COLLECTIBLE } from '@test/const';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CurrencyStatus, StepType } from '../../../../_internal';
import { useMakeOfferModal } from '..';
import { useGetTokenApprovalData } from '../hooks/useGetTokenApproval';
import { MakeOfferModal } from '../Modal';
import { makeOfferModal$ } from '../store';

vi.mock('../hooks/useGetTokenApproval', () => ({
	useGetTokenApprovalData: vi.fn(),
}));

const defaultArgs = {
	collectionAddress: TEST_COLLECTIBLE.collectionAddress,
	chainId: TEST_COLLECTIBLE.chainId,
	tokenId: TEST_COLLECTIBLE.tokenId,
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
	openseaListing: true,
	openseaOffer: true,
	createdAt: new Date().toISOString(),
	updatedAt: new Date().toISOString(),
};

describe('MakeOfferModal', () => {
	beforeEach(() => {
		cleanup();
		// Reset all mocks
		vi.clearAllMocks();
		vi.resetAllMocks();
		vi.restoreAllMocks();
		// Set default mock behavior
		vi.mocked(useGetTokenApprovalData).mockReturnValue({
			data: { step: null }, // No approval needed by default
			isLoading: false,
			isSuccess: true,
			isError: false,
			error: null,
		});
	});

	it.skip('should show main button if there is no approval step', async () => {
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

	it.skip('(non-sequence wallets) should show approve token button if there is an approval step, disable main button', async () => {
		// Mock the hook to return approval needed
		vi.mocked(useGetTokenApprovalData).mockReturnValue({
			data: {
				step: {
					id: StepType.tokenApproval,
					data: '0x',
					to: '0x0000000000000000000000000000000000000000',
					value: 0n,
					price: 0n,
				},
			}, // Approval needed
			isLoading: false,
			isSuccess: true,
			isError: false,
			error: null,
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

	describe('CTA visibility based on approval requirement', () => {
		beforeEach(() => {
			makeOfferModal$.close();
			vi.clearAllMocks();
			vi.mocked(useGetTokenApprovalData).mockReturnValue({
				data: { step: null },
				isLoading: false,
				isSuccess: true,
				isError: false,
				error: null,
			});
		});

		it.skip('should show Approve TOKEN button when approval is required', async () => {
			vi.mocked(useGetTokenApprovalData).mockReturnValue({
				data: {
					step: {
						id: StepType.tokenApproval,
						data: '0x',
						to: '0x0000000000000000000000000000000000000000',
						value: 0n,
						price: 0n,
					},
				}, // Approval needed
				isLoading: false,
				isSuccess: true,
				isError: false,
				error: null,
			});

			makeOfferModal$.open(defaultArgs);
			makeOfferModal$.offerPrice.set({
				amountRaw: 1000000000000000000n,
				currency: mockCurrency,
			});
			makeOfferModal$.offerPriceChanged.set(true);

			const { getByText } = render(<MakeOfferModal />);

			await waitFor(() => {
				const approveButton = getByText('Approve TOKEN');
				expect(approveButton).toBeDefined();

				// Make offer button should be disabled when approval is required
				const makeOfferButton = getByText('Make offer');
				expect(makeOfferButton.closest('button')).toHaveAttribute('disabled');
			});
		});

		it.skip('should hide Approve TOKEN button when approval is not required', async () => {
			makeOfferModal$.close();
			vi.mocked(useGetTokenApprovalData).mockReturnValue({
				data: { step: null }, // No approval needed
				isLoading: false,
				isSuccess: true,
				isError: false,
				error: null,
			});

			makeOfferModal$.open(defaultArgs);
			makeOfferModal$.offerPrice.set({
				amountRaw: 1000000000000000000n,
				currency: mockCurrency,
			});
			makeOfferModal$.offerPriceChanged.set(true);

			const { queryByText, getByText } = render(<MakeOfferModal />);

			await waitFor(() => {
				expect(getByText('Make offer')).toBeInTheDocument();
			});
			const approveButton = queryByText('Approve TOKEN');
			expect(approveButton).not.toBeInTheDocument();

			// Make offer button should be enabled when no approval needed
			const makeOfferButton = getByText('Make offer');
			expect(makeOfferButton.closest('button')).not.toHaveAttribute('disabled');
		});
	});
});
