import { renderHook, waitFor } from '@test';
import { describe, expect, it } from 'vitest';
import { PrimarySaleItemDetailType } from '../../_internal';
import { useListPrimarySaleItems } from '../useListPrimarySaleItems';

describe('useListPrimarySaleItems', () => {
	it('should fetch primary sale items', async () => {
		const { result } = renderHook(() =>
			useListPrimarySaleItems({
				chainId: 1,
				primarySaleContractAddress:
					'0x1234567890123456789012345678901234567890',
			}),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.data?.pages).toBeDefined();
		expect(result.current.data?.pages[0]).toBeDefined();
		expect(result.current.data?.pages[0].primarySaleItems).toBeDefined();
		expect(result.current.data?.pages[0].primarySaleItems).toHaveLength(1);

		const firstItem = result.current.data?.pages[0].primarySaleItems[0];
		expect(firstItem?.metadata.tokenId).toBe('1');
		expect(firstItem?.primarySaleItem.contractType).toBe('ERC721');
		expect(firstItem?.primarySaleItem.itemType).toBe(
			PrimarySaleItemDetailType.individual,
		);
		expect(firstItem?.primarySaleItem.priceAmount).toBe('100000000000000000');
		expect(firstItem?.primarySaleItem.priceAmountFormatted).toBe('0.1');
		expect(firstItem?.primarySaleItem.supplyCap).toBe('1000');
	});

	it('should support filtering', async () => {
		const { result } = renderHook(() =>
			useListPrimarySaleItems({
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
		expect(result.current.data?.pages[0].primarySaleItems).toBeDefined();
	});

	it('should support query options', async () => {
		const { result } = renderHook(() =>
			useListPrimarySaleItems({
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
		expect(result.current.isFetchingNextPage).toBe(false);
		expect(result.current.data).toBeUndefined();
	});

	it('should support pagination', async () => {
		const { result } = renderHook(() =>
			useListPrimarySaleItems({
				chainId: 1,
				primarySaleContractAddress:
					'0x1234567890123456789012345678901234567890',
			}),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.hasNextPage).toBe(false);
		expect(result.current.fetchNextPage).toBeDefined();
		expect(result.current.isFetchingNextPage).toBe(false);
	});
});
