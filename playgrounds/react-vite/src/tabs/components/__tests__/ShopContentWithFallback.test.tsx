import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ShopContentWithFallback } from '../ShopContentWithFallback';

// Mock the enhanced hook
vi.mock('@0xsequence/marketplace-sdk/react', () => ({
	useEnhancedPrimarySaleShopCardData: vi.fn(),
}));

// Mock the components
vi.mock('../CollectibleCardRenderer', () => ({
	CollectibleCardRenderer: () => <div>Card</div>,
}));

vi.mock('../PaginatedView', () => ({
	PaginatedView: ({ collectibleCards }: { collectibleCards: unknown[] }) => (
		<div>Paginated View - {collectibleCards.length} items</div>
	),
}));

vi.mock('../InfiniteScrollView', () => ({
	InfiniteScrollView: ({
		collectibleCards,
	}: { collectibleCards: unknown[] }) => (
		<div>Infinite Scroll - {collectibleCards.length} items</div>
	),
}));

vi.mock('../ShopGridSkeleton', () => ({
	ShopGridSkeleton: ({ count }: { count: number }) => (
		<div>Loading {count} skeletons</div>
	),
}));

import { useEnhancedPrimarySaleShopCardData } from '@0xsequence/marketplace-sdk/react';

const mockUseEnhancedPrimarySaleShopCardData =
	useEnhancedPrimarySaleShopCardData as ReturnType<typeof vi.fn>;

