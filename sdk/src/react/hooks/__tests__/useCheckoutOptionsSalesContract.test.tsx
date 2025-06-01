import { renderHook, waitFor } from '@test';
import { describe, expect, it } from 'vitest';
import { useCheckoutOptionsSalesContract } from '../useCheckoutOptionsSalesContract';

describe('useCheckoutOptionsSalesContract', () => {
	it('should fetch checkout options for sales contract', async () => {
		const { result } = renderHook(() =>
			useCheckoutOptionsSalesContract({
				chainId: 1,
				contractAddress: '0x1234567890123456789012345678901234567890',
				collectionAddress: '0x0987654321098765432109876543210987654321',
				items: [
					{
						tokenId: '1',
						quantity: '1',
					},
				],
			}),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.data?.options).toBeDefined();
	});

	it('should support query options', async () => {
		const { result } = renderHook(() =>
			useCheckoutOptionsSalesContract({
				chainId: 1,
				contractAddress: '0x1234567890123456789012345678901234567890',
				collectionAddress: '0x0987654321098765432109876543210987654321',
				items: [
					{
						tokenId: '1',
						quantity: '1',
					},
				],
				query: {
					enabled: false,
				},
			}),
		);

		// Should not fetch when disabled
		expect(result.current.isPending).toBe(true);
		expect(result.current.data).toBeUndefined();
	});

	it('should handle multiple items', async () => {
		const { result } = renderHook(() =>
			useCheckoutOptionsSalesContract({
				chainId: 1,
				contractAddress: '0x1234567890123456789012345678901234567890',
				collectionAddress: '0x0987654321098765432109876543210987654321',
				items: [
					{
						tokenId: '1',
						quantity: '1',
					},
					{
						tokenId: '2',
						quantity: '2',
					},
				],
			}),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.data?.options).toBeDefined();
	});
});
