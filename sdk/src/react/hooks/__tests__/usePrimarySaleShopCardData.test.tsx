import { renderHook, waitFor } from '@test';
import { describe, expect, it } from 'vitest';
import { usePrimarySaleShopCardData } from '../usePrimarySaleShopCardData';

describe('usePrimarySaleShopCardData', () => {
	it('should fetch primary sale items and transform to shop card format', async () => {
		const { result } = renderHook(() =>
			usePrimarySaleShopCardData({
				chainId: 1,
				primarySaleContractAddress:
					'0x1234567890123456789012345678901234567890',
				collectionAddress: '0x0987654321098765432109876543210987654321',
			}),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.collectibleCards).toBeDefined();
		expect(result.current.collectibleCards).toHaveLength(1);

		const firstCard = result.current.collectibleCards[0];
		expect(firstCard?.collectibleId).toBe('1');
		expect(firstCard?.marketplaceType).toBe('shop');
		expect(firstCard?.salePrice).toBeDefined();
		expect(firstCard?.salePrice?.amount).toBe('100000000000000000');
		expect(firstCard?.quantityInitial).toBe('1000');
	});

	it('should provide sale price from first item', async () => {
		const { result } = renderHook(() =>
			usePrimarySaleShopCardData({
				chainId: 1,
				primarySaleContractAddress:
					'0x1234567890123456789012345678901234567890',
				collectionAddress: '0x0987654321098765432109876543210987654321',
			}),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.salePrice).toBeDefined();
		expect(result.current.salePrice?.amount).toBe('100000000000000000');
	});

	it('should support query options', async () => {
		const { result } = renderHook(() =>
			usePrimarySaleShopCardData({
				chainId: 1,
				primarySaleContractAddress:
					'0x1234567890123456789012345678901234567890',
				collectionAddress: '0x0987654321098765432109876543210987654321',
				enabled: false,
			}),
		);

		expect(result.current.collectibleCards).toEqual([]);
		expect(result.current.salePrice).toBeUndefined();
	});

	it('should handle results properly', async () => {
		const { result } = renderHook(() =>
			usePrimarySaleShopCardData({
				chainId: 1,
				primarySaleContractAddress:
					'0x1234567890123456789012345678901234567890',
				collectionAddress: '0x0987654321098765432109876543210987654321',
			}),
		);

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Mock always returns data, so we expect cards to be populated
		expect(result.current.collectibleCards.length).toBeGreaterThanOrEqual(1);
		expect(result.current.salePrice).toBeDefined();
	});
});
