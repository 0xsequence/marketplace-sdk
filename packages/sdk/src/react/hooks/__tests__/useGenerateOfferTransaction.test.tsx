import { renderHook, waitFor } from '@test';
import { server } from '@test';
import { http, HttpResponse } from 'msw';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SdkConfig } from '../../../types';
import {
	mockMarketplaceEndpoint,
	mockSteps,
} from '../../_internal/api/__mocks__/marketplace.msw';
import {
	ContractType,
	OrderbookKind,
} from '../../_internal/api/marketplace.gen';
import { useConfig } from '../useConfig';
import { useGenerateOfferTransaction } from '../useGenerateOfferTransaction';

// Mock useConfig hook
vi.mock('../useConfig');

describe('useGenerateOfferTransaction', () => {
	const mockOnSuccess = vi.fn();

	const mockConfig: SdkConfig = {
		projectId: 'test-project',
		projectAccessKey: 'test-access-key',
	};

	const mockOffer = {
		tokenId: '1',
		quantity: '1',
		expiry: new Date('2024-12-31'),
		currencyAddress: zeroAddress,
		pricePerToken: '1000000000000000000',
	};

	const mockTransactionProps = {
		collectionAddress: zeroAddress,
		maker: zeroAddress,
		contractType: ContractType.ERC721,
		orderbook: OrderbookKind.sequence_marketplace_v2,
		offer: mockOffer,
	};

	const defaultArgs = {
		chainId: '1' as const,
		onSuccess: mockOnSuccess,
	};

	beforeEach(() => {
		vi.clearAllMocks();

		// Set up the mock implementation for useConfig
		vi.mocked(useConfig).mockReturnValue(mockConfig);
	});

	it('should generate offer transaction successfully', async () => {
		const { result } = renderHook(() =>
			useGenerateOfferTransaction(defaultArgs),
		);

		await result.current.generateOfferTransactionAsync(mockTransactionProps);

		expect(mockOnSuccess).toHaveBeenCalledWith(
			mockSteps,
			mockTransactionProps,
			undefined,
		);
	});

	it('should handle async generation with await', async () => {
		const { result } = renderHook(() =>
			useGenerateOfferTransaction(defaultArgs),
		);

		const steps =
			await result.current.generateOfferTransactionAsync(mockTransactionProps);

		expect(steps).toEqual(mockSteps);
	});

	it('should handle non-async generation with callback', async () => {
		const { result } = renderHook(() =>
			useGenerateOfferTransaction(defaultArgs),
		);

		result.current.generateOfferTransaction(mockTransactionProps);

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
			http.post(mockMarketplaceEndpoint('GenerateOfferTransaction'), () => {
				return new HttpResponse(null, { status: 500 });
			}),
		);

		const { result } = renderHook(() =>
			useGenerateOfferTransaction(defaultArgs),
		);

		await expect(
			result.current.generateOfferTransactionAsync(mockTransactionProps),
		).rejects.toThrow();

		expect(mockOnSuccess).not.toHaveBeenCalled();
	});

	it('should convert Date expiry to Unix timestamp', async () => {
		const expectedUnixTime = Math.floor(mockOffer.expiry.getTime() / 1000);

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		let requestBody: any;

		server.use(
			http.post(
				mockMarketplaceEndpoint('GenerateOfferTransaction'),
				async ({ request }) => {
					requestBody = await request.json();
					return HttpResponse.json({ steps: mockSteps });
				},
			),
		);

		const { result } = renderHook(() =>
			useGenerateOfferTransaction(defaultArgs),
		);
		await result.current.generateOfferTransactionAsync(mockTransactionProps);

		expect(Number(requestBody.offer.expiry)).toBe(expectedUnixTime);
	});

	it('should use provided config from useConfig hook', async () => {
		const customConfig: SdkConfig = {
			projectId: 'custom-project',
			projectAccessKey: 'custom-access-key',
		};

		let requestHeaders: Headers | undefined;

		server.use(
			http.post(
				mockMarketplaceEndpoint('GenerateOfferTransaction'),
				async ({ request }) => {
					requestHeaders = request.headers;
					return HttpResponse.json({ steps: mockSteps });
				},
			),
		);

		vi.mocked(useConfig).mockReturnValue(customConfig);

		const { result } = renderHook(() =>
			useGenerateOfferTransaction(defaultArgs),
		);
		await result.current.generateOfferTransactionAsync(mockTransactionProps);

		expect(requestHeaders?.get('x-access-key')).toBe(
			customConfig.projectAccessKey,
		);
	});

	it('should handle invalid offer data', async () => {
		const invalidOffer = {
			...mockOffer,
			pricePerToken: 'invalid-price',
		};

		server.use(
			http.post(mockMarketplaceEndpoint('GenerateOfferTransaction'), () => {
				return new HttpResponse(null, { status: 400 });
			}),
		);

		const { result } = renderHook(() =>
			useGenerateOfferTransaction(defaultArgs),
		);

		await expect(
			result.current.generateOfferTransactionAsync({
				...mockTransactionProps,
				offer: invalidOffer,
			}),
		).rejects.toThrow();

		expect(mockOnSuccess).not.toHaveBeenCalled();
	});
});
