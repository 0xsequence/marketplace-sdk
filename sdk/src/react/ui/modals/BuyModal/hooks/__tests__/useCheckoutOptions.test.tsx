import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MarketplaceKind } from '../../../../../_internal';
import { mockMarketplaceEndpoint } from '../../../../../_internal/api/__mocks__/marketplace.msw';
import { TransactionCrypto } from '../../../../../_internal/api/marketplace.gen';
import { useCheckoutOptions } from '../useCheckoutOptions';
import { useMarketPlatformFee } from '../useMarketPlatformFee';

// Mock dependencies
vi.mock('wagmi', async () => {
	const actual = await vi.importActual('wagmi');
	return {
		...actual,
		useAccount: vi.fn(() => ({
			address: zeroAddress,
		})),
	};
});
vi.mock('../useMarketPlatformFee');

describe('useCheckoutOptions', () => {
	const defaultInput = {
		chainId: 1,
		collectionAddress: zeroAddress,
		orderId: '123',
		marketplace: MarketplaceKind.sequence_marketplace_v2,
	};

	beforeEach(() => {
		vi.clearAllMocks();

		// Set up default fees mock
		vi.mocked(useMarketPlatformFee).mockReturnValue({
			amount: '100000000000000000',
			receiver: zeroAddress,
		});
	});

	it('should include fees in the API request', async () => {
		const mockFeeAmount = '200000000000000000';
		vi.mocked(useMarketPlatformFee).mockReturnValue({
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

	it('should not fetch when wallet is not connected', async () => {
		const { useAccount } = vi.mocked(await import('wagmi'));
		useAccount.mockReturnValue({
			address: undefined,
		} as any);

		const { result } = renderHook(() => useCheckoutOptions(defaultInput));

		// Should not be loading or have data when no wallet is connected
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.isError).toBe(false);
	});
});
