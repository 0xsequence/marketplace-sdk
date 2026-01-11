import { ContractType } from '@0xsequence/api-client';
import { renderHook } from '@test';
import type { Address } from '@0xsequence/api-client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount, useWriteContract } from 'wagmi';
import { NoWalletConnectedError } from '../../../utils/_internal/error/transaction';
import {
	type TransferTokensParams,
	useTransferTokens,
} from './useTransferTokens';

// Mock wagmi hooks
vi.mock('wagmi', async () => {
	const actual = await vi.importActual('wagmi');
	return {
		...actual,
		useAccount: vi.fn(),
		useWriteContract: vi.fn(),
	};
});

const mockUseAccount = vi.mocked(useAccount);
const mockUseWriteContract = vi.mocked(useWriteContract);

describe('useTransferTokens', () => {
	const mockAccountAddress = '0x742d35Cc6634C0532925a3b8D4C9db96' as Address;
	const mockReceiverAddress =
		'0x456789abcdef123456789abcdef123456789abcdef' as Address;
	const mockCollectionAddress =
		'0x123456789abcdef123456789abcdef123456789abc' as Address;
	const mockWriteContractAsync = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();

		mockUseAccount.mockReturnValue({
			address: mockAccountAddress,
			chainId: 1,
			addresses: [mockAccountAddress],
			chain: undefined,
			connector: undefined,
			isConnected: true,
			isConnecting: false,
			isDisconnected: false,
			isReconnecting: false,
			status: 'connected',
			// biome-ignore lint/suspicious/noExplicitAny: nor mocked the full type
		} as any);

		mockUseWriteContract.mockReturnValue({
			writeContractAsync: mockWriteContractAsync,
			data: undefined,
			isPending: false,
			isError: false,
			isSuccess: false,
			error: null,
			status: 'idle',
			variables: undefined,
			isIdle: true,
			reset: vi.fn(),
			context: undefined,
			failureCount: 0,
			failureReason: null,
			isPaused: false,
			submittedAt: 0,
		} as any);
	});

	describe('Hook Return Values', () => {
		it('should return correct interface', () => {
			const { result } = renderHook(() => useTransferTokens());

			expect(result.current).toHaveProperty('transferTokensAsync');
			expect(result.current).toHaveProperty('hash');
			expect(result.current).toHaveProperty('transferring');
			expect(result.current).toHaveProperty('transferFailed');
			expect(result.current).toHaveProperty('transferSuccess');
			expect(typeof result.current.transferTokensAsync).toBe('function');
		});

		it('should return wagmi hook states correctly', () => {
			mockUseWriteContract.mockReturnValue({
				writeContractAsync: mockWriteContractAsync,
				data: '0xhash123',
				isPending: true,
				isError: false,
				isSuccess: false,
				error: null,
				status: 'pending',
				variables: undefined,
				isIdle: false,
				reset: vi.fn(),
				context: undefined,
				failureCount: 0,
				failureReason: null,
				isPaused: false,
				submittedAt: 0,
			} as any);

			const { result } = renderHook(() => useTransferTokens());

			expect(result.current.hash).toBe('0xhash123');
			expect(result.current.transferring).toBe(true);
			expect(result.current.transferFailed).toBe(false);
			expect(result.current.transferSuccess).toBe(false);
		});
	});

	describe('ERC721 Transfers', () => {
		const erc721Params: TransferTokensParams = {
			contractType: ContractType.ERC721,
			chainId: 1,
			collectionAddress: mockCollectionAddress,
			tokenId: 123n,
			receiverAddress: mockReceiverAddress,
		};

		it('should prepare correct ERC721 transfer config', async () => {
			mockWriteContractAsync.mockResolvedValue('0xhash123');

			const { result } = renderHook(() => useTransferTokens());

			await result.current.transferTokensAsync(erc721Params);

			expect(mockWriteContractAsync).toHaveBeenCalledWith({
				abi: expect.any(Array), // erc721Abi
				address: mockCollectionAddress,
				functionName: 'safeTransferFrom',
				args: [mockAccountAddress, mockReceiverAddress, BigInt('123')],
			});
		});

		it('should return transaction hash for ERC721', async () => {
			const expectedHash = '0xabc123def456';
			mockWriteContractAsync.mockResolvedValue(expectedHash);

			const { result } = renderHook(() => useTransferTokens());

			const hash = await result.current.transferTokensAsync(erc721Params);

			expect(hash).toBe(expectedHash);
		});

		it('should handle ERC721 transfer errors', async () => {
			const error = new Error('Transfer failed');
			mockWriteContractAsync.mockRejectedValue(error);

			const { result } = renderHook(() => useTransferTokens());

			await expect(
				result.current.transferTokensAsync(erc721Params),
			).rejects.toThrow('Transfer failed');
		});
	});

	describe('ERC1155 Transfers', () => {
		const erc1155Params: TransferTokensParams = {
			contractType: ContractType.ERC1155,
			chainId: 1,
			collectionAddress: mockCollectionAddress,
			tokenId: 456n,
			receiverAddress: mockReceiverAddress,
			quantity: 5n,
		};

		it('should prepare correct ERC1155 transfer config', async () => {
			mockWriteContractAsync.mockResolvedValue('0xhash456');

			const { result } = renderHook(() => useTransferTokens());

			await result.current.transferTokensAsync(erc1155Params);

			expect(mockWriteContractAsync).toHaveBeenCalledWith({
				abi: expect.any(Array), // ERC1155_ABI
				address: mockCollectionAddress,
				functionName: 'safeTransferFrom',
				args: [
					mockAccountAddress,
					mockReceiverAddress,
					BigInt('456'),
					5n,
					'0x', // data
				],
			});
		});

		it('should return transaction hash for ERC1155', async () => {
			const expectedHash = '0xdef789ghi012';
			mockWriteContractAsync.mockResolvedValue(expectedHash);

			const { result } = renderHook(() => useTransferTokens());

			const hash = await result.current.transferTokensAsync(erc1155Params);

			expect(hash).toBe(expectedHash);
		});

		it('should handle ERC1155 transfer errors', async () => {
			const error = new Error('ERC1155 transfer failed');
			mockWriteContractAsync.mockRejectedValue(error);

			const { result } = renderHook(() => useTransferTokens());

			await expect(
				result.current.transferTokensAsync(erc1155Params),
			).rejects.toThrow('ERC1155 transfer failed');
		});

		it('should handle different quantity values', async () => {
			mockWriteContractAsync.mockResolvedValue('0xhash');

			const { result } = renderHook(() => useTransferTokens());

			// Test with large quantity
			await result.current.transferTokensAsync({
				...erc1155Params,
				quantity: 1000000n,
			});

			expect(mockWriteContractAsync).toHaveBeenCalledWith(
				expect.objectContaining({
					args: expect.arrayContaining([1000000n]),
				}),
			);
		});
	});

	describe('Error Handling', () => {
		it('should throw NoWalletConnectedError when no account address', async () => {
			mockUseAccount.mockReturnValue({
				address: undefined,
				chainId: 1,
				addresses: undefined,
				chain: undefined,
				connector: undefined,
				isConnected: false,
				isConnecting: false,
				isDisconnected: true,
				isReconnecting: false,
				status: 'disconnected',
			} as any);

			const { result } = renderHook(() => useTransferTokens());

			const erc721Params: TransferTokensParams = {
				contractType: ContractType.ERC721,
				chainId: 1,
				collectionAddress: mockCollectionAddress,
				tokenId: 123n,
				receiverAddress: mockReceiverAddress,
			};

			await expect(
				result.current.transferTokensAsync(erc721Params),
			).rejects.toThrow(NoWalletConnectedError);
		});

		it('should not call writeContractAsync when no wallet connected', async () => {
			mockUseAccount.mockReturnValue({
				address: undefined,
				chainId: 1,
				addresses: undefined,
				chain: undefined,
				connector: undefined,
				isConnected: false,
				isConnecting: false,
				isDisconnected: true,
				isReconnecting: false,
				status: 'disconnected',
			} as any);

			const { result } = renderHook(() => useTransferTokens());

			const erc721Params: TransferTokensParams = {
				contractType: ContractType.ERC721,
				chainId: 1,
				collectionAddress: mockCollectionAddress,
				tokenId: 123n,
				receiverAddress: mockReceiverAddress,
			};

			try {
				await result.current.transferTokensAsync(erc721Params);
			} catch {
				// Expected to throw
			}

			expect(mockWriteContractAsync).not.toHaveBeenCalled();
		});
	});

	describe('State Updates', () => {
		it('should reflect isPending state', () => {
			mockUseWriteContract.mockReturnValue({
				writeContractAsync: mockWriteContractAsync,
				data: undefined,
				isPending: true,
				isError: false,
				isSuccess: false,
				error: null,
				status: 'pending',
				variables: undefined,
				isIdle: false,
				reset: vi.fn(),
				context: undefined,
				failureCount: 0,
				failureReason: null,
				isPaused: false,
				submittedAt: 0,
			} as any);

			const { result } = renderHook(() => useTransferTokens());

			expect(result.current.transferring).toBe(true);
		});

		it('should reflect isError state', () => {
			mockUseWriteContract.mockReturnValue({
				writeContractAsync: mockWriteContractAsync,
				data: undefined,
				isPending: false,
				isError: true,
				isSuccess: false,
				error: new Error('Contract error'),
				status: 'error',
				variables: undefined,
				isIdle: false,
				reset: vi.fn(),
				context: undefined,
				failureCount: 1,
				failureReason: new Error('Contract error'),
				isPaused: false,
				submittedAt: 0,
			} as any);

			const { result } = renderHook(() => useTransferTokens());

			expect(result.current.transferFailed).toBe(true);
		});

		it('should reflect isSuccess state', () => {
			mockUseWriteContract.mockReturnValue({
				writeContractAsync: mockWriteContractAsync,
				data: '0xsuccess123',
				isPending: false,
				isError: false,
				isSuccess: true,
				error: null,
				status: 'success',
				variables: undefined,
				isIdle: false,
				reset: vi.fn(),
				context: undefined,
				failureCount: 0,
				failureReason: null,
				isPaused: false,
				submittedAt: 0,
			} as any);

			const { result } = renderHook(() => useTransferTokens());

			expect(result.current.transferSuccess).toBe(true);
			expect(result.current.hash).toBe('0xsuccess123');
		});
	});

	describe('Integration with Wagmi Mocks', () => {
		it('should work with wagmi test configuration', () => {
			// This test verifies the hook works with our existing wagmi mock setup
			const { result } = renderHook(() => useTransferTokens(), {
				useEmbeddedWallet: false, // Use standard mock connector
			});

			expect(result.current.transferTokensAsync).toBeDefined();
			expect(typeof result.current.transferTokensAsync).toBe('function');
		});

		it('should work with WaaS wallet configuration', () => {
			const { result } = renderHook(() => useTransferTokens(), {
				useEmbeddedWallet: true, // Use WaaS mock connector
			});

			expect(result.current.transferTokensAsync).toBeDefined();
			expect(typeof result.current.transferTokensAsync).toBe('function');
		});
	});

	describe('Contract Interaction', () => {
		it('should handle contract call success', async () => {
			const expectedHash = '0xcontract123success';
			mockWriteContractAsync.mockResolvedValue(expectedHash);

			const { result } = renderHook(() => useTransferTokens());

			const erc721Params: TransferTokensParams = {
				contractType: ContractType.ERC721,
				chainId: 1,
				collectionAddress: mockCollectionAddress,
				tokenId: 789n,
				receiverAddress: mockReceiverAddress,
			};

			const hash = await result.current.transferTokensAsync(erc721Params);

			expect(hash).toBe(expectedHash);
			expect(mockWriteContractAsync).toHaveBeenCalledTimes(1);
		});

		it('should handle contract call failure', async () => {
			const contractError = new Error('Contract execution reverted');
			mockWriteContractAsync.mockRejectedValue(contractError);

			const { result } = renderHook(() => useTransferTokens());

			const erc721Params: TransferTokensParams = {
				contractType: ContractType.ERC721,
				chainId: 1,
				collectionAddress: mockCollectionAddress,
				tokenId: 789n,
				receiverAddress: mockReceiverAddress,
			};

			await expect(
				result.current.transferTokensAsync(erc721Params),
			).rejects.toThrow('Contract execution reverted');
		});
	});

	describe('Parameter Validation', () => {
		it('should handle different token ID formats', async () => {
			mockWriteContractAsync.mockResolvedValue('0xhash');

			const { result } = renderHook(() => useTransferTokens());

			// Test with string token ID
			await result.current.transferTokensAsync({
				contractType: ContractType.ERC721,
				chainId: 1,
				collectionAddress: mockCollectionAddress,
				tokenId: 999999999999999999999n,
				receiverAddress: mockReceiverAddress,
			});

			expect(mockWriteContractAsync).toHaveBeenCalledWith(
				expect.objectContaining({
					args: expect.arrayContaining([BigInt('999999999999999999999')]),
				}),
			);
		});

		it('should handle different chain IDs', async () => {
			mockWriteContractAsync.mockResolvedValue('0xhash');

			const { result } = renderHook(() => useTransferTokens());

			const polygonParams: TransferTokensParams = {
				contractType: ContractType.ERC721,
				chainId: 137, // Polygon
				collectionAddress: mockCollectionAddress,
				tokenId: 123n,
				receiverAddress: mockReceiverAddress,
			};

			await result.current.transferTokensAsync(polygonParams);

			expect(mockWriteContractAsync).toHaveBeenCalled();
		});
	});
});
