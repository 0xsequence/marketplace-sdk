import { renderHook, waitFor } from '@test';
import { describe, expect, it } from 'vitest';
import { TEST_COLLECTIBLE } from '../../../../test/const';
import type { ChainId } from '../../_internal';
import { useRoyalty } from '../useRoyalty';

describe('useRoyaltyPercentage', () => {
	it('should fetch royalty percentage successfully', async () => {
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

		expect(result.current.data).toMatchSnapshot([
			'0x8caA7E1431C5ad8583aE1734B61A41915Bf26f27',
			5n,
		]); // [recipient, percentage]
		expect(result.current.error).toBeNull();
	});

	it('should throw error for invalid collection address', async () => {
		const invalidArgs = {
			...TEST_COLLECTIBLE,
			collectionAddress: 'not-a-valid-address' as `0x${string}`,
		};

		const { result } = renderHook(() => useRoyalty(invalidArgs));

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
			collectionAddress: 'invalid-collection-address' as `0x${string}`,
			chainId: 'invalid-chain-id' as ChainId,
			collectibleId: '1',
		};

		// @ts-expect-error - This will fail Zod validation
		const { result } = renderHook(() => useRoyalty(invalidArgs));

		expect(result.current.isLoading).toBe(true);

		await waitFor(
			() => {
				expect(result.current.isLoading).toBe(false);
			},
			{ timeout: 1000000 },
		);

		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeDefined();
	});
});
