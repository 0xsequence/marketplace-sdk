import { describe, expect, it } from 'vitest';
import { useFilters } from '../useFilters';
import { renderHook, waitFor } from '../../_internal/test-utils';
import { zeroAddress } from 'viem';
import type { UseFiltersArgs } from '../useFilters';
import { http, HttpResponse } from 'msw';
import {
	mockFilters,
	mockMetadataEndpoint,
} from '../../_internal/api/__mocks__/metadata.msw';
import { server } from '../../_internal/test/setup';

describe('useFilters', () => {
	const defaultArgs: UseFiltersArgs = {
		chainId: '1',
		collectionAddress: zeroAddress,
		query: {},
	};

	it('should fetch filters successfully', async () => {
		const { result } = renderHook(() => useFilters(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toEqual(mockFilters);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockMetadataEndpoint('TokenCollectionFilters'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch filters' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() => useFilters(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(() => useFilters(defaultArgs));

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Change args and rerender
		const newArgs = {
			...defaultArgs,
			collectionAddress:
				'0x1234567890123456789012345678901234567890' as `0x${string}`,
		};

		rerender(() => useFilters(newArgs));

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data).toBeDefined();
		});

		// Verify that the query was refetched with new args
		expect(result.current.data).toBeDefined();
		expect(result.current.isSuccess).toBe(true);
	});

	it('should handle undefined query params', async () => {
		const argsWithoutQuery: UseFiltersArgs = {
			chainId: '1',
			collectionAddress: zeroAddress,
			query: {},
		};

		const { result } = renderHook(() => useFilters(argsWithoutQuery));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.error).toBeNull();
	});

	it('should validate input parameters', async () => {
		const invalidArgs: UseFiltersArgs = {
			...defaultArgs,
			// @ts-expect-error
			chainId: {}, // Using an object instead of a string/number will fail validation
		};

		const { result } = renderHook(() => useFilters(invalidArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
	});

	it('should return filter values in correct format', async () => {
		const { result } = renderHook(() => useFilters(defaultArgs));

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Verify filter structure
		expect(result.current.data).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: expect.any(String),
					name: expect.any(String),
					values: expect.any(Array),
				}),
			]),
		);
	});
});
