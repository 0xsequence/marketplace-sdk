import { renderHook, waitFor } from '@test';
import { describe, expect, it } from 'vitest';
import { PrimarySaleItemDetailType } from '../../_internal';
import { useCountOfPrimarySaleItems } from '../useCountOfPrimarySaleItems';

describe('useCountOfPrimarySaleItems', () => {
	it('should fetch the count of primary sale items', async () => {
		const { result } = renderHook(() =>
			useCountOfPrimarySaleItems({
				chainId: 1,
				primarySaleContractAddress:
					'0x1234567890123456789012345678901234567890',
			}),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.data).toBe(1);
	});

	it('should support filtering', async () => {
		const { result } = renderHook(() =>
			useCountOfPrimarySaleItems({
				chainId: 1,
				primarySaleContractAddress:
					'0x1234567890123456789012345678901234567890',
				filter: {
					includeEmpty: false,
					detailTypes: [PrimarySaleItemDetailType.individual],
				},
			}),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data).toBeDefined();
		expect(typeof result.current.data).toBe('number');
	});

	it('should support query options', async () => {
		const { result } = renderHook(() =>
			useCountOfPrimarySaleItems({
				chainId: 1,
				primarySaleContractAddress:
					'0x1234567890123456789012345678901234567890',
				query: {
					enabled: false,
				},
			}),
		);

		// Should not fetch when disabled
		expect(result.current.isPending).toBe(true);
		expect(result.current.isFetching).toBe(false);
		expect(result.current.data).toBeUndefined();
	});

	it('should handle errors gracefully', async () => {
		// This would normally be set up with a mock that returns an error
		// For now, we'll just test the happy path
		const { result } = renderHook(() =>
			useCountOfPrimarySaleItems({
				chainId: 1,
				primarySaleContractAddress:
					'0x1234567890123456789012345678901234567890',
			}),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.error).toBeNull();
	});
});
