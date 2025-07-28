import { PropertyType } from '@0xsequence/metadata';
import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import {
	mockMetadataEndpoint,
	mockTokenMetadata,
} from '../../../_internal/api/__mocks__/metadata.msw';
import type { UseSearchTokenMetadataParams } from './useSearchTokenMetadata';
import { useSearchTokenMetadata } from './useSearchTokenMetadata';

describe('useSearchTokenMetadata', () => {
	const defaultArgs: UseSearchTokenMetadataParams = {
		chainId: 1,
		collectionAddress: zeroAddress,
		filter: {
			text: 'test',
		},
	};

	const defaultArgsWithProperties: UseSearchTokenMetadataParams = {
		chainId: 1,
		collectionAddress: zeroAddress,
		filter: {
			properties: [
				{
					name: 'Rarity',
					type: PropertyType.STRING,
					values: ['Legendary'],
				},
				{
					name: 'Level',
					type: PropertyType.INT,
					min: 50,
					max: 100,
				},
			],
		},
	};

	it('should fetch metadata with text search successfully', async () => {
		const { result } = renderHook(() => useSearchTokenMetadata(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toBeDefined();
		expect(result.current.data?.tokenMetadata).toEqual([mockTokenMetadata]);
		expect(result.current.error).toBeNull();
	});

	it('should fetch metadata with property filters successfully', async () => {
		const { result } = renderHook(() =>
			useSearchTokenMetadata(defaultArgsWithProperties),
		);

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toBeDefined();
		expect(result.current.data?.tokenMetadata).toEqual([mockTokenMetadata]);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post(mockMetadataEndpoint('SearchTokenMetadata'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to search token metadata' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() => useSearchTokenMetadata(defaultArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should respect enabled option in query config', () => {
		const { result } = renderHook(() =>
			useSearchTokenMetadata({
				...defaultArgs,
				query: {
					enabled: false,
				},
			}),
		);

		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
	});
});
