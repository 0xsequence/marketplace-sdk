import '@testing-library/jest-dom/vitest';
import {
	render,
	screen,
	cleanup,
	waitFor,
	fireEvent,
} from '../../../../_internal/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MakeOfferModal } from '../Modal';
import { makeOfferModal$ } from '../store';
import { zeroAddress } from 'viem';
import * as hooks from '../../../../hooks';

// TODO: This should be moved to a shared test file
vi.mock(import('../../../../hooks'), async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		useCollectible: vi.fn(actual.useCollectible),
		useCollection: vi.fn(actual.useCollection),
		useCurrencies: vi.fn(actual.useCurrencies),
		useCurrencyOptions: vi.fn(actual.useCurrencyOptions),
		useMarketplaceConfig: vi.fn(actual.useMarketplaceConfig),
		useLowestListing: vi.fn(actual.useLowestListing),
	};
});

describe('MakeOfferModal', () => {
	beforeEach(() => {
		cleanup();
		// Reset all mocks
		vi.clearAllMocks();
	});

	it('should not render when modal is closed', () => {
		render(<MakeOfferModal />);
		expect(screen.queryByText('Make an offer')).toBeNull();
	});

	it('should render loading state', () => {
		makeOfferModal$.open({
			collectionAddress: zeroAddress,
			chainId: '1',
			collectibleId: '1',
		});

		render(<MakeOfferModal />);
		const loadingModal = screen.getByTestId('loading-modal');
		expect(loadingModal).toBeVisible();
	});

	it('should render error state', async () => {
		vi.mocked(hooks.useCollectible).mockReturnValue({
			data: undefined,
			isLoading: false,
			isError: true,
		});

		makeOfferModal$.open({
			collectionAddress: '0x123',
			chainId: '1',
			collectibleId: '1',
		});

		render(<MakeOfferModal />);
		const errorModal = await screen.findByTestId('error-modal');
		expect(errorModal).toBeVisible();
	});

	it('should render main form when data is loaded', async () => {
		makeOfferModal$.open({
			collectionAddress: zeroAddress,
			chainId: '1',
			collectibleId: '1',
		});

		render(<MakeOfferModal />);

		expect(await screen.findByText('Mock Collection')).toBeInTheDocument();
	});

	it('should reset store values when modal is closed and reopened', () => {
		// Open modal first time
		makeOfferModal$.open({
			collectionAddress: '0x123',
			chainId: '1',
			collectibleId: '1',
		});

		// Set some values in the store
		makeOfferModal$.offerPrice.amountRaw.set('1000000000000000000');
		makeOfferModal$.expiry.set(new Date());

		// Close modal
		makeOfferModal$.close();

		// Verify store is reset
		expect(makeOfferModal$.offerPrice.amountRaw.get()).toBe('0');
		expect(makeOfferModal$.expiry.get()).toBeDefined();

		// Reopen modal
		makeOfferModal$.open({
			collectionAddress: '0x456',
			chainId: '1',
			collectibleId: '2',
		});

		// Verify store has default values
		expect(makeOfferModal$.offerPrice.amountRaw.get()).toBe('0');
		expect(makeOfferModal$.expiry.get()).toBeDefined();
	});

	it('should update state based on price input', async () => {
		makeOfferModal$.open({
			collectionAddress: '0x123',
			chainId: '1',
			collectibleId: '1',
		});

		render(<MakeOfferModal />);

		// Initial price should be 0
		expect(makeOfferModal$.offerPrice.amountRaw.get()).toBe('0');

		// Find and interact with price input

		const priceInput = await screen.findByRole('textbox', {
			name: 'Enter price',
		});
		expect(priceInput).toBeInTheDocument();

		fireEvent.change(priceInput, { target: { value: '1.5' } });

		// Wait for the state to update and verify it's not 0 anymore
		await waitFor(() => {
			expect(makeOfferModal$.offerPrice.amountRaw.get()).not.toBe('0');
		});
	});
});
