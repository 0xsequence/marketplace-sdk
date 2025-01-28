import '@testing-library/jest-dom/vitest';
import {
	render,
	screen,
	cleanup,
	fireEvent,
	waitFor,
} from '../../../../_internal/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MakeOfferModal } from '../Modal';
import { makeOfferModal$ } from '../store';
import { useCollectible, useCollection } from '../../../../hooks';
import { useAccount } from 'wagmi';
import { useMakeOffer } from '../hooks/useMakeOffer';
import { useWallet } from '../../../../_internal/wallet/useWallet';

// Mock the hooks
vi.mock('../../../../hooks', () => ({
	useCollectible: vi.fn(),
	useCollection: vi.fn(),
	useCurrencies: vi.fn().mockReturnValue({
		data: [{ contractAddress: '0x123', symbol: 'TEST' }],
		isLoading: false,
		isError: false,
	}),
	useCurrencyOptions: vi.fn().mockReturnValue({
		data: [],
		isLoading: false,
		isError: false,
	}),
	useMarketplaceConfig: vi.fn().mockReturnValue({
		data: {
			collections: [
				{
					collectionAddress: '0x123',
					marketplaceFeePercentage: 2.5,
				},
			],
		},
		isLoading: false,
		isError: false,
	}),
	useLowestListing: vi.fn().mockReturnValue({
		data: null,
		isLoading: false,
		isError: false,
	}),
}));

vi.mock('../../../../_internal/wallet/useWallet', () => ({
	useWallet: vi.fn(),
}));

vi.mock(import('wagmi'), async (importOriginal) => {
	const mod = await importOriginal();
	return {
		...mod,
		useAccount: vi.fn(),
		useConnections: vi.fn().mockReturnValue({
			data: [],
			isLoading: false,
			isError: false,
		}),
	};
});

vi.mock('../hooks/useMakeOffer', () => ({
	useMakeOffer: vi.fn(),
}));

vi.mock('@0xsequence/kit', () => ({
	useWaasFeeOptions: vi.fn().mockReturnValue([false, vi.fn()]),
}));

describe('MakeOfferModal', () => {
	beforeEach(() => {
		cleanup();
		// Reset all mocks
		vi.clearAllMocks();

		// Setup default mock values
		(useWallet as any).mockReturnValue({
			wallet: {
				address: () => Promise.resolve('0x123'),
			},
			isLoading: false,
			isError: false,
		});

		(useCollectible as any).mockReturnValue({
			data: { decimals: 18, name: 'Test NFT' },
			isLoading: false,
			isError: false,
		});

		(useCollection as any).mockReturnValue({
			data: { type: 'ERC721', name: 'Test Collection' },
			isLoading: false,
			isError: false,
		});

		(useAccount as any).mockReturnValue({
			address: '0x123',
		});

		(useMakeOffer as any).mockReturnValue({
			isLoading: false,
			executeApproval: vi.fn(),
			makeOffer: vi.fn(),
			tokenApprovalIsLoading: false,
		});
	});

	it('should not render when modal is closed', () => {
		render(<MakeOfferModal />);
		expect(screen.queryByText('Make an offer')).toBeNull();
	});

	it('should render loading state', () => {
		(useCollectible as any).mockReturnValue({
			isLoading: true,
		});

		makeOfferModal$.open({
			collectionAddress: '0x123',
			chainId: '1',
			collectibleId: '1',
		});

		render(<MakeOfferModal />);
		const loadingModal = screen.getByTestId('loading-modal');
		expect(loadingModal).toBeVisible();
	});

	it('should render error state', () => {
		(useCollectible as any).mockReturnValue({
			isError: true,
		});

		makeOfferModal$.open({
			collectionAddress: '0x123',
			chainId: '1',
			collectibleId: '1',
		});

		render(<MakeOfferModal />);
		const errorModal = screen.getByTestId('error-modal');
		expect(errorModal).toBeVisible();
	});

	it('should render main form when data is loaded', () => {
		makeOfferModal$.open({
			collectionAddress: '0x123',
			chainId: '1',
			collectibleId: '1',
		});

		render(<MakeOfferModal />);

		expect(screen.getByText('Test Collection')).toBeInTheDocument();
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
		const priceInput = screen.getByRole('textbox', { name: 'Enter price' });
		expect(priceInput).toBeInTheDocument();

		fireEvent.change(priceInput, { target: { value: '1.5' } });

		// Wait for the state to update and verify it's not 0 anymore
		await waitFor(() => {
			expect(makeOfferModal$.offerPrice.amountRaw.get()).not.toBe('0');
		});
	});
});
