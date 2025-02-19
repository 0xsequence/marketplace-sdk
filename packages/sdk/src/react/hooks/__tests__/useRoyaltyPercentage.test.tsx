import { describe, expect, it, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { useRoyaltyPercentage } from '../useRoyaltyPercentage';
import { renderHook, waitFor } from '../../_internal/test-utils';
import {
	createMockPublicClient,
	type MockPublicClient,
} from '../../_internal/test/mocks/publicClient';
import { getPublicRpcClient } from '../../../utils/get-public-rpc-client';

// Mock the getPublicRpcClient
vi.mock('../../../utils/get-public-rpc-client');

describe('useRoyaltyPercentage', () => {
	const mockAddress = '0x1234567890123456789012345678901234567890' as const;
	const mockArgs = {
		chainId: '1',
		collectionAddress: mockAddress,
		collectibleId: '1',
		query: {},
	};

	const mockRoyaltyAmount = 500n; // 5% royalty

	beforeEach(() => {
		// Reset all mocks before each test
		vi.resetAllMocks();

		// Create a mock public client with custom royaltyInfo implementation
		const mockPublicClient = createMockPublicClient({
			readContract: vi.fn().mockImplementation(async ({ functionName }) => {
				if (functionName === 'royaltyInfo') {
					return [
						mockAddress, // receiver address
						mockRoyaltyAmount, // royalty amount
					];
				}
				return [0n, 0n];
			}),
		});

		// Mock the getPublicRpcClient to return our mock client
		(getPublicRpcClient as Mock).mockReturnValue(mockPublicClient);
	});

	it('should fetch royalty percentage successfully', async () => {
		const { result } = renderHook(() => useRoyaltyPercentage(mockArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Verify the data matches our mock
		expect(result.current.data).toBeDefined();
		expect(result.current.data).toBe(mockRoyaltyAmount);
		expect(result.current.error).toBeNull();
	});

	it('should handle contract read error gracefully', async () => {
		// Override the mock to simulate a contract read error
		const mockPublicClient = createMockPublicClient({
			readContract: vi
				.fn()
				.mockRejectedValue(new Error('Contract read failed')),
		});
		(getPublicRpcClient as Mock).mockReturnValue(mockPublicClient);

		const { result } = renderHook(() => useRoyaltyPercentage(mockArgs));

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Should return 0 as specified in the hook implementation
		expect(result.current.data).toBe(0n);
		expect(result.current.isError).toBe(false);
	});

	it('should validate input parameters', async () => {
		// Using undefined as an invalid chain ID - this will fail Zod's string coercion
		const invalidArgs = {
			...mockArgs,
			chainId: undefined,
		};

		// @ts-expect-error - invalid args
		const { result } = renderHook(() => useRoyaltyPercentage(invalidArgs));

		// Wait for the query to complete
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// The query should fail with a validation error
		expect(result.current.isError).toBe(true);
		expect(result.current.error).toBeDefined();
	});

	it('should cache the royalty data', async () => {
		const { result, rerender } = renderHook(() =>
			useRoyaltyPercentage(mockArgs),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		const mockClient = getPublicRpcClient('1') as MockPublicClient;
		const mockReadContract = mockClient.readContract as Mock;
		// Record the number of calls to readContract
		const initialCalls = mockReadContract.mock.calls.length;

		// Trigger a rerender
		rerender();

		// Should have data immediately from cache
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBe(mockRoyaltyAmount);

		// Verify no additional contract calls were made
		const finalCalls = mockReadContract.mock.calls.length;
		expect(finalCalls).toBe(initialCalls);
	});
});
