import { useWaasFeeOptions } from '@0xsequence/connect';
import { renderHook } from '@test';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ContractType } from '../../../../../../../types';
import { InvalidContractTypeError } from '../../../../../../../utils/_internal/error/transaction';
import {
	balanceQueries,
	type CollectionType,
	collectableKeys,
} from '../../../../../../_internal';
import { TransactionType } from '../../../../../../_internal/types';
import { useWallet } from '../../../../../../_internal/wallet/useWallet';
import { useTransferTokens } from '../../../../../../hooks';
import { useTransactionStatusModal } from '../../../../_internal/components/transactionStatusModal';
import { transferModalStore, useModalState } from '../../../store';
import useHandleTransfer from '../useHandleTransfer';

// Mock dependencies
vi.mock('@0xsequence/connect');
vi.mock('../../../../../../_internal/wallet/useWallet');
vi.mock('../../../../../../hooks');
vi.mock('../../../../_internal/components/transactionStatusModal');
vi.mock('../../../store');

const mockUseWaasFeeOptions = vi.mocked(useWaasFeeOptions);
const mockUseWallet = vi.mocked(useWallet);
const mockUseTransferTokens = vi.mocked(useTransferTokens);
const mockUseTransactionStatusModal = vi.mocked(useTransactionStatusModal);
const mockUseModalState = vi.mocked(useModalState);

