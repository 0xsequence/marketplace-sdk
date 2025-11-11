import { renderHook } from '@test';
import { avalanche, optimism } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMarketplaceConfig } from '../../../../../hooks';
import { useMarketPlatformFee } from '../useMarketPlatformFee';

// Mock dependencies
vi.mock('../../../../../hooks', () => ({
	useMarketplaceConfig: vi.fn(),
}));

describe('useMarketPlatformFee', () => {
	const defaultProps = {
		chainId: 1,
		collectionAddress: '0x123',
	};

	const defaultPlatformFeeRecipient =
		'0x858dB1cbF6D09D447C96A11603189b49B2D1C219';
	const avalancheAndOptimismPlatformFeeRecipient =
		'0x400cdab4676c17aec07e8ec748a5fc3b674bca41';

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return default fee when collection not found', () => {
		// Mock marketplace config with no matching collection
		(
			useMarketplaceConfig as unknown as ReturnType<typeof vi.fn>
		).mockReturnValue({
			data: {
				market: {
					collections: [
						{
							itemsAddress: '0x456',
							chainId: 1,
							feePercentage: '5.0',
							marketplaceType: 'market',
						},
					],
				},
			},
		});

		const { result } = renderHook(() => useMarketPlatformFee(defaultProps));

		// Default fee should be 2.5%, which is 250 in BPS (basis points)
		expect(result.current).toEqual({
			amount: 250n,
			receiver: defaultPlatformFeeRecipient,
		});
	});

	it('should return collection-specific fee when found in config', () => {
		const collectionFee = '5.0';
		const collectionAddress = '0x789';
		const chainId = 1;

		// Mock marketplace config with a matching collection
		(
			useMarketplaceConfig as unknown as ReturnType<typeof vi.fn>
		).mockReturnValue({
			data: {
				market: {
					collections: [
						{
							itemsAddress: collectionAddress,
							chainId: chainId.toString(),
							feePercentage: collectionFee,
							marketplaceType: 'market',
						},
					],
				},
			},
		});

		const { result } = renderHook(() =>
			useMarketPlatformFee({ chainId, collectionAddress }),
		);

		// 5.0% fee should be 500 in BPS (basis points)
		expect(result.current).toEqual({
			amount: 500n,
			receiver: defaultPlatformFeeRecipient,
		});
	});

	it('should use Avalanche/Optimism fee recipient for those chains', () => {
		// Test Avalanche chain
		const { result: avalancheResult } = renderHook(() =>
			useMarketPlatformFee({ ...defaultProps, chainId: avalanche.id }),
		);

		expect(avalancheResult.current.receiver).toBe(
			avalancheAndOptimismPlatformFeeRecipient,
		);

		// Test Optimism chain
		const { result: optimismResult } = renderHook(() =>
			useMarketPlatformFee({ ...defaultProps, chainId: optimism.id }),
		);

		expect(optimismResult.current.receiver).toBe(
			avalancheAndOptimismPlatformFeeRecipient,
		);
	});

	it('should handle case-insensitive collection address matching', () => {
		const collectionFee = '3.5';
		const collectionAddress = '0xABC123';
		const chainId = 1;

		// Mock marketplace config with a collection in different case
		(
			useMarketplaceConfig as unknown as ReturnType<typeof vi.fn>
		).mockReturnValue({
			data: {
				market: {
					collections: [
						{
							itemsAddress: collectionAddress.toLowerCase(),
							chainId: chainId.toString(),
							feePercentage: collectionFee,
							marketplaceType: 'market',
						},
					],
				},
			},
		});

		const { result } = renderHook(() =>
			useMarketPlatformFee({
				chainId,
				collectionAddress: collectionAddress.toUpperCase(),
			}),
		);

		// 3.5% fee should be 350 in BPS (basis points)
		expect(result.current).toEqual({
			amount: 350n,
			receiver: defaultPlatformFeeRecipient,
		});
	});
});
