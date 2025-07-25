import { renderHook, server, waitFor } from '@test';
import { HttpResponse, http } from 'msw';
import { zeroAddress } from 'viem';
import type { Mock } from 'vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	commonWalletMocks,
	createMockWallet,
} from '../../../../test/mocks/wallet';
import { MarketplaceKind, StepType } from '../../../types/index';
import {
	ChainSwitchUserRejectedError,
	WalletInstanceNotFoundError,
} from '../../../utils/_internal/error/transaction';
import {
	createMockStep,
	createMockSteps,
	mockMarketplaceEndpoint,
} from '../../_internal/api/__mocks__/marketplace.msw';
import { useWallet } from '../../_internal/wallet/useWallet';
import { useCancelTransactionSteps } from './useCancelTransactionSteps';

vi.mock('../../_internal/wallet/useWallet', () => ({
	useWallet: vi.fn(),
}));

// Create mock wallet instance with default successful implementations
const mockWallet = createMockWallet({
	getChainId: commonWalletMocks.successfulChainId,
	address: commonWalletMocks.successfulAddress,
	handleSendTransactionStep: commonWalletMocks.successfulTransaction,
	handleSignMessageStep: commonWalletMocks.successfulSignature,
	handleConfirmTransactionStep: commonWalletMocks.successfulConfirmation,
});

// Mock switch chain modal
vi.mock('../../ui/modals/_internal/components/switchChainModal', () => ({
	useSwitchChainModal: () => ({
		show: vi.fn((args) => args.onSuccess()),
	}),
}));

