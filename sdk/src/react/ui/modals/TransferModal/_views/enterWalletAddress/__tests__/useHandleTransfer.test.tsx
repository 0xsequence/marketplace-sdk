import { useWaasFeeOptions } from '@0xsequence/connect';
import { renderHook } from '@test';
import type { Address } from 'viem';
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
import { useCollection, useTransferTokens } from '../../../../../../hooks';
import { useTransactionStatusModal } from '../../../../_internal/components/transactionStatusModal';
import {
	type TransferModalState,
	transferModalStore,
	useModalState,
} from '../../../store';
import useHandleTransfer from '../useHandleTransfer';

// Mock dependencies
vi.mock('@0xsequence/connect');
vi.mock('../../../../../../_internal/wallet/useWallet');
vi.mock('../../../../../../hooks');
vi.mock('../../../../_internal/components/transactionStatusModal');
vi.mock('../../../store');

const mockUseWaasFeeOptions = vi.mocked(useWaasFeeOptions);
const mockUseWallet = vi.mocked(useWallet);
const mockUseCollection = vi.mocked(useCollection);
const mockUseTransferTokens = vi.mocked(useTransferTokens);
const mockUseTransactionStatusModal = vi.mocked(useTransactionStatusModal);
const mockUseModalState = vi.mocked(useModalState);

describe('useHandleTransfer', () => {
	const mockTransferTokensAsync = vi.fn();
	const mockShowTransactionStatusModal = vi.fn();
	const mockOnError = vi.fn();

	const defaultModalState = {
		isOpen: true,
		receiverAddress: '0x1234567890123456789012345678901234567890',
		collectionAddress:
			'0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef' as Address,
		collectibleId: '123',
		quantity: '2',
		chainId: 1,
		transferIsProcessing: false,
		view: 'enterReceiverAddress',
		onSuccess: undefined,
		onError: mockOnError,
		hash: undefined,
	} satisfies TransferModalState;

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
		mockUseCollection.mockReturnValue({
			data: { type: ContractType.ERC721 },
			isLoading: false,
			isError: false,
			error: null,
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

			expect(transferModalStore.send).toHaveBeenCalledWith({
				type: 'completeTransfer',
				hash: mockHash,
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

			// Mock ERC1155 collection
			mockUseCollection.mockReturnValue({
				data: { type: ContractType.ERC1155 },
				isLoading: false,
				isError: false,
				error: null,
			} as any);

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

			expect(transferModalStore.send).toHaveBeenCalledWith({
				type: 'completeTransfer',
				hash: mockHash,
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
			// Mock invalid collection type
			mockUseCollection.mockReturnValue({
				data: { type: 'INVALID_TYPE' },
				isLoading: false,
				isError: false,
				error: null,
			} as any);

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

		it('should handle transfer error', async () => {
			const transferError = new Error('Transfer failed');
			mockTransferTokensAsync.mockRejectedValue(transferError);

			const { result } = renderHook(() => useHandleTransfer());

			await result.current.transfer();

			expect(transferModalStore.send).toHaveBeenCalledWith({
				type: 'failTransfer',
				error: transferError,
			});

			expect(mockShowTransactionStatusModal).not.toHaveBeenCalled();
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

			const mockHash = '0xhash131415';
			mockTransferTokensAsync.mockResolvedValue(mockHash);

			const { result } = renderHook(() => useHandleTransfer());

			await result.current.transfer();

			expect(mockTransferTokensAsync).toHaveBeenCalled();
			expect(mockShowTransactionStatusModal).toHaveBeenCalled();
		});

		it('should handle ERC1155 with quantity as string "1"', async () => {
			const mockHash = '0xhash161718';
			mockTransferTokensAsync.mockResolvedValue(mockHash);

			// Mock ERC1155 collection
			mockUseCollection.mockReturnValue({
				data: { type: ContractType.ERC1155 },
				isLoading: false,
				isError: false,
				error: null,
			} as any);

			const erc1155State = {
				...defaultModalState,
				collectionType: ContractType.ERC1155 as CollectionType,
				quantity: '1',
			};

			mockUseModalState.mockReturnValue(erc1155State);

			const { result } = renderHook(() => useHandleTransfer());

			await result.current.transfer();

			expect(mockTransferTokensAsync).toHaveBeenCalledWith(
				expect.objectContaining({
					contractType: ContractType.ERC1155,
					quantity: '1',
				}),
			);
		});

		it('should handle ERC1155 with large quantity', async () => {
			const mockHash = '0xhash192021';
			mockTransferTokensAsync.mockResolvedValue(mockHash);

			// Mock ERC1155 collection
			mockUseCollection.mockReturnValue({
				data: { type: ContractType.ERC1155 },
				isLoading: false,
				isError: false,
				error: null,
			} as any);

			const erc1155State = {
				...defaultModalState,
				collectionType: ContractType.ERC1155 as CollectionType,
				quantity: '1000000',
			};

			mockUseModalState.mockReturnValue(erc1155State);

			const { result } = renderHook(() => useHandleTransfer());

			await result.current.transfer();

			expect(mockTransferTokensAsync).toHaveBeenCalledWith(
				expect.objectContaining({
					contractType: ContractType.ERC1155,
					quantity: '1000000',
				}),
			);
		});

		it('should handle transfer with all fields populated', async () => {
			const mockHash = '0xhash222324';
			mockTransferTokensAsync.mockResolvedValue(mockHash);

			const fullState = {
				...defaultModalState,
				collectibleId: '999',
				quantity: '10',
				receiverAddress: '0xffffffffffffffffffffffffffffffffffffffff',
			};

			mockUseModalState.mockReturnValue(fullState);

			const { result } = renderHook(() => useHandleTransfer());

			await result.current.transfer();

			expect(mockTransferTokensAsync).toHaveBeenCalledWith({
				receiverAddress: fullState.receiverAddress,
				collectionAddress: fullState.collectionAddress,
				tokenId: fullState.collectibleId,
				chainId: fullState.chainId,
				contractType: ContractType.ERC721,
			});

			expect(transferModalStore.send).toHaveBeenCalledWith({
				type: 'completeTransfer',
				hash: mockHash,
			});
			expect(transferModalStore.send).toHaveBeenCalledWith({ type: 'close' });
		});
	});
});
