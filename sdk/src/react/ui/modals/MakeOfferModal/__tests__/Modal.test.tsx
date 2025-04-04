import { cleanup, fireEvent, render, screen, waitFor } from '@test';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MakeOfferModal } from '../Modal';
import { makeOfferModal$ } from '../store';

// TODO: This should be moved to a shared test file
vi.mock(import('../../../../hooks'), async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		useCollectible: vi.fn(actual.useCollectible),
		useCollection: vi.fn(actual.useCollection),
		useCurrencies: vi.fn(actual.useCurrencies),
		useMarketplaceConfig: vi.fn(actual.useMarketplaceConfig),
		useLowestListing: vi.fn(actual.useLowestListing),
	};
});

vi.mock('@0xsequence/kit', () => ({
	useWaasFeeOptions: vi.fn().mockReturnValue([]),
}));

const defaultArgs = {
	collectionAddress: zeroAddress,
	chainId: 1,
	collectibleId: '1',
};

describe.skip('MakeOfferModal', () => {
	beforeEach(() => {
		cleanup();
		// Reset all mocks
		vi.clearAllMocks();
		vi.resetAllMocks();
	});

	it('should not render when modal is closed', () => {
		render(<MakeOfferModal />);
		expect(screen.queryByText('Make an offer')).toBeNull();
	});

	it('should render loading state', () => {
		makeOfferModal$.open(defaultArgs);

		render(<MakeOfferModal />);
		const loadingModal = screen.getByTestId('loading-modal');
		expect(loadingModal).toBeVisible();
	});

	it.skip('should render error state', async () => {
		// @ts-expect-error - TODO: Add a common mock object with the correct shape
		vi.mocked(hooks.useCollection).mockReturnValue({
			data: undefined,
			isLoading: false,
			isError: true,
		});

		makeOfferModal$.open(defaultArgs);

		render(<MakeOfferModal />);
		const errorModal = await screen.findByTestId('error-modal');
		expect(errorModal).toBeVisible();
	});

	it.skip('should render main form when data is loaded', async () => {
		makeOfferModal$.open(defaultArgs);

		render(<MakeOfferModal />);

		expect(await screen.findByText('Enter price')).toBeInTheDocument();
	});

	it.skip('should reset store values when modal is closed and reopened', () => {
		// Open modal first time
		makeOfferModal$.open(defaultArgs);

		// Set some values in the store
		makeOfferModal$.offerPrice.amountRaw.set('1000000000000000000');
		makeOfferModal$.expiry.set(new Date());

		// Close modal
		makeOfferModal$.close();

		// Verify store is reset
		expect(makeOfferModal$.offerPrice.amountRaw.get()).toBe('0');
		expect(makeOfferModal$.expiry.get()).toBeDefined();

		// Reopen modal
		makeOfferModal$.open(defaultArgs);

		// Verify store has default values
		expect(makeOfferModal$.offerPrice.amountRaw.get()).toBe('0');
		expect(makeOfferModal$.expiry.get()).toBeDefined();
	});

	it.skip('should update state based on price input', async () => {
		makeOfferModal$.open(defaultArgs);

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
