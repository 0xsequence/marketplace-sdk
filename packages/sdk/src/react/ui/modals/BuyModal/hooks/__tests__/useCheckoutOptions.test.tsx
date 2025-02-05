import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCheckoutOptions } from '../useCheckoutOptions';
import { useWallet } from '../../../../../_internal/wallet/useWallet';
import { useConfig } from '../../../../../hooks';
import { useFees } from '../useFees';
import {
	MarketplaceKind,
	getMarketplaceClient,
} from '../../../../../_internal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// Mock dependencies
vi.mock('../../../../../_internal/wallet/useWallet', () => ({
	useWallet: vi.fn(),
}));

vi.mock('../../../../../hooks', () => ({
	useConfig: vi.fn(),
}));

vi.mock('../useFees', () => ({
	useFees: vi.fn(),
}));

vi.mock('../../../../../_internal', async () => {
	const actual = (await vi.importActual('../../../../../_internal')) as Record<
		string,
		unknown
	>;
	return {
		...actual,
		getMarketplaceClient: vi.fn(),
	};
});

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});
	return ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe('useCheckoutOptions', () => {
	const defaultProps = {
		chainId: 1,
		collectionAddress: '0x123' as `0x${string}`,
		orderId: '1',
		marketplace: MarketplaceKind.sequence_marketplace_v2,
	};

	beforeEach(() => {
		vi.clearAllMocks();

		// Setup default mock implementations
		(useConfig as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			projectAccessKey: 'test-key',
			projectId: 'test-id',
		});

		(useFees as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			amount: '250',
			receiver: '0x123',
		});
	});

	it('should return undefined when wallet is not available', () => {
		// Mock useWallet to return no wallet
		(useWallet as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			wallet: undefined,
		});

		const { result } = renderHook(() => useCheckoutOptions(defaultProps), {
			wrapper: createWrapper(),
		});

		expect(result.current.data).toBeUndefined();
	});

	it('should fetch checkout options when wallet is available', async () => {
		// Mock useWallet to return a valid wallet
		(useWallet as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			wallet: {
				address: async () => '0x123',
			},
		});

		// Mock the marketplace client
		const checkoutOptionsMarketplaceMock = vi.fn().mockResolvedValue({
			options: {
				swap: [],
				nftCheckout: [],
				onRamp: [],
				crypto: ['ETH', 'USDC'],
			},
		});

		const marketplaceClientMock = {
			checkoutOptionsMarketplace: checkoutOptionsMarketplaceMock,
		};

		(
			getMarketplaceClient as unknown as ReturnType<typeof vi.fn>
		).mockReturnValue(marketplaceClientMock);

		const { result } = renderHook(() => useCheckoutOptions(defaultProps), {
			wrapper: createWrapper(),
		});

		// Wait for the query to complete
		await vi.waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Verify the marketplace client was called with correct parameters
		expect(checkoutOptionsMarketplaceMock).toHaveBeenCalledWith({
			wallet: '0x123',
			orders: [
				{
					contractAddress: defaultProps.collectionAddress,
					orderId: defaultProps.orderId,
					marketplace: defaultProps.marketplace,
				},
			],
			additionalFee: 250,
		});

		// Verify the returned data
		expect(result.current.data).toEqual({
			swap: [],
			nftCheckout: [],
			onRamp: [],
			crypto: ['ETH', 'USDC'],
		});
	});

	it('should call marketplaceClient.checkoutOptionsMarketplace with correct params', async () => {
		// Mock useWallet to return a valid wallet
		(useWallet as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			wallet: {
				address: async () => '0x456',
			},
		});

		// Mock the marketplace client
		const checkoutOptionsMarketplaceMock = vi.fn().mockResolvedValue({
			options: {
				swap: ['uniswap'],
				nftCheckout: ['moonpay'],
				onRamp: ['ramp'],
				crypto: ['ETH'],
			},
		});

		const marketplaceClientMock = {
			checkoutOptionsMarketplace: checkoutOptionsMarketplaceMock,
		};

		(
			getMarketplaceClient as unknown as ReturnType<typeof vi.fn>
		).mockReturnValue(marketplaceClientMock);

		const customProps = {
			chainId: 137,
			collectionAddress: '0x789' as `0x${string}`,
			orderId: '42',
			marketplace: MarketplaceKind.sequence_marketplace_v2,
		};

		// Mock fees with different values to ensure they're passed correctly
		(useFees as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			amount: '500',
			receiver: '0xabc',
		});

		renderHook(() => useCheckoutOptions(customProps), {
			wrapper: createWrapper(),
		});

		// Wait for the query to be called
		await vi.waitFor(() => {
			expect(checkoutOptionsMarketplaceMock).toHaveBeenCalledTimes(1);
		});

		// Verify exact parameters passed to the marketplace client
		expect(checkoutOptionsMarketplaceMock).toHaveBeenCalledWith({
			wallet: '0x456',
			orders: [
				{
					contractAddress: customProps.collectionAddress,
					orderId: customProps.orderId,
					marketplace: customProps.marketplace,
				},
			],
			additionalFee: 500, // Using the mocked fee amount
		});

		// Verify the marketplace client was initialized with correct chain ID
		expect(getMarketplaceClient).toHaveBeenCalledWith(
			customProps.chainId,
			expect.objectContaining({
				projectAccessKey: 'test-key',
				projectId: 'test-id',
			}),
		);
	});

	it('should handle API errors', async () => {
		// Mock useWallet to return a valid wallet
		(useWallet as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
			wallet: {
				address: async () => '0x123',
			},
		});

		// Mock the marketplace client to throw an error
		const errorMessage = 'Failed to fetch checkout options';
		const checkoutOptionsMarketplaceMock = vi
			.fn()
			.mockRejectedValue(new Error(errorMessage));

		const marketplaceClientMock = {
			checkoutOptionsMarketplace: checkoutOptionsMarketplaceMock,
		};

		(
			getMarketplaceClient as unknown as ReturnType<typeof vi.fn>
		).mockReturnValue(marketplaceClientMock);

		const { result } = renderHook(() => useCheckoutOptions(defaultProps), {
			wrapper: createWrapper(),
		});

		// Wait for the query to fail
		await vi.waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		// Verify error state
		expect(result.current.error).toBeDefined();
		expect(result.current.error).toBeInstanceOf(Error);
		expect((result.current.error as Error).message).toBe(errorMessage);

		// Verify data is undefined when there's an error
		expect(result.current.data).toBeUndefined();

		// Verify the API was called with correct parameters despite the error
		expect(checkoutOptionsMarketplaceMock).toHaveBeenCalledWith({
			wallet: '0x123',
			orders: [
				{
					contractAddress: defaultProps.collectionAddress,
					orderId: defaultProps.orderId,
					marketplace: defaultProps.marketplace,
				},
			],
			additionalFee: 250,
		});
	});
});
