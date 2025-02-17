import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeAll, afterAll, afterEach } from 'vitest';
import { useCollection } from '../useCollection';
import { TestWrapper } from '../../_internal/test/TestWrapper';
import { zeroAddress } from 'viem';
import type { UseCollectionArgs } from '../useCollection';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { mockContractInfo } from '../../_internal/api/__mocks__/metadata.msw';

const server = setupServer(
	http.post('*/rpc/Metadata/GetContractInfo', () => {
		return HttpResponse.json({
			contractInfo: mockContractInfo,
		});
	}),
);

describe('useCollection', () => {
	beforeAll(() => server.listen());
	afterEach(() => server.resetHandlers());
	afterAll(() => server.close());

	const defaultArgs: UseCollectionArgs = {
		chainId: '1',
		collectionAddress: zeroAddress,
		query: {},
	};

	it('should fetch collection data successfully', async () => {
		const { result } = renderHook(() => useCollection(defaultArgs), {
			wrapper: TestWrapper,
		});

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toEqual(mockContractInfo);
		expect(result.current.error).toBeNull();
	});

	it('should handle error states', async () => {
		// Override the handler for this test to return an error
		server.use(
			http.post('*/rpc/Metadata/GetContractInfo', () => {
				return new HttpResponse(null, { status: 400 });
			}),
		);

		const invalidArgs = {
			...defaultArgs,
			chainId: 'invalid', // This should cause validation error
		};

		const { result } = renderHook(() => useCollection(invalidArgs), {
			wrapper: TestWrapper,
		});

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should refetch when args change', async () => {
		const { result, rerender } = renderHook(
			(props: UseCollectionArgs) => useCollection(props),
			{
				wrapper: TestWrapper,
				initialProps: defaultArgs,
			},
		);

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Change props and rerender
		const newArgs: UseCollectionArgs = {
			...defaultArgs,
			collectionAddress:
				'0x1234567890123456789012345678901234567890' as `0x${string}`,
		};

		rerender(newArgs);

		// Should be loading again
		expect(result.current.isLoading).toBe(true);

		// Wait for new data
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeDefined();
	});

	it('should handle undefined query params', async () => {
		const argsWithoutQuery: UseCollectionArgs = {
			chainId: '1',
			collectionAddress: zeroAddress,
			query: {},
		};

		const { result } = renderHook(() => useCollection(argsWithoutQuery), {
			wrapper: TestWrapper,
		});

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.error).toBeNull();
	});
});
