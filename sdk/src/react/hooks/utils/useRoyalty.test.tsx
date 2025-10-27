import { renderHook, waitFor } from '@test';
import { readContract } from 'viem/actions';
import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TEST_COLLECTIBLE } from '../../../../test/const';
import { useRoyalty } from './useRoyalty';

// Mock viem's readContract function
vi.mock('viem/actions', () => ({
	readContract: vi.fn(),
}));

const mockReadContract = readContract as Mock;

describe('useRoyalty', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it('should fetch royalty percentage successfully', async () => {
		// Mock successful contract call
		mockReadContract.mockResolvedValue([
			'0x8caA7E1431C5ad8583aE1734B61A41915Bf26f27', // recipient
			5n, // percentage
		]);

		// Collection with this parameters has a royalty percentage of 5%
		const { result } = renderHook(() => useRoyalty(TEST_COLLECTIBLE));

		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		await waitFor(
			() => {
				expect(result.current.isLoading).toBe(false);
			},
			{ timeout: 1000000 },
		);

		expect(result.current.data).toMatchInlineSnapshot(`
			{
			  "percentage": 5n,
			  "recipient": "0x8caA7E1431C5ad8583aE1734B61A41915Bf26f27",
			}
		`);
	});

	it('should return null when contract returns empty values', async () => {
		// Mock contract call returning empty/null values
		mockReadContract.mockResolvedValue([null, null]);

		const { result } = renderHook(() => useRoyalty(TEST_COLLECTIBLE));

		expect(result.current.isLoading).toBe(true);

		await waitFor(
			() => {
				expect(result.current.isLoading).toBe(false);
			},
			{ timeout: 10000 },
		);

		expect(result.current.data).toBe(null);
		expect(result.current.error).toBe(null);
	});

	it('should handle contract call errors and propagate them', async () => {
		const contractError = new Error(
			'Contract call failed: invalid function selector',
		);
		mockReadContract.mockRejectedValue(contractError);

		const { result } = renderHook(() => useRoyalty(TEST_COLLECTIBLE));

		expect(result.current.isLoading).toBe(true);

		await waitFor(
			() => {
				expect(result.current.isLoading).toBe(false);
			},
			{ timeout: 10000 },
		);

		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBe(contractError);
	});

	it('should handle network/RPC errors', async () => {
		const networkError = new Error('Network request failed');
		mockReadContract.mockRejectedValue(networkError);

		const { result } = renderHook(() => useRoyalty(TEST_COLLECTIBLE));

		expect(result.current.isLoading).toBe(true);

		await waitFor(
			() => {
				expect(result.current.isLoading).toBe(false);
			},
			{ timeout: 10000 },
		);

		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBe(networkError);
	});

	it('should handle invalid contract address errors', async () => {
		const invalidAddressError = new Error('Invalid contract address');
		mockReadContract.mockRejectedValue(invalidAddressError);

		const { result } = renderHook(() =>
			useRoyalty({
				...TEST_COLLECTIBLE,
				collectionAddress: '0xinvalid' as any,
			}),
		);

		expect(result.current.isLoading).toBe(true);

		await waitFor(
			() => {
				expect(result.current.isLoading).toBe(false);
			},
			{ timeout: 10000 },
		);

		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBe(invalidAddressError);
	});

	it('should handle contract not supporting EIP-2981', async () => {
		const unsupportedError = new Error('Function does not exist');
		mockReadContract.mockRejectedValue(unsupportedError);

		const { result } = renderHook(() => useRoyalty(TEST_COLLECTIBLE));

		expect(result.current.isLoading).toBe(true);

		await waitFor(
			() => {
				expect(result.current.isLoading).toBe(false);
			},
			{ timeout: 10000 },
		);

		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBe(unsupportedError);
	});
});
