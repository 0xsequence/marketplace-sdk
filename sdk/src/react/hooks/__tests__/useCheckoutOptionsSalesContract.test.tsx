import { skipToken } from '@tanstack/react-query';
import { renderHook, server, waitFor } from '@test';
import { http, HttpResponse } from 'msw';
import type { Address } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockMarketplaceEndpoint } from '../../_internal/api/__mocks__/marketplace.msw';
import { useCheckoutOptionsSalesContract } from '../useCheckoutOptionsSalesContract';

// Mock wagmi
vi.mock('wagmi', () => ({
	useAccount: vi.fn(() => ({
		address: '0x1234567890123456789012345678901234567890' as Address,
	})),
}));

describe('useCheckoutOptionsSalesContract', () => {
	const defaultArgs = {
		chainId: 1,
		contractAddress: '0x456' as Address,
		collectionAddress: '0x123' as Address,
		items: [{ tokenId: '1', quantity: '1' }],
		query: { enabled: true },
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should fetch checkout options successfully', async () => {
		const mockCheckoutOptions = {
			checkoutOptions: {
				cryptoCheckoutOptions: [
					{
						paymentToken: {
							contractAddress: '0x0000000000000000000000000000000000000000',
							chainId: 1,
							name: 'Ethereum',
							symbol: 'ETH',
							decimals: 18,
						},
						price: {
							amount: '1000000000000000000',
							amountFormatted: '1.0',
						},
					},
				],
				fiatCheckoutOptions: [],
			},
		};

		server.use(
			http.post(mockMarketplaceEndpoint('CheckoutOptionsSalesContract'), () => {
				return HttpResponse.json(mockCheckoutOptions);
			}),
		);

		const { result } = renderHook(() =>
			useCheckoutOptionsSalesContract(defaultArgs),
		);

		expect(result.current.isLoading).toBe(true);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toEqual(mockCheckoutOptions);
		expect(result.current.isError).toBe(false);
	});

	it('should handle API errors', async () => {
		server.use(
			http.post(mockMarketplaceEndpoint('CheckoutOptionsSalesContract'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch checkout options' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() =>
			useCheckoutOptionsSalesContract(defaultArgs),
		);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.data).toBeUndefined();
	});

	it('should skip query when skipToken is passed', () => {
		const { result } = renderHook(() =>
			useCheckoutOptionsSalesContract(skipToken),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.isError).toBe(false);
		expect(result.current.status).toBe('pending');
	});

	it('should skip query when no wallet address', () => {
		vi.mocked(require('wagmi').useAccount).mockReturnValue({
			address: undefined,
		});

		const { result } = renderHook(() =>
			useCheckoutOptionsSalesContract(defaultArgs),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.status).toBe('pending');
	});

	it('should include wallet address in API call', async () => {
		let capturedRequest: unknown = null;

		server.use(
			http.post(
				mockMarketplaceEndpoint('CheckoutOptionsSalesContract'),
				async ({ request }) => {
					capturedRequest = await request.json();
					return HttpResponse.json({
						checkoutOptions: {
							cryptoCheckoutOptions: [],
							fiatCheckoutOptions: [],
						},
					});
				},
			),
		);

		const { result } = renderHook(() =>
			useCheckoutOptionsSalesContract(defaultArgs),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(capturedRequest).toMatchObject({
			chainId: '1',
			wallet: '0x1234567890123456789012345678901234567890',
			contractAddress: '0x456',
			collectionAddress: '0x123',
			items: [{ tokenId: '1', quantity: '1' }],
		});
	});

	it('should handle different wallet addresses', async () => {
		const walletAddress1 =
			'0x1111111111111111111111111111111111111111' as Address;
		const walletAddress2 =
			'0x2222222222222222222222222222222222222222' as Address;

		// First render with wallet 1
		vi.mocked(require('wagmi').useAccount).mockReturnValue({
			address: walletAddress1,
		});

		const { result, rerender } = renderHook(() =>
			useCheckoutOptionsSalesContract(defaultArgs),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Change to wallet 2
		vi.mocked(require('wagmi').useAccount).mockReturnValue({
			address: walletAddress2,
		});

		rerender();

		// Should trigger new query with different wallet
		expect(result.current.isLoading).toBe(true);
	});

	it('should handle query enabled/disabled state', () => {
		const argsDisabled = {
			...defaultArgs,
			query: { enabled: false },
		};

		const { result } = renderHook(() =>
			useCheckoutOptionsSalesContract(argsDisabled),
		);

		// Query should be disabled
		expect(result.current.isLoading).toBe(false);
		expect(result.current.status).toBe('pending');
	});

	it('should validate schema correctly', async () => {
		const invalidArgs = {
			chainId: 'invalid' as unknown, // Should be number
			contractAddress: 'invalid' as unknown, // Should be valid address
			collectionAddress: '0x123' as Address,
			items: [{ tokenId: '1', quantity: '1' }],
			query: { enabled: true },
		};

		// This should not cause a runtime error due to zod validation
		// The hook should handle invalid args gracefully
		expect(() => {
			renderHook(() => useCheckoutOptionsSalesContract(invalidArgs));
		}).not.toThrow();
	});

	it('should handle empty items array', async () => {
		const argsWithEmptyItems = {
			...defaultArgs,
			items: [],
		};

		server.use(
			http.post(mockMarketplaceEndpoint('CheckoutOptionsSalesContract'), () => {
				return HttpResponse.json({
					checkoutOptions: {
						cryptoCheckoutOptions: [],
						fiatCheckoutOptions: [],
					},
				});
			}),
		);

		const { result } = renderHook(() =>
			useCheckoutOptionsSalesContract(argsWithEmptyItems),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.isError).toBe(false);
	});
});
