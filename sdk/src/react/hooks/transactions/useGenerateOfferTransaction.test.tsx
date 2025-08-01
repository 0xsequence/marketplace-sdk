import { renderHook, server, waitFor } from '@test';
import { createMockWallet } from '@test/mocks/wallet';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	createMockSteps,
	mockMarketplaceEndpoint,
} from '../../_internal/api/__mocks__/marketplace.msw';
import {
	ContractType,
	OrderbookKind,
	StepType,
	WalletKind,
} from '../../_internal/api/marketplace.gen';
import * as walletModule from '../../_internal/wallet/useWallet';
import { useGenerateOfferTransaction } from './useGenerateOfferTransaction';

describe('useGenerateOfferTransaction', () => {
	const mockOnSuccess = vi.fn();

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

	describe('wallet-specific behavior', () => {
		// Create mock wallets for different types
		const mockSequenceWallet = createMockWallet({
			walletKind: WalletKind.sequence,
		});

		const mockNonSequenceWallet = createMockWallet({
			walletKind: WalletKind.unknown,
		});

		it('should not include tokenApproval step for Sequence wallet', async () => {
			// Mock useWallet to return a Sequence wallet
			const useWalletSpy = vi.spyOn(walletModule, 'useWallet');
			useWalletSpy.mockReturnValue({
				wallet: mockSequenceWallet,
				isLoading: false,
				isError: false,
			});

			// Override the default handler to include walletKind in the response
			server.use(
				http.post(
					mockMarketplaceEndpoint('GenerateOfferTransaction'),
					async ({ request }) => {
						// Add wallet type to the request payload
						const reqBody = (await request.json()) as Record<string, unknown>;
						reqBody.walletType = WalletKind.sequence;

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

			// Restore the original useWallet implementation
			useWalletSpy.mockRestore();
		});

		it('should include tokenApproval step for non-Sequence wallet', async () => {
			// Mock useWallet to return a non-Sequence wallet
			const useWalletSpy = vi.spyOn(walletModule, 'useWallet');
			useWalletSpy.mockReturnValue({
				wallet: mockNonSequenceWallet,
				isLoading: false,
				isError: false,
			});

			// Override the default handler to include walletKind in the response
			server.use(
				http.post(
					mockMarketplaceEndpoint('GenerateOfferTransaction'),
					async ({ request }) => {
						// Add wallet type to the request payload
						const reqBody = (await request.json()) as Record<string, unknown>;
						reqBody.walletType = WalletKind.unknown;

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

			// Restore the original useWallet implementation
			useWalletSpy.mockRestore();
		});
	});
});
