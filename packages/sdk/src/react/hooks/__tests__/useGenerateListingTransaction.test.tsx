import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useGenerateListingTransaction } from '../useGenerateListingTransaction';
import { renderHook, waitFor } from '../../_internal/test-utils';
import { zeroAddress } from 'viem';
import { http, HttpResponse } from 'msw';
import {
	mockSteps,
	mockMarketplaceEndpoint,
} from '../../_internal/api/__mocks__/marketplace.msw';
import { server } from '../../_internal/test/setup';
import {
	ContractType,
	OrderbookKind,
} from '../../_internal/api/marketplace.gen';
import { useConfig } from '../useConfig';
import type { SdkConfig } from '../../../types';
import type { CreateReqWithDateExpiry } from '../useGenerateListingTransaction';

// Mock useConfig hook
vi.mock('../useConfig');

describe('useGenerateListingTransaction', () => {
	const mockOnSuccess = vi.fn();

	const mockConfig: SdkConfig = {
		projectId: 'test-project',
		projectAccessKey: 'test-access-key',
	};

	const mockListing: CreateReqWithDateExpiry = {
		tokenId: '1',
		quantity: '1',
		expiry: new Date('2024-12-31'),
		currencyAddress: zeroAddress,
		pricePerToken: '1000000000000000000',
	};

	const mockTransactionProps = {
		collectionAddress: zeroAddress,
		owner: zeroAddress,
		contractType: ContractType.ERC721,
		orderbook: OrderbookKind.sequence_marketplace_v2,
		listing: mockListing,
	};

	const defaultArgs = {
		chainId: '1' as const,
		onSuccess: mockOnSuccess,
	};

	beforeEach(() => {
		vi.clearAllMocks();

		// Set up the mock implementation for useConfig
		vi.mocked(useConfig).mockReturnValue(mockConfig);

		// Mock default steps response
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateListingTransaction'), () => {
				return HttpResponse.json({
					steps: mockSteps,
				});
			}),
		);
	});

	it('should generate listing transaction successfully', async () => {
		const { result } = renderHook(() =>
			useGenerateListingTransaction(defaultArgs),
		);

		await result.current.generateListingTransactionAsync(mockTransactionProps);

		expect(mockOnSuccess).toHaveBeenCalledWith(
			mockSteps,
			mockTransactionProps,
			undefined,
		);
	});

	it('should handle async generation with await', async () => {
		const { result } = renderHook(() =>
			useGenerateListingTransaction(defaultArgs),
		);

		const steps =
			await result.current.generateListingTransactionAsync(
				mockTransactionProps,
			);

		expect(steps).toEqual(mockSteps);
	});

	it('should handle non-async generation with callback', async () => {
		const { result } = renderHook(() =>
			useGenerateListingTransaction(defaultArgs),
		);

		result.current.generateListingTransaction(mockTransactionProps);

		await waitFor(() => {
			expect(mockOnSuccess).toHaveBeenCalledWith(
				mockSteps,
				mockTransactionProps,
				undefined,
			);
		});
	});

	it('should handle API errors', async () => {
		// Mock error response
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateListingTransaction'), () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);

		const { result } = renderHook(() =>
			useGenerateListingTransaction(defaultArgs),
		);

		await expect(
			result.current.generateListingTransactionAsync(mockTransactionProps),
		).rejects.toThrow();

		expect(mockOnSuccess).not.toHaveBeenCalled();
	});

	it('should convert Date expiry to Unix timestamp', async () => {
		const expectedUnixTime = Math.floor(mockListing.expiry.getTime() / 1000);
		let requestBody: any;

		server.use(
			http.post(
				mockMarketplaceEndpoint('GenerateListingTransaction'),
				async ({ request }) => {
					requestBody = await request.json();
					return HttpResponse.json({ steps: mockSteps });
				},
			),
		);

		const { result } = renderHook(() =>
			useGenerateListingTransaction(defaultArgs),
		);
		await result.current.generateListingTransactionAsync(mockTransactionProps);

		expect(Number(requestBody.listing.expiry)).toBe(expectedUnixTime);
	});

	it('should use provided config from useConfig hook', async () => {
		const customConfig: SdkConfig = {
			projectId: 'custom-project',
			projectAccessKey: 'custom-access-key',
		};

		let requestHeaders: Headers | undefined;

		server.use(
			http.post(
				mockMarketplaceEndpoint('GenerateListingTransaction'),
				async ({ request }) => {
					requestHeaders = request.headers;
					return HttpResponse.json({ steps: mockSteps });
				},
			),
		);

		vi.mocked(useConfig).mockReturnValue(customConfig);

		const { result } = renderHook(() =>
			useGenerateListingTransaction(defaultArgs),
		);
		await result.current.generateListingTransactionAsync(mockTransactionProps);

		expect(requestHeaders?.get('x-access-key')).toBe(
			customConfig.projectAccessKey,
		);
	});

	it('should handle invalid listing data', async () => {
		const invalidListing = {
			...mockListing,
			pricePerToken: 'invalid-price',
		};

		server.use(
			http.post(mockMarketplaceEndpoint('GenerateListingTransaction'), () => {
				return new HttpResponse(null, { status: 400 });
			}),
		);

		const { result } = renderHook(() =>
			useGenerateListingTransaction(defaultArgs),
		);

		await expect(
			result.current.generateListingTransactionAsync({
				...mockTransactionProps,
				listing: invalidListing,
			}),
		).rejects.toThrow();

		expect(mockOnSuccess).not.toHaveBeenCalled();
	});
});
