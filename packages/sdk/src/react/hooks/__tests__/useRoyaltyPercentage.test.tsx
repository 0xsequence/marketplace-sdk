import { renderHook, waitFor } from '@test';
import { describe, expect, it } from 'vitest';
import { useRoyaltyPercentage } from '../useRoyaltyPercentage';
import { TEST_COLLECTIBLE } from '../../../../test/const';

describe('useRoyaltyPercentage', () => {
	it('should fetch royalty percentage successfully', async () => {
		// Collection with this parameters has a royalty percentage of 10%
		const { result } = renderHook(() => useRoyaltyPercentage(TEST_COLLECTIBLE));

		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();

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
			...TEST_COLLECTIBLE,
			collectionAddress: 'not-a-valid-address' as `0x${string}`,
		};

		const { result } = renderHook(() => useRoyaltyPercentage(invalidArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
			expect(result.current.error).toBeDefined();
			expect(result.current.error?.shortMessage).toBe(
				'Address "not-a-valid-address" is invalid.',
			);
		});
	});

	it('should handle invalid chain ID', async () => {
		const invalidArgs = {
			...TEST_COLLECTIBLE,
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
