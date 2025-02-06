import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFees } from '../useFees';
import { useMarketplaceConfig } from '../../../../../hooks';
import { avalanche, optimism } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// Mock dependencies
vi.mock('../../../../../hooks', () => ({
	useMarketplaceConfig: vi.fn(),
}));

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});
	return ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe('useFees', () => {
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
				collections: [
					{
						collectionAddress: '0x456',
						chainId: '1',
						marketplaceFeePercentage: '5.0',
					},
				],
			},
		});

		const { result } = renderHook(() => useFees(defaultProps), {
			wrapper: createWrapper(),
		});

		// Default fee should be 2.5%, which is 250 in BPS (basis points)
		expect(result.current).toEqual({
			amount: '250',
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
				collections: [
					{
						collectionAddress,
						chainId: chainId.toString(),
						marketplaceFeePercentage: collectionFee,
					},
				],
			},
		});

		const { result } = renderHook(
			() => useFees({ chainId, collectionAddress }),
			{
				wrapper: createWrapper(),
			},
		);

		// 5.0% fee should be 500 in BPS (basis points)
		expect(result.current).toEqual({
			amount: '500',
			receiver: defaultPlatformFeeRecipient,
		});
	});

	it('should use Avalanche/Optimism fee recipient for those chains', () => {
		// Test Avalanche chain
		const { result: avalancheResult } = renderHook(
			() => useFees({ ...defaultProps, chainId: avalanche.id }),
			{
				wrapper: createWrapper(),
			},
		);

		expect(avalancheResult.current.receiver).toBe(
			avalancheAndOptimismPlatformFeeRecipient,
		);

		// Test Optimism chain
		const { result: optimismResult } = renderHook(
			() => useFees({ ...defaultProps, chainId: optimism.id }),
			{
				wrapper: createWrapper(),
			},
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
				collections: [
					{
						collectionAddress: collectionAddress.toLowerCase(),
						chainId: chainId.toString(),
						marketplaceFeePercentage: collectionFee,
					},
				],
			},
		});

		const { result } = renderHook(
			() =>
				useFees({
					chainId,
					collectionAddress: collectionAddress.toUpperCase(),
				}),
			{
				wrapper: createWrapper(),
			},
		);

		// 3.5% fee should be 350 in BPS (basis points)
		expect(result.current).toEqual({
			amount: '350',
			receiver: defaultPlatformFeeRecipient,
		});
	});
});
