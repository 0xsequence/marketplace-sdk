import * as MetadataMocks from '@0xsequence/api-client/mocks/metadata';
import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';

const { mockMetadataEndpoint } = MetadataMocks;

import { type UseFiltersParams, useFilters } from './useFilters';

describe('useFilters', () => {
	const defaultArgs: UseFiltersParams = {
		chainId: 1,
		collectionAddress: zeroAddress,
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

		expect(result.current.data).toBeDefined();
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockMetadataEndpoint('GetTokenMetadataPropertyFilters'), () => {
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

	it('should apply different filter exclusion rules', async () => {
		const { result } = renderHook(() => useFilters(defaultArgs));

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Verify that:
		// 1. "Sample" is excluded from Type filter
		// 2. Rarity filter is unchanged
		// 3. Filters are in the correct order
		expect(result.current.data).toMatchInlineSnapshot(`
			[
			  {
			    "name": "Type",
			    "type": "STRING",
			    "values": [
			      "Mock",
			      "Test",
			    ],
			  },
			  {
			    "name": "Rarity",
			    "type": "STRING",
			    "values": [
			      "Common",
			      "Uncommon",
			      "Rare",
			      "Epic",
			      "Legendary",
			    ],
			  },
			]
		`);
	});

	it('should return filter values in correct format', async () => {
		const { result } = renderHook(() => useFilters(defaultArgs));

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Verify filter structure and processing
		expect(result.current.data).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					name: expect.any(String),
					type: expect.any(String),
					values: expect.arrayContaining([expect.any(String)]),
				}),
			]),
		);

		// Verify that "Sample" is excluded from Type filter
		const typeFilter = result.current.data?.find((f) => f.name === 'Type');
		expect(typeFilter?.values).not.toContain('Sample');
	});
});
