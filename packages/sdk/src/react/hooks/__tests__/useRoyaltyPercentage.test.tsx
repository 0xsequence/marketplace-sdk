import { renderHook, waitFor } from '@test';
import { beforeEach, describe, expect, it } from 'vitest';
import { useRoyaltyPercentage } from '../useRoyaltyPercentage';
import { mockReadContract } from '@test/mocks/viem';
import { EIP2981_ABI } from '../../../utils';

describe('useRoyaltyPercentage', () => {
	const defaultArgs = {
		chainId: '1',
		collectionAddress:
			'0x1234567890123456789012345678901234567890' as `0x${string}`,
		collectibleId: '1',
		query: {},
	};

	beforeEach(() => {
		mockReadContract.mockReset();
	});

	it('should fetch royalty percentage successfully', async () => {
		mockReadContract.mockResolvedValueOnce([
			'0x1234567890123456789012345678901234567890',
			10n,
		]);

		const { result } = renderHook(() => useRoyaltyPercentage(defaultArgs));

		expect(result.current.isLoading).toBe(true);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data).toBe(10n);
		expect(mockReadContract).toHaveBeenCalledWith({
			address: defaultArgs.collectionAddress,
			abi: EIP2981_ABI,
			functionName: 'royaltyInfo',
			args: [BigInt(defaultArgs.collectibleId), 100n],
		});
	});

	it('should return 0n when contract read fails', async () => {
		mockReadContract.mockRejectedValueOnce(new Error('Contract read failed'));

		const { result } = renderHook(() => useRoyaltyPercentage(defaultArgs));

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data).toBe(0n);
	});

	it('should throw error for invalid collection address', async () => {
		const invalidArgs = {
			...defaultArgs,
			collectionAddress: 'not-a-valid-address' as `0x${string}`,
		};

		const { result } = renderHook(() => useRoyaltyPercentage(invalidArgs));

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
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
