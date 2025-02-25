import { waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SdkConfig } from '../../../types';
import {
	mockCollectibleOrder,
	mockMarketplaceEndpoint,
} from '../../_internal/api/__mocks__/marketplace.msw';
import { OrderSide } from '../../_internal/api/marketplace.gen';
import { renderHook } from '../../_internal/test-utils';
import { server } from '../../_internal/test/setup';
import { useConfig } from '../useConfig';
import { useListCollectiblesPaginated } from '../useListCollectiblesPaginated';
import type { UseListCollectiblesPaginatedArgs } from '../useListCollectiblesPaginated';

// Mock useConfig hook
vi.mock('../useConfig');

describe('useListCollectiblesPaginated', () => {
	const defaultArgs: UseListCollectiblesPaginatedArgs = {
		chainId: '1',
		collectionAddress: zeroAddress,
		side: OrderSide.listing,
		query: {
			enabled: true,
			page: 1,
			pageSize: 30,
		},
	};

	// Mock config with required devAccessKey
	const mockConfig: SdkConfig = {
		projectId: 'test-project',
		projectAccessKey: 'test-access-key',
		_internal: {
			devAccessKey: 'test-dev-access-key',
			marketplaceEnv: 'development',
		},
	};

	beforeEach(() => {
		// Set up the mock implementation for useConfig
		vi.mocked(useConfig).mockReturnValue(mockConfig);
	});

	it('should fetch collectibles successfully', async () => {
		// Set up mock response
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json({
					collectibles: [mockCollectibleOrder],
					page: { page: 1, pageSize: 30, more: false },
				});
			}),
		);

		const { result } = renderHook(() =>
			useListCollectiblesPaginated(defaultArgs),
		);

		// Wait for the query to complete
		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Verify the data
		expect(result.current.data?.collectibles).toEqual([mockCollectibleOrder]);
		expect(result.current.data?.page).toEqual({
			page: 1,
			pageSize: 30,
			more: false,
		});
	});

	it('should handle error states', async () => {
		// Override the handler to return an error
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json(
					{ error: { message: 'Failed to fetch collectibles' } },
					{ status: 500 },
				);
			}),
		);

		const { result } = renderHook(() =>
			useListCollectiblesPaginated(defaultArgs),
		);

		// Wait for the error state
		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeDefined();
		expect(result.current.data).toBeUndefined();
	});

	it('should handle pagination correctly', async () => {
		// Set up mock response for page 2
		const modifiedCollectibleOrder = {
			...mockCollectibleOrder,
			metadata: {
				...mockCollectibleOrder.metadata,
				tokenId: '2',
			},
		};

		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json({
					collectibles: [modifiedCollectibleOrder],
					page: { page: 2, pageSize: 20, more: false },
				});
			}),
		);

		const paginatedArgs: UseListCollectiblesPaginatedArgs = {
			...defaultArgs,
			query: {
				enabled: true,
				page: 2,
				pageSize: 20,
			},
		};

		const { result } = renderHook(() =>
			useListCollectiblesPaginated(paginatedArgs),
		);

		// Wait for the query to complete
		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Verify the data for page 2
		expect(result.current.data?.collectibles[0].metadata.tokenId).toBe('2');
		expect(result.current.data?.page).toEqual({
			page: 2,
			pageSize: 20,
			more: false,
		});
	});

	it('should refetch when args change', async () => {
		// Set up initial mock response
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json({
					collectibles: [mockCollectibleOrder],
					page: { page: 1, pageSize: 30, more: true },
				});
			}),
		);

		let currentArgs = defaultArgs;
		const { result, rerender } = renderHook(() =>
			useListCollectiblesPaginated(currentArgs),
		);

		// Wait for initial data
		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// Change args and rerender
		currentArgs = {
			...defaultArgs,
			query: {
				...defaultArgs.query,
				page: 2,
			},
		};

		// Set up mock response for page 2
		const modifiedCollectibleOrder = {
			...mockCollectibleOrder,
			metadata: {
				...mockCollectibleOrder.metadata,
				tokenId: '2',
			},
		};

		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				return HttpResponse.json({
					collectibles: [modifiedCollectibleOrder],
					page: { page: 2, pageSize: 30, more: false },
				});
			}),
		);

		rerender();

		// Wait for new data
		await waitFor(() => {
			expect(result.current.data?.page?.page).toBe(2);
		});

		// Verify new data
		expect(result.current.data?.collectibles[0].metadata.tokenId).toBe('2');
	});

	it('should not fetch when enabled is false', async () => {
		// Set up a mock handler to ensure no requests are made
		let requestMade = false;
		server.use(
			http.post(mockMarketplaceEndpoint('ListCollectibles'), () => {
				requestMade = true;
				return HttpResponse.json({
					collectibles: [mockCollectibleOrder],
					page: { page: 1, pageSize: 30, more: false },
				});
			}),
		);

		const disabledArgs: UseListCollectiblesPaginatedArgs = {
			...defaultArgs,
			query: {
				enabled: false,
				page: 1,
				pageSize: 30,
			},
		};

		const { result } = renderHook(() =>
			useListCollectiblesPaginated(disabledArgs),
		);

		// For disabled queries, we expect no loading state and no data
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBeNull();
		expect(requestMade).toBe(false);
	});
});