describe('useCancelTransactionSteps', () => {
	const mockSetSteps = vi.fn();
	const mockOnSuccess = vi.fn();
	const mockOnError = vi.fn();

	const defaultArgs = {
		chainId: 1,
		collectionAddress: zeroAddress,
		setSteps: mockSetSteps,
		onSuccess: mockOnSuccess,
		onError: mockOnError,
	};

	beforeEach(() => {
		vi.clearAllMocks();

		// Set up the mock implementation for useWallet in beforeEach
		(useWallet as Mock).mockReturnValue({
			wallet: mockWallet,
			isLoading: false,
			isError: false,
		});

		// Mock default steps response
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateCancelTransaction'), () => {
				return HttpResponse.json({
					steps: createMockSteps([StepType.cancel]),
				});
			}),
		);
	});

	afterEach(() => {
		server.resetHandlers();
	});

	it('should handle transaction steps successfully', async () => {
		const { result } = renderHook(() => useCancelTransactionSteps(defaultArgs));

		await result.current.cancelOrder({
			orderId: '123',
			marketplace: MarketplaceKind.sequence_marketplace_v2,
		});

		// Verify that setSteps was called with a function that sets isExecuting to true
		const setStepsCall = mockSetSteps.mock.calls[0][0];
		expect(typeof setStepsCall).toBe('function');
		const updatedState = setStepsCall({ isExecuting: false });
		expect(updatedState.isExecuting).toBe(true);

		expect(mockOnSuccess).toHaveBeenCalled();
		expect(mockOnError).not.toHaveBeenCalled();
	});

	it('should handle signature steps successfully', async () => {
		// Mock steps to include signature step
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateCancelTransaction'), () => {
				return HttpResponse.json({
					steps: [
						{
							...createMockStep(StepType.signEIP712),
						},
					],
				});
			}),
		);

		const { result } = renderHook(() => useCancelTransactionSteps(defaultArgs));

		await result.current.cancelOrder({
			orderId: '123',
			marketplace: MarketplaceKind.sequence_marketplace_v2,
		});

		expect(mockWallet.handleSignMessageStep).toHaveBeenCalled();
		expect(mockOnSuccess).toHaveBeenCalled();
		expect(mockOnError).not.toHaveBeenCalled();
	});

	it('should handle chain switching', async () => {
		// Mock different chain ID
		commonWalletMocks.successfulChainId.mockResolvedValueOnce(2);

		const { result } = renderHook(() => useCancelTransactionSteps(defaultArgs));

		await result.current.cancelOrder({
			orderId: '123',
			marketplace: MarketplaceKind.sequence_marketplace_v2,
		});

		expect(mockWallet.getChainId).toHaveBeenCalled();

		waitFor(() => {
			expect(mockWallet.switchChain).toHaveBeenCalled();

			expect(mockOnSuccess).toHaveBeenCalled();
			expect(mockOnError).not.toHaveBeenCalled();
		});
	});

	it('should handle wallet not initialized error', async () => {
		// Override the mock for this specific test
		(useWallet as Mock).mockReturnValue({
			wallet: null,
			isLoading: false,
			isError: false,
		});

		const { result } = renderHook(() => useCancelTransactionSteps(defaultArgs));

		try {
			await result.current.cancelOrder({
				orderId: '123',
				marketplace: MarketplaceKind.sequence_marketplace_v2,
			});
		} catch (error) {
			expect(error).toBeInstanceOf(WalletInstanceNotFoundError);
		}

		expect(mockOnSuccess).not.toHaveBeenCalled();
	});

	it('should handle chain switch rejection', async () => {
		// Create a new mock wallet with chain switch rejection
		const mockWalletWithRejection = createMockWallet({
			...mockWallet,
			getChainId: vi.fn().mockResolvedValue(2),
			switchChain: commonWalletMocks.chainSwitchRejection,
		});

		// Override the mock for this specific test
		(useWallet as Mock).mockReturnValue({
			wallet: mockWalletWithRejection,
			isLoading: false,
			isError: false,
		});

		// Mock switch chain modal to reject
		vi.mock('../../ui/modals/_internal/components/switchChainModal', () => ({
			useSwitchChainModal: () => ({
				show: vi.fn((args) => args.onClose()),
			}),
		}));

		const { result } = renderHook(() =>
			useCancelTransactionSteps({
				...defaultArgs,
				callbacks: {
					onError: mockOnError,
				},
			}),
		);

		await result.current.cancelOrder({
			orderId: '123',
			marketplace: MarketplaceKind.sequence_marketplace_v2,
		});

		expect(mockOnError).toHaveBeenCalledWith(
			expect.any(ChainSwitchUserRejectedError),
		);
		expect(mockOnSuccess).not.toHaveBeenCalled();
	});

	it('should handle transaction failure', async () => {
		// Create a new mock wallet with transaction failure
		const mockWalletWithFailure = createMockWallet({
			...mockWallet,
			handleSendTransactionStep: commonWalletMocks.transactionFailure,
		});

		// Override the mock for this specific test
		(useWallet as Mock).mockReturnValue({
			wallet: mockWalletWithFailure,
			isLoading: false,
			isError: false,
		});

		const { result } = renderHook(() => useCancelTransactionSteps(defaultArgs));

		await result.current.cancelOrder({
			orderId: '123',
			marketplace: MarketplaceKind.sequence_marketplace_v2,
		});

		// Verify that setSteps was called with a function that sets isExecuting to false
		const setStepsCall =
			mockSetSteps.mock.calls[mockSetSteps.mock.calls.length - 1][0];
		expect(typeof setStepsCall).toBe('function');
		const updatedState = setStepsCall({ isExecuting: true });
		expect(updatedState.isExecuting).toBe(false);

		expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
		expect(mockOnSuccess).not.toHaveBeenCalled();
	});

	it('should handle missing steps error', async () => {
		// Mock empty steps response
		server.use(
			http.post(mockMarketplaceEndpoint('GenerateCancelTransaction'), () => {
				return HttpResponse.json({
					steps: [],
				});
			}),
		);

		const { result } = renderHook(() => useCancelTransactionSteps(defaultArgs));

		await result.current.cancelOrder({
			orderId: '123',
			marketplace: MarketplaceKind.sequence_marketplace_v2,
		});

		expect(mockOnError).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'No transaction or signature step found',
			}),
		);
		expect(mockOnSuccess).not.toHaveBeenCalled();
	});
});
