import { renderHook, waitFor } from '@test';
import { describe, expect, it } from 'vitest';
import { TEST_COLLECTIBLE } from '../../../../test/const';
import { useRoyalty } from '../useRoyalty';

describe('useRoyaltyPercentage', () => {
	it('should fetch royalty percentage successfully', async () => {
		// Collection with this parameters has a royalty percentage of 5%
		const { result } = renderHook(() => useRoyalty(TEST_COLLECTIBLE));

		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeNull();

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

	it('should handle invalid args', async () => {
		const invalidArgs = {
			collectionAddress: 'invalid-collection-address' as `0x${string}`,
			chainId: 'invalid-chain-id',
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

		expect(result.current.data).toBeNull();
		expect(result.current.error).toBeDefined();
	});
});