describe('useHandleTransfer', () => {
	const mockTransferTokensAsync = vi.fn();
	const mockShowTransactionStatusModal = vi.fn();
	const mockOnError = vi.fn();

	const defaultModalState = {
		receiverAddress: '0x1234567890123456789012345678901234567890',
		collectionAddress:
			'0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef' as `0x${string}`,
		collectibleId: '123',
		quantity: '2',
		chainId: 1,
		collectionType: ContractType.ERC721 as CollectionType,
		callbacks: {
			onError: mockOnError,
		},
		transferIsBeingProcessed: false,
	};

	beforeEach(() => {
		vi.clearAllMocks();

		// Setup default mocks
		mockUseWaasFeeOptions.mockReturnValue([
			// @ts-expect-error - simplified mock
			null,
			vi.fn(),
		]);
		mockUseWallet.mockReturnValue({
			wallet: { isWaaS: false },
		} as any);
		mockUseTransferTokens.mockReturnValue({
			transferTokensAsync: mockTransferTokensAsync,
			hash: undefined,
			transferring: false,
			transferFailed: false,
			transferSuccess: false,
		});
		mockUseTransactionStatusModal.mockReturnValue({
			show: mockShowTransactionStatusModal,
			close: vi.fn(),
		});

		// Mock the useModalState hook to return our test state
		mockUseModalState.mockReturnValue(defaultModalState);

		// Mock store send method
		vi.spyOn(transferModalStore, 'send').mockImplementation(() => {});
	});

	describe('transfer function', () => {
		it('should successfully transfer ERC721 token', async () => {
			const mockHash = '0xhash123';
			mockTransferTokensAsync.mockResolvedValue(mockHash);

			const { result } = renderHook(() => useHandleTransfer());

			await result.current.transfer();

			expect(mockTransferTokensAsync).toHaveBeenCalledWith({
				receiverAddress: defaultModalState.receiverAddress,
				collectionAddress: defaultModalState.collectionAddress,
				tokenId: defaultModalState.collectibleId,
				chainId: defaultModalState.chainId,
				contractType: ContractType.ERC721,
			});

			expect(transferModalStore.send).toHaveBeenCalledWith({ type: 'close' });

			expect(mockShowTransactionStatusModal).toHaveBeenCalledWith({
				hash: mockHash,
				collectionAddress: defaultModalState.collectionAddress,
				chainId: defaultModalState.chainId,
				collectibleId: defaultModalState.collectibleId,
				type: TransactionType.TRANSFER,
				queriesToInvalidate: [
					balanceQueries.all,
					balanceQueries.collectionBalanceDetails,
					collectableKeys.userBalances,
				],
			});
		});

		it('should successfully transfer ERC1155 token with quantity', async () => {
			const mockHash = '0xhash456';
			mockTransferTokensAsync.mockResolvedValue(mockHash);

			// Mock ERC1155 state
			const erc1155State = {
				...defaultModalState,
				collectionType: ContractType.ERC1155 as CollectionType,
				quantity: '5',
			};

			mockUseModalState.mockReturnValue(erc1155State);

			const { result } = renderHook(() => useHandleTransfer());

			await result.current.transfer();

			expect(mockTransferTokensAsync).toHaveBeenCalledWith({
				receiverAddress: erc1155State.receiverAddress,
				collectionAddress: erc1155State.collectionAddress,
				tokenId: erc1155State.collectibleId,
				chainId: erc1155State.chainId,
				contractType: ContractType.ERC1155,
				quantity: '5',
			});

			expect(transferModalStore.send).toHaveBeenCalledWith({ type: 'close' });
			expect(mockShowTransactionStatusModal).toHaveBeenCalledWith(
				expect.objectContaining({
					hash: mockHash,
					type: TransactionType.TRANSFER,
				}),
			);
		});

		it('should throw error for invalid contract type', async () => {
			const invalidState = {
				...defaultModalState,
				collectionType: 'INVALID_TYPE' as any,
			};

			mockUseModalState.mockReturnValue(invalidState);

			const { result } = renderHook(() => useHandleTransfer());

			await expect(result.current.transfer()).rejects.toThrow(
				InvalidContractTypeError,
			);

			expect(mockTransferTokensAsync).not.toHaveBeenCalled();
			expect(mockShowTransactionStatusModal).not.toHaveBeenCalled();
		});

		it('should return early if WaaS wallet has pending fee confirmation', async () => {
			mockUseWallet.mockReturnValue({
				wallet: { isWaaS: true },
			} as any);
			mockUseWaasFeeOptions.mockReturnValue([
				// @ts-expect-error - simplified mock
				{ pending: true },
				vi.fn(),
			]);

			const { result } = renderHook(() => useHandleTransfer());

			await result.current.transfer();

			expect(mockTransferTokensAsync).not.toHaveBeenCalled();
			expect(mockShowTransactionStatusModal).not.toHaveBeenCalled();
		});

		it('should handle transfer error and call onError callback', async () => {
			const transferError = new Error('Transfer failed');
			mockTransferTokensAsync.mockRejectedValue(transferError);

			const { result } = renderHook(() => useHandleTransfer());

			await result.current.transfer();

			expect(transferModalStore.send).toHaveBeenCalledWith({
				type: 'setView',
				view: 'enterReceiverAddress',
			});

			expect(mockOnError).toHaveBeenCalledWith(transferError);
			expect(mockShowTransactionStatusModal).not.toHaveBeenCalled();
		});

		it('should handle missing onError callback gracefully', async () => {
			const transferError = new Error('Transfer failed');
			mockTransferTokensAsync.mockRejectedValue(transferError);

			// Mock state without onError callback
			const stateWithoutCallback = {
				...defaultModalState,
				callbacks: {},
			};

			mockUseModalState.mockReturnValue(stateWithoutCallback);

			const { result } = renderHook(() => useHandleTransfer());

			// Should not throw even without onError callback
			await expect(result.current.transfer()).resolves.toBeUndefined();

			expect(transferModalStore.send).toHaveBeenCalledWith({
				type: 'setView',
				view: 'enterReceiverAddress',
			});
		});

		it('should proceed with transfer for non-WaaS wallet even with pending fee confirmation', async () => {
			const mockHash = '0xhash789';
			mockTransferTokensAsync.mockResolvedValue(mockHash);

			mockUseWallet.mockReturnValue({
				wallet: { isWaaS: false },
			} as any);
			mockUseWaasFeeOptions.mockReturnValue([
				// @ts-expect-error - simplified mock
				{ pending: true },
				vi.fn(),
			]);

			const { result } = renderHook(() => useHandleTransfer());

			await result.current.transfer();

			expect(mockTransferTokensAsync).toHaveBeenCalled();
			expect(mockShowTransactionStatusModal).toHaveBeenCalledWith(
				expect.objectContaining({
					hash: mockHash,
				}),
			);
		});

		it('should proceed with transfer for WaaS wallet without pending fee confirmation', async () => {
			const mockHash = '0xhash101112';
			mockTransferTokensAsync.mockResolvedValue(mockHash);

			mockUseWallet.mockReturnValue({
				wallet: { isWaaS: true },
			} as any);
			mockUseWaasFeeOptions.mockReturnValue([
				// @ts-expect-error - simplified mock
				null,
				vi.fn(),
			]);

			const { result } = renderHook(() => useHandleTransfer());

			await result.current.transfer();

			expect(mockTransferTokensAsync).toHaveBeenCalled();
			expect(mockShowTransactionStatusModal).toHaveBeenCalledWith(
				expect.objectContaining({
					hash: mockHash,
				}),
			);
		});
	});

	describe('edge cases', () => {
		it('should handle undefined wallet', async () => {
			mockUseWallet.mockReturnValue({
				wallet: undefined,
			} as any);

			const { result } = renderHook(() => useHandleTransfer());

			const mockHash = '0xhash131415';
			mockTransferTokensAsync.mockResolvedValue(mockHash);

			await result.current.transfer();

			expect(mockTransferTokensAsync).toHaveBeenCalled();
			expect(mockShowTransactionStatusModal).toHaveBeenCalled();
		});

		it('should handle zero quantity for ERC1155', async () => {
			const mockHash = '0xhash161718';
			mockTransferTokensAsync.mockResolvedValue(mockHash);

			const zeroQuantityState = {
				...defaultModalState,
				collectionType: ContractType.ERC1155 as CollectionType,
				quantity: '0',
			};

			mockUseModalState.mockReturnValue(zeroQuantityState);

			const { result } = renderHook(() => useHandleTransfer());

			await result.current.transfer();

			expect(mockTransferTokensAsync).toHaveBeenCalledWith(
				expect.objectContaining({
					quantity: '0',
				}),
			);
		});

		it('should handle large quantity for ERC1155', async () => {
			const mockHash = '0xhash192021';
			mockTransferTokensAsync.mockResolvedValue(mockHash);

			const largeQuantityState = {
				...defaultModalState,
				collectionType: ContractType.ERC1155 as CollectionType,
				quantity: '999999999',
			};

			mockUseModalState.mockReturnValue(largeQuantityState);

			const { result } = renderHook(() => useHandleTransfer());

			await result.current.transfer();

			expect(mockTransferTokensAsync).toHaveBeenCalledWith(
				expect.objectContaining({
					quantity: '999999999',
				}),
			);
		});
	});

	describe('integration with store', () => {
		it('should read current state from store on each call', async () => {
			const { result } = renderHook(() => useHandleTransfer());

			// First call with default state
			const mockHash1 = '0xhash1';
			mockTransferTokensAsync.mockResolvedValueOnce(mockHash1);
			await result.current.transfer();

			// Verify first call used default collectibleId
			expect(mockTransferTokensAsync).toHaveBeenCalledWith(
				expect.objectContaining({
					tokenId: '123', // default collectibleId
				}),
			);

			// Change the mock to return different state for second call
			const newState = {
				...defaultModalState,
				collectibleId: '456',
				quantity: '10',
			};
			mockUseModalState.mockReturnValue(newState);

			// Re-render the hook to pick up new state
			const { result: newResult } = renderHook(() => useHandleTransfer());

			// Second call should use new state
			const mockHash2 = '0xhash2';
			mockTransferTokensAsync.mockResolvedValueOnce(mockHash2);
			await newResult.current.transfer();

			expect(mockTransferTokensAsync).toHaveBeenLastCalledWith(
				expect.objectContaining({
					tokenId: '456',
				}),
			);
		});
	});
});
