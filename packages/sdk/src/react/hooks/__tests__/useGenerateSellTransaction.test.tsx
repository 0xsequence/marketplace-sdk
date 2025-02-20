import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useGenerateSellTransaction } from '../useGenerateSellTransaction';
import { renderHook, waitFor } from '../../_internal/test-utils';
import { zeroAddress } from 'viem';
import { http, HttpResponse } from 'msw';
import {
	mockSteps,
	mockMarketplaceEndpoint,
} from '../../_internal/api/__mocks__/marketplace.msw';
import { server } from '../../_internal/test/setup';
import {
	ContractType,
	OrderbookKind,
	MarketplaceKind,
} from '../../_internal/api/marketplace.gen';
import { useConfig } from '../useConfig';
import type { SdkConfig } from '../../../types';

// Mock useConfig hook
vi.mock('../useConfig');

describe('useGenerateSellTransaction', () => {
	const mockOnSuccess = vi.fn();

	const mockConfig: SdkConfig = {
		projectId: 'test-project',
		projectAccessKey: 'test-access-key',
	};

	const mockOrderData = {
		orderId: '1',
		quantity: '1',
	};

	const mockTransactionProps = {
		collectionAddress: zeroAddress,
		seller: zeroAddress,
		contractType: ContractType.ERC721,
		orderbook: OrderbookKind.sequence_marketplace_v2,
		marketplace: MarketplaceKind.sequence_marketplace_v2,
		ordersData: [mockOrderData],
		additionalFees: [],
	};

	const defaultArgs = {
		chainId: '1' as const,
		onSuccess: mockOnSuccess,
	};

	beforeEach(() => {
		vi.clearAllMocks();

		// Set up the mock implementation for useConfig
		vi.mocked(useConfig).mockReturnValue(mockConfig);

		// Mock default steps response
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateSellTransaction'), () => {
				return HttpResponse.json({
					steps: mockSteps,
				});
			}),
		);
	});

	it('should generate sell transaction successfully', async () => {
		const { result } = renderHook(() =>
			useGenerateSellTransaction(defaultArgs),
		);

		await result.current.generateSellTransactionAsync(mockTransactionProps);

		expect(mockOnSuccess).toHaveBeenCalledWith(
			mockSteps,
			mockTransactionProps,
			undefined,
		);
	});

	it('should handle async generation with await', async () => {
		const { result } = renderHook(() =>
			useGenerateSellTransaction(defaultArgs),
		);

		const steps =
			await result.current.generateSellTransactionAsync(mockTransactionProps);

		expect(steps).toEqual(mockSteps);
	});

	it('should handle non-async generation with callback', async () => {
		const { result } = renderHook(() =>
			useGenerateSellTransaction(defaultArgs),
		);

		result.current.generateSellTransaction(mockTransactionProps);

		await waitFor(() => {
			expect(mockOnSuccess).toHaveBeenCalledWith(
				mockSteps,
				mockTransactionProps,
				undefined,
			);
		});
	});

	it('should handle API errors', async () => {
		// Mock error response
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateSellTransaction'), () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);

		const { result } = renderHook(() =>
			useGenerateSellTransaction(defaultArgs),
		);

		await expect(
			result.current.generateSellTransactionAsync(mockTransactionProps),
		).rejects.toThrow();

		expect(mockOnSuccess).not.toHaveBeenCalled();
	});

	it('should use provided config from useConfig hook', async () => {
		const customConfig: SdkConfig = {
			projectId: 'custom-project',
			projectAccessKey: 'custom-access-key',
		};

		let requestHeaders: Headers | undefined;

		server.use(
			http.post(
				mockMarketplaceEndpoint('GenerateSellTransaction'),
				async ({ request }) => {
					requestHeaders = request.headers;
					return HttpResponse.json({ steps: mockSteps });
				},
			),
		);

		vi.mocked(useConfig).mockReturnValue(customConfig);

		const { result } = renderHook(() =>
			useGenerateSellTransaction(defaultArgs),
		);
		await result.current.generateSellTransactionAsync(mockTransactionProps);

		expect(requestHeaders?.get('x-access-key')).toBe(
			customConfig.projectAccessKey,
		);
	});

	it('should handle invalid sell data', async () => {
		const invalidOrderData = {
			orderId: '1',
			quantity: 'invalid-quantity',
		};

		server.use(
			http.post(mockMarketplaceEndpoint('GenerateSellTransaction'), () => {
				return new HttpResponse(null, { status: 400 });
			}),
		);

		const { result } = renderHook(() =>
			useGenerateSellTransaction(defaultArgs),
		);

		await expect(
			result.current.generateSellTransactionAsync({
				...mockTransactionProps,
				ordersData: [invalidOrderData],
			}),
		).rejects.toThrow();

		expect(mockOnSuccess).not.toHaveBeenCalled();
	});
});
