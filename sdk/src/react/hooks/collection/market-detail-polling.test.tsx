import * as MarketplaceMocks from '@0xsequence/api-client/mocks/marketplace';
import { renderHook, server, testMarketplaceSdkConfig, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { describe, expect, it } from 'vitest';
import { CollectionStatus } from '../../_internal';
import {
	collectionMarketDetailPollingOptions,
	useCollectionMarketDetailPolling,
} from './market-detail-polling';

const { mockMarketplaceEndpoint } = MarketplaceMocks;

describe('collectionMarketDetailPollingOptions', () => {
	const defaultArgs = {
		chainId: 1,
		collectionAddress: zeroAddress,
	};

	const getRefetchInterval = (options: any) => options.refetchInterval;

	it('should return false if data status is terminal', () => {
		const options = collectionMarketDetailPollingOptions(
			defaultArgs,
			testMarketplaceSdkConfig,
		);
		const refetchInterval = getRefetchInterval(options);

		const terminalStatuses = [
			CollectionStatus.active,
			CollectionStatus.failed,
			CollectionStatus.inactive,
			CollectionStatus.incompatible_type,
		];

		terminalStatuses.forEach((status) => {
			const query = {
				state: {
					data: { status },
					dataUpdateCount: 0,
				},
			};
			expect(refetchInterval(query)).toBe(false);
		});
	});

	it('should return false if max attempts reached', () => {
		const options = collectionMarketDetailPollingOptions(
			defaultArgs,
			testMarketplaceSdkConfig,
		);
		const refetchInterval = getRefetchInterval(options);

		const query = {
			state: {
				data: { status: CollectionStatus.unknown },
				dataUpdateCount: 29, // currentAttempt will be 30
			},
		};
		expect(refetchInterval(query)).toBe(false);
	});

	it('should return exponential backoff interval', () => {
		const options = collectionMarketDetailPollingOptions(
			defaultArgs,
			testMarketplaceSdkConfig,
		);
		const refetchInterval = getRefetchInterval(options);

		// Attempt 1
		let query = {
			state: {
				data: { status: CollectionStatus.unknown },
				dataUpdateCount: 0, // currentAttempt = 1
			},
		};
		// 2000 * 1.5^1 = 3000
		expect(refetchInterval(query)).toBe(3000);

		// Attempt 2
		query = {
			state: {
				data: { status: CollectionStatus.unknown },
				dataUpdateCount: 1, // currentAttempt = 2
			},
		};
		// 2000 * 1.5^2 = 4500
		expect(refetchInterval(query)).toBe(4500);
	});

	it('should cap interval at MAX_POLLING_INTERVAL', () => {
		const options = collectionMarketDetailPollingOptions(
			defaultArgs,
			testMarketplaceSdkConfig,
		);
		const refetchInterval = getRefetchInterval(options);

		const query = {
			state: {
				data: { status: CollectionStatus.unknown },
				dataUpdateCount: 20, // High enough to exceed 30000
			},
		};
		expect(refetchInterval(query)).toBe(30000);
	});
});

describe('useCollectionMarketDetailPolling', () => {
	const mockCollectionAddress = '0x1234567890123456789012345678901234567890';
	const defaultArgs = {
		chainId: 1,
		collectionAddress: mockCollectionAddress as `0x${string}`,
	};

	it('should fetch collection details', async () => {
		const { result } = renderHook(() =>
			useCollectionMarketDetailPolling(defaultArgs),
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data).toBeDefined();
		expect(result.current.data?.contractAddress).toBe(mockCollectionAddress);
	});

	it('should handle errors', async () => {
		server.use(
			http.post(mockMarketplaceEndpoint('GetCollectionDetail'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() =>
			useCollectionMarketDetailPolling(defaultArgs),
		);

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});
	});
});
