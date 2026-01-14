import { MarketplaceKind, StepType } from '@0xsequence/api-client';
import * as MarketplaceMocks from '@0xsequence/api-client/mocks/marketplace';
import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMarketTransactionSteps } from './useMarketTransactionSteps';

const { mockMarketplaceEndpoint, createMockSteps } = MarketplaceMocks;

describe('useMarketTransactionSteps', () => {
	const mockParams = {
		chainId: 1,
		collectionAddress: zeroAddress,
		buyer: zeroAddress,
		marketplace: MarketplaceKind.sequence_marketplace_v2,
		orderId: '1',
		tokenId: 1n,
		quantity: 1n,
		additionalFees: [],
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should generate steps successfully', async () => {
		// Mock the API response
		const mockSteps = createMockSteps([StepType.tokenApproval, StepType.buy]);
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateBuyTransaction'), async () => {
				return HttpResponse.json({
					steps: mockSteps,
					resp: { canBeUsedWithTrails: true },
				});
			}),
		);

		const { result } = renderHook(() => useMarketTransactionSteps(mockParams));

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data?.steps).toHaveLength(2);
		expect(result.current.data?.canBeUsedWithTrails).toBe(true);
	});

	it('should verify checkoutMode configuration', async () => {
		// We'll spy on the request to verify the payload
		const requestSpy = vi.fn();

		server.use(
			http.post(
				mockMarketplaceEndpoint('GenerateBuyTransaction'),
				async ({ request }) => {
					const body = await request.json();
					requestSpy(body);
					return HttpResponse.json({
						steps: [],
						resp: { canBeUsedWithTrails: true },
					});
				},
			),
		);

		// Test default behavior (should be true for trails)
		const { result, unmount } = renderHook(() =>
			useMarketTransactionSteps(mockParams),
		);

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(requestSpy).toHaveBeenLastCalledWith(
			expect.objectContaining({
				useWithTrails: true,
			}),
		);

		unmount();
	});

	it('should not run when disabled', async () => {
		const { result } = renderHook(() =>
			useMarketTransactionSteps({ ...mockParams, enabled: false }),
		);

		expect(result.current.isPending).toBe(true);
		expect(result.current.fetchStatus).toBe('idle');
	});

	it('should handle API errors', async () => {
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateBuyTransaction'), () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);

		const { result } = renderHook(() => useMarketTransactionSteps(mockParams));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});
	});
});
