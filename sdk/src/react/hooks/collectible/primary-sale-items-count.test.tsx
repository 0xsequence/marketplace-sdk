import * as MarketplaceMocks from '@0xsequence/api-client/mocks/marketplace';
import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { usePrimarySaleItemsCount } from './primary-sale-items-count';

const { mockMarketplaceEndpoint } = MarketplaceMocks;

describe('usePrimarySaleItemsCount', () => {
	const defaultParams = {
		chainId: 1,
		primarySaleContractAddress: '0x1234567890123456789012345678901234567890',
	};

	it('should fetch primary sale items count successfully', async () => {
		const mockResponse = { count: 42 };

		server.use(
			http.post(mockMarketplaceEndpoint('GetCountOfPrimarySaleItems'), () =>
				HttpResponse.json(mockResponse),
			),
		);

		const { result } = renderHook(() =>
			usePrimarySaleItemsCount(defaultParams),
		);

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data
		expect(result.current.data).toEqual(mockResponse);
		expect(result.current.error).toBeNull();
	});

	it('should handle filters correctly', async () => {
		const mockResponse = { count: 10 };
		let observedRequest: any;

		server.use(
			http.post(
				mockMarketplaceEndpoint('GetCountOfPrimarySaleItems'),
				async ({ request }) => {
					const body = await request.json();
					observedRequest = body;
					return HttpResponse.json(mockResponse);
				},
			),
		);

		const filter = {
			itemType: 'global',
			includeEmpty: false,
		} as const;

		const { result } = renderHook(() =>
			usePrimarySaleItemsCount({
				...defaultParams,
				filter,
			}),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(observedRequest.filter).toEqual(filter);
		expect(result.current.data).toEqual(mockResponse);
	});

	it('should handle error states', async () => {
		server.use(
			http.post(mockMarketplaceEndpoint('GetCountOfPrimarySaleItems'), () =>
				HttpResponse.json(
					{ error: { message: 'Failed to fetch count' } },
					{ status: 500 },
				),
			),
		);

		const { result } = renderHook(() =>
			usePrimarySaleItemsCount(defaultParams),
		);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should respect custom query options', async () => {
		const mockResponse = { count: 100 };

		server.use(
			http.post(mockMarketplaceEndpoint('GetCountOfPrimarySaleItems'), () =>
				HttpResponse.json(mockResponse),
			),
		);

		const { result } = renderHook(() =>
			usePrimarySaleItemsCount({
				...defaultParams,
				query: {
					enabled: true,
					staleTime: 60000,
				},
			}),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toEqual(mockResponse);
	});

	it('should not fetch when required params are missing', async () => {
		const incompleteParams = {
			chainId: 1,
			// Missing primarySaleContractAddress
		} as any;

		const { result } = renderHook(() =>
			usePrimarySaleItemsCount(incompleteParams),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isFetching).toBe(false);
		expect(result.current.data).toBeUndefined();
	});

	it('should handle query disabled state', async () => {
		const { result } = renderHook(() =>
			usePrimarySaleItemsCount({
				...defaultParams,
				query: {
					enabled: false,
				},
			}),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.isFetching).toBe(false);
		expect(result.current.data).toBeUndefined();
	});
});