describe('ShopContentWithFallback', () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: { retry: false },
			},
		});
		vi.clearAllMocks();
	});

	const renderComponent = (props = {}) => {
		const defaultProps = {
			saleContractAddress: '0x123',
			collectionAddress: '0x456',
			chainId: 1,
			paginationMode: 'paginated' as const,
			...props,
		};

		return render(
			<QueryClientProvider client={queryClient}>
				<ShopContentWithFallback {...defaultProps} />
			</QueryClientProvider>,
		);
	};

	it('should show no shop available when no sale contract address', () => {
		renderComponent({ saleContractAddress: undefined });

		expect(screen.getByText('No Shop Available')).toBeInTheDocument();
		expect(
			screen.getByText('No sale contract address was provided.'),
		).toBeInTheDocument();
		expect(screen.getByText('🏪')).toBeInTheDocument();
	});

	it('should show loading skeletons when loading', () => {
		mockUseEnhancedPrimarySaleShopCardData.mockReturnValue({
			collectibleCards: [],
			isLoading: true,
			error: null,
			retry: vi.fn(),
			retryCount: 0,
			isRetrying: false,
		});

		renderComponent();

		expect(screen.getByText('Loading 12 skeletons')).toBeInTheDocument();
	});

	it('should show more skeletons for infinite scroll mode', () => {
		mockUseEnhancedPrimarySaleShopCardData.mockReturnValue({
			collectibleCards: [],
			isLoading: true,
			error: null,
			retry: vi.fn(),
			retryCount: 0,
			isRetrying: false,
		});

		renderComponent({ paginationMode: 'infinite' });

		expect(screen.getByText('Loading 20 skeletons')).toBeInTheDocument();
	});

	it('should show error state with retry button', () => {
		const mockRetry = vi.fn();
		mockUseEnhancedPrimarySaleShopCardData.mockReturnValue({
			collectibleCards: [],
			isLoading: false,
			error: new Error('Failed to load'),
			retry: mockRetry,
			retryCount: 1,
			isRetrying: false,
		});

		renderComponent();

		expect(screen.getByText('Unable to Load Items')).toBeInTheDocument();
		expect(
			screen.getByText(
				"We couldn't load the shop items. This might be temporary.",
			),
		).toBeInTheDocument();
		expect(screen.getByText('😕')).toBeInTheDocument();

		const retryButton = screen.getByText('Try Again (1)');
		fireEvent.click(retryButton);

		expect(mockRetry).toHaveBeenCalled();
	});

	it('should hide retry button after max retries', () => {
		mockUseEnhancedPrimarySaleShopCardData.mockReturnValue({
			collectibleCards: [],
			isLoading: false,
			error: new Error('Failed to load'),
			retry: vi.fn(),
			retryCount: 3,
			isRetrying: false,
		});

		renderComponent();

		expect(screen.getByText('Unable to Load Items')).toBeInTheDocument();
		expect(screen.queryByText(/Try Again/)).not.toBeInTheDocument();
	});

	it('should show empty state when no items', () => {
		mockUseEnhancedPrimarySaleShopCardData.mockReturnValue({
			collectibleCards: [],
			isLoading: false,
			error: null,
			retry: vi.fn(),
			retryCount: 0,
			isRetrying: false,
		});

		renderComponent();

		expect(screen.getByText('No Items Available')).toBeInTheDocument();
		expect(
			screen.getByText(
				"This shop doesn't have any items for sale at the moment.",
			),
		).toBeInTheDocument();
		expect(screen.getByText('📦')).toBeInTheDocument();
		expect(screen.getByText('Refresh Page')).toBeInTheDocument();
	});

	it('should show retrying state', () => {
		mockUseEnhancedPrimarySaleShopCardData.mockReturnValue({
			collectibleCards: [],
			isLoading: false,
			error: null,
			retry: vi.fn(),
			retryCount: 2,
			isRetrying: true,
		});

		renderComponent();

		expect(
			screen.getByText('Retrying... (Attempt 3 of 3)'),
		).toBeInTheDocument();
		expect(screen.getByText('🔄')).toBeInTheDocument();
		expect(screen.getByText('Loading 8 skeletons')).toBeInTheDocument();
	});

	it('should show paginated view with items', () => {
		const mockCards = [
			{ id: '1', name: 'Item 1' },
			{ id: '2', name: 'Item 2' },
		];

		mockUseEnhancedPrimarySaleShopCardData.mockReturnValue({
			collectibleCards: mockCards,
			isLoading: false,
			error: null,
			retry: vi.fn(),
			retryCount: 0,
			isRetrying: false,
		});

		renderComponent();

		expect(screen.getByText('Paginated View - 2 items')).toBeInTheDocument();
	});

	it('should show infinite scroll view with items', () => {
		const mockCards = [
			{ id: '1', name: 'Item 1' },
			{ id: '2', name: 'Item 2' },
		];

		mockUseEnhancedPrimarySaleShopCardData.mockReturnValue({
			collectibleCards: mockCards,
			isLoading: false,
			error: null,
			retry: vi.fn(),
			retryCount: 0,
			isRetrying: false,
		});

		renderComponent({ paginationMode: 'infinite' });

		expect(screen.getByText('Infinite Scroll - 2 items')).toBeInTheDocument();
	});

	it('should reload page when refresh button clicked', () => {
		mockUseEnhancedPrimarySaleShopCardData.mockReturnValue({
			collectibleCards: [],
			isLoading: false,
			error: null,
			retry: vi.fn(),
			retryCount: 0,
			isRetrying: false,
		});

		const reloadMock = vi.fn();
		Object.defineProperty(window, 'location', {
			value: { reload: reloadMock },
			writable: true,
		});

		renderComponent();

		const refreshButton = screen.getByText('Refresh Page');
		fireEvent.click(refreshButton);

		expect(reloadMock).toHaveBeenCalled();
	});

	it('should increment manual retry count', async () => {
		const mockRetry = vi.fn();
		mockUseEnhancedPrimarySaleShopCardData.mockReturnValue({
			collectibleCards: [],
			isLoading: false,
			error: new Error('Failed'),
			retry: mockRetry,
			retryCount: 0,
			isRetrying: false,
		});

		renderComponent();

		// First retry
		const retryButton1 = screen.getByText('Try Again (1)');
		fireEvent.click(retryButton1);

		// Wait for state update
		await waitFor(() => {
			expect(mockRetry).toHaveBeenCalledTimes(1);
		});

		// Re-render with same error
		mockUseEnhancedPrimarySaleShopCardData.mockReturnValue({
			collectibleCards: [],
			isLoading: false,
			error: new Error('Failed'),
			retry: mockRetry,
			retryCount: 0,
			isRetrying: false,
		});

		// Second retry should show incremented count
		const retryButton2 = screen.getByText('Try Again (2)');
		expect(retryButton2).toBeInTheDocument();
	});
});
