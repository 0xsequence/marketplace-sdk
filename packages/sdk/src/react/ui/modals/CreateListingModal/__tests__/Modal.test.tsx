import { useWaasFeeOptions } from '@0xsequence/kit';
import { cleanup, fireEvent, render, screen, waitFor } from '@test';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as hooks from '../../../../hooks';
import { CreateListingModal } from '../Modal';
import { createListingModal$ } from '../store';

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
	useWaasFeeOptions: vi.fn(),
}));

const defaultArgs = {
	collectionAddress: zeroAddress,
	chainId: '1',
	collectibleId: '1',
};

describe('CreateListingModal', () => {
	beforeEach(() => {
		cleanup();
		// Reset all mocks
		vi.clearAllMocks();
		vi.resetAllMocks();
		// @ts-expect-error - Mock this differently
		vi.mocked(useWaasFeeOptions).mockReturnValue([]);
	});

	it('should not render when modal is closed', () => {
		render(<CreateListingModal />);
		expect(screen.queryByText('List item for sale')).toBeNull();
	});

	it('should show error modal when there is an error fetching data', async () => {
		// @ts-expect-error - TODO: Add a common mock object with the correct shape
		vi.mocked(hooks.useCollection).mockReturnValue({
			data: undefined,
			isLoading: false,
			isError: true,
		});

		createListingModal$.open(defaultArgs);

		render(<CreateListingModal />);

		expect(
			await screen.findByText('Error loading item details'),
		).toBeInTheDocument();
	});

	it('should render main form when data is loaded', async () => {
		createListingModal$.open(defaultArgs);
		render(<CreateListingModal />);

		// Check for the collection name in the token preview
		expect(await screen.findByText('Mock Collection')).toBeInTheDocument();
	});

	it('should reset store values when modal is closed and reopened', () => {
		// Open modal first time
		createListingModal$.open(defaultArgs);

		// Set some values in the store
		createListingModal$.listingPrice.amountRaw.set('1000000000000000000');
		createListingModal$.quantity.set('5');

		// Close modal
		createListingModal$.close();

		// Verify store is reset
		expect(createListingModal$.listingPrice.amountRaw.get()).toBe('0');
		expect(createListingModal$.quantity.get()).toBe('1');

		// Reopen modal
		createListingModal$.open({
			collectionAddress: '0x456',
			chainId: '1',
			collectibleId: '2',
		});

		// Verify store has default values
		expect(createListingModal$.listingPrice.amountRaw.get()).toBe('0');
		expect(createListingModal$.quantity.get()).toBe('1');
	});

	it('should update state based on price input', async () => {
		createListingModal$.open(defaultArgs);

		render(<CreateListingModal />);

		// Initial price should be 0
		expect(createListingModal$.listingPrice.amountRaw.get()).toBe('0');

		// Find and interact with price input using id
		const priceInput = await screen.findByRole('textbox', {
			name: /enter price/i,
		});
		expect(priceInput).toBeInTheDocument();

		fireEvent.change(priceInput, { target: { value: '1.5' } });

		// Wait for the state to update and verify it's not 0 anymore
		await waitFor(() => {
			expect(createListingModal$.listingPrice.amountRaw.get()).not.toBe('0');
		});
	});

	it('should show no currencies configured modal when currencies array is empty', async () => {
		// @ts-expect-error - Improve this mock
		vi.mocked(hooks.useCurrencies).mockReturnValue({
			data: [],
			isLoading: false,
			isError: false,
		});

		createListingModal$.open(defaultArgs);

		render(<CreateListingModal />);

		expect(
			await screen.findByText(
				'No currencies are configured for the marketplace, contact the marketplace owners',
			),
		).toBeInTheDocument();
	});
});
