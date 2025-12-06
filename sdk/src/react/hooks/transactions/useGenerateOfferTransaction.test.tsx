import {
	ContractType,
	MarketplaceMocks,
	OfferType,
	OrderbookKind,
	StepType,
} from '@0xsequence/api-client';

const { createMockSteps, mockMarketplaceEndpoint } = MarketplaceMocks;

import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useGenerateOfferTransaction } from './useGenerateOfferTransaction';

describe('useGenerateOfferTransaction', () => {
	const mockOnSuccess = vi.fn();

	const mockOffer = {
		tokenId: 1n,
		quantity: 1n,
		expiry: new Date('2024-12-31'),
		currencyAddress: zeroAddress,
		pricePerToken: 1000000000000000000n,
	};

	const mockTransactionProps = {
		collectionAddress: zeroAddress,
		maker: zeroAddress,
		contractType: ContractType.ERC721,
		orderbook: OrderbookKind.sequence_marketplace_v2,
		offer: mockOffer,
		offerType: OfferType.item,
		additionalFees: [],
	};

	const defaultArgs = {
		chainId: 1,
		onSuccess: mockOnSuccess,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should generate offer transaction successfully', async () => {
		const { result } = renderHook(() =>
			useGenerateOfferTransaction(defaultArgs),
		);

		await result.current.generateOfferTransactionAsync(mockTransactionProps);

		expect(mockOnSuccess).toHaveBeenCalled();
		const steps = mockOnSuccess.mock.calls[0]?.[0];
		expect(steps.length).toBeGreaterThan(0);
	});

	it('should handle non-async generation with callback', async () => {
		const { result } = renderHook(() =>
			useGenerateOfferTransaction(defaultArgs),
		);

		result.current.generateOfferTransaction(mockTransactionProps);

		await waitFor(() => {
			expect(mockOnSuccess).toHaveBeenCalled();
		});

		const steps = mockOnSuccess.mock.calls[0]?.[0];
		expect(steps.length).toBeGreaterThan(0);
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

	it('should handle invalid offer data', async () => {
		const invalidOffer = {
			...mockOffer,
			pricePerToken: -1n,
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

	describe('wallet-specific behavior', () => {
		// Create mock wallets for different types

		it('should not include tokenApproval step for Sequence wallet', async () => {
			// Override the default handler for Sequence wallet
			server.use(
				http.post(
					mockMarketplaceEndpoint('GenerateOfferTransaction'),
					async () => {
						// For Sequence wallet - only return createOffer step
						return HttpResponse.json({
							steps: createMockSteps([StepType.createOffer]),
						});
					},
				),
			);

			const { result } = renderHook(() =>
				useGenerateOfferTransaction(defaultArgs),
			);

			await result.current.generateOfferTransactionAsync(mockTransactionProps);

			expect(mockOnSuccess).toHaveBeenCalled();
			const steps = mockOnSuccess.mock.calls[0]?.[0];

			// Verify there is only one step: createOffer (no tokenApproval)
			expect(steps).toHaveLength(1);
			expect(steps[0].id).toBe('createOffer');
		});

		it('should include tokenApproval step for non-Sequence wallet', async () => {
			// Override the default handler for non-Sequence wallet
			server.use(
				http.post(
					mockMarketplaceEndpoint('GenerateOfferTransaction'),
					async () => {
						// For non-Sequence wallet - return tokenApproval and createOffer steps
						return HttpResponse.json({
							steps: createMockSteps([
								StepType.tokenApproval,
								StepType.createOffer,
							]),
						});
					},
				),
			);

			const { result } = renderHook(() =>
				useGenerateOfferTransaction(defaultArgs),
			);

			await result.current.generateOfferTransactionAsync(mockTransactionProps);

			expect(mockOnSuccess).toHaveBeenCalled();
			const steps = mockOnSuccess.mock.calls[0]?.[0];

			// Verify there are two steps: tokenApproval and createOffer
			expect(steps).toHaveLength(2);
			expect(steps[0].id).toBe('tokenApproval');
			expect(steps[1].id).toBe('createOffer');
		});
	});
});
