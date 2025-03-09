import { type RenderHookOptions, renderHook, waitFor } from '@test';
import { server } from '@test';
import { http, HttpResponse } from 'msw';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockWallet } from '../../../../../../test/mocks/wallet';
import { MarketplaceKind } from '../../../../../_internal';
import { mockMarketplaceEndpoint } from '../../../../../_internal/api/__mocks__/marketplace.msw';
import { TransactionCrypto } from '../../../../../_internal/api/marketplace.gen';
import { useWallet } from '../../../../../_internal/wallet/useWallet';
import { useCheckoutOptions } from '../useCheckoutOptions';
import { useFees } from '../useFees';

// Mock dependencies
vi.mock('../../../../../_internal/wallet/useWallet');
vi.mock('../useFees');

// Create mock wallet instance
const mockWallet = createMockWallet({
	address: vi.fn().mockResolvedValue(zeroAddress),
});

describe('useCheckoutOptions', () => {
	const defaultInput = {
		chainId: 1,
		collectionAddress: zeroAddress,
		orderId: '123',
		marketplace: MarketplaceKind.sequence_marketplace_v2,
	};

	beforeEach(() => {
		vi.clearAllMocks();

		// Set up default wallet mock
		vi.mocked(useWallet).mockReturnValue({
			wallet: mockWallet,
			isLoading: false,
			isError: false,
		});

		// Set up default fees mock
		vi.mocked(useFees).mockReturnValue({
			amount: '100000000000000000',
			receiver: zeroAddress,
		});
	});

	it('should fetch checkout options successfully', async () => {
		const { result } = renderHook(() => useCheckoutOptions(defaultInput));

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data).toEqual({
			crypto: TransactionCrypto.all,
			swap: [],
			nftCheckout: [],
			onRamp: [],
		});
	});

	it('should not fetch when wallet is not available', () => {
		vi.mocked(useWallet).mockReturnValue({
			wallet: null,
			isLoading: false,
			isError: false,
		});

		const { result } = renderHook(() => useCheckoutOptions(defaultInput));

		expect(result.current.data).toBeUndefined();
		expect(result.current.isLoading).toBe(false);
	});

	it('should include fees in the API request', async () => {
		const mockFeeAmount = '200000000000000000';
		vi.mocked(useFees).mockReturnValue({
			amount: mockFeeAmount,
			receiver: zeroAddress,
		});

		let capturedRequest:
			| {
					wallet: string;
					orders: Array<{
						contractAddress: string;
						orderId: string;
						marketplace: MarketplaceKind;
					}>;
					additionalFee: number;
			  }
			| undefined;

		server.use(
			http.post(
				mockMarketplaceEndpoint('CheckoutOptionsMarketplace'),
				async ({ request }) => {
					capturedRequest = (await request.json()) as typeof capturedRequest;
					return HttpResponse.json({
						options: {
							crypto: TransactionCrypto.all,
							swap: [],
							nftCheckout: [],
							onRamp: [],
						},
					});
				},
			),
		);

		const { result } = renderHook(() => useCheckoutOptions(defaultInput));

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(capturedRequest?.additionalFee).toBe(Number(mockFeeAmount));
	});

	it('should handle API errors gracefully', async () => {
		server.use(
			http.post(mockMarketplaceEndpoint('CheckoutOptionsMarketplace'), () => {
				return HttpResponse.error();
			}),
		);

		const { result } = renderHook(() => useCheckoutOptions(defaultInput));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when input parameters change', async () => {
		const { result, rerender } = renderHook<
			typeof defaultInput,
			ReturnType<typeof useCheckoutOptions>
		>((props) => useCheckoutOptions(props), {
			initialProps: defaultInput,
		} as RenderHookOptions<typeof defaultInput>);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Change input
		rerender({
			...defaultInput,
			orderId: '456',
		});

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Verify that the query was refetched
		expect(result.current.data).toEqual({
			crypto: TransactionCrypto.all,
			swap: [],
			nftCheckout: [],
			onRamp: [],
		});
	});

	it('should handle wallet address resolution failure', async () => {
		const mockWalletWithFailure = createMockWallet({
			address: vi.fn().mockRejectedValue(new Error('Failed to get address')),
		});

		vi.mocked(useWallet).mockReturnValue({
			wallet: mockWalletWithFailure,
			isLoading: false,
			isError: false,
		});

		const { result } = renderHook(() => useCheckoutOptions(defaultInput));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
	});
});
