import { renderHook, waitFor } from '@test';
import { describe, expect, it } from 'vitest';
import { useRoyaltyPercentage } from '../useRoyaltyPercentage';

describe('useRoyaltyPercentage', () => {
	// this collection has a royalty percentage of 3%
	const defaultArgs = {
		chainId: '137',
		collectionAddress:
			'0x46a1d82dc33f4e598e38ec0e409a94100f0f806d' as `0x${string}`,
		collectibleId: '0',
	};

	it('should fetch royalty percentage successfully', async () => {
		const { result } = renderHook(() => useRoyaltyPercentage(defaultArgs));

		// Initially loading
		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

		// Wait for data to be loaded
		await waitFor(
			() => {
				expect(result.current.isLoading).toBe(false);
			},
			{ timeout: 1000000 },
		);

		console.log('result.current.data', result.current.data);
	});

	it('should throw error for invalid collection address', async () => {
		const invalidArgs = {
			...defaultArgs,
			collectionAddress: 'not-a-valid-address' as `0x${string}`,
		};

		const { result } = renderHook(() => useRoyaltyPercentage(invalidArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
			expect(result.current.error).toBeDefined();
		});
	});

	it('should handle invalid chain ID', async () => {
		const invalidArgs = {
			...defaultArgs,
			chainId: null,
		};

		// @ts-expect-error - This will fail Zod validation
		const { result } = renderHook(() => useRoyaltyPercentage(invalidArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
			expect(result.current.error).toBeDefined();
		});
	});
});
