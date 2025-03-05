import {
	type Account,
	type Address,
	type Chain,
	type WalletClient,
	hexToBigInt,
} from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Connector } from 'wagmi';
import type { SdkConfig } from '../../../../types';
import {
	ChainSwitchError,
	TransactionExecutionError,
	TransactionSignatureError,
	UserRejectedRequestError,
} from '../../../../utils/_internal/error/transaction';
import { StepType, WalletKind } from '../../api';
import { mockIndexerHandler } from '../../api/__mocks__/indexer.msw';
import { mockMetadataHandler } from '../../api/__mocks__/metadata.msw';
import { server } from '../../test/setup';
import type { SignatureStep, TransactionStep } from '../../utils';
import { wallet } from '../wallet';

describe('wallet', () => {
	const mockChains = [
		{ id: 1, name: 'Ethereum' },
		{ id: 137, name: 'Polygon' },
	] as unknown as readonly [Chain, ...Chain[]];

	const mockAddress = '0x1234567890123456789012345678901234567890' as Address;
	const mockAccount: Account = {
		address: mockAddress,
		type: 'json-rpc',
	};

	const mockConnector = {
		id: 'sequence',
		name: 'Sequence',
		type: 'injected',
		connect: vi.fn(),
		disconnect: vi.fn(),
		getAccount: vi.fn(),
		getAccounts: vi.fn(),
		getChainId: vi.fn(),
		getProvider: vi.fn(),
		isAuthorized: vi.fn(),
		onAccountsChanged: vi.fn(),
		onChainChanged: vi.fn(),
		onDisconnect: vi.fn(),
	} as unknown as Connector;

	const mockTransport = {
		key: 'mock',
		name: 'Mock Transport',
		request: vi.fn(),
		type: 'mock',
	};

	const mockWalletClient = {
		account: mockAccount,
		transport: mockTransport,
		type: 'walletClient',
		chain: mockChains[0],
		uid: 'test-uid',
		key: 'mock',
		name: 'Mock Wallet',
		cacheTime: 0,
		pollingInterval: 0,
		request: vi.fn(),
		extend: vi.fn(),
		getChainId: vi.fn().mockResolvedValue(1),
		getAddresses: vi.fn().mockResolvedValue([mockAddress]),
		switchChain: vi.fn(),
		signMessage: vi.fn(),
		signTypedData: vi.fn(),
		sendTransaction: vi.fn(),
		signTransaction: vi.fn(),
		addChain: vi.fn(),
		deployContract: vi.fn(),
		getPermissions: vi.fn(),
		requestAddresses: vi.fn(),
		requestPermissions: vi.fn(),
		watchAsset: vi.fn(),
		writeContract: vi.fn(),
		prepareTransactionRequest: vi.fn(),
		sendRawTransaction: vi.fn(),
	} as unknown as WalletClient & { account: Account };

	const mockSdkConfig: SdkConfig = {
		projectAccessKey: 'test-key',
		projectId: 'test-project',
	};

	let walletInstance: ReturnType<typeof wallet>;

	beforeEach(() => {
		walletInstance = wallet({
			wallet: mockWalletClient,
			chains: mockChains,
			connector: mockConnector,
			sdkConfig: mockSdkConfig,
		});
	});

	describe('initialization', () => {
		it('should create wallet instance with correct properties', () => {
			expect(walletInstance.transport).toBeDefined();
			expect(walletInstance.isWaaS).toBe(false);
			expect(walletInstance.walletKind).toBe(WalletKind.sequence);
		});
	});

	describe('address', () => {
		it('should return wallet address', async () => {
			const address = await walletInstance.address();
			expect(address).toBe(mockAddress);
		});
	});

	describe('switchChain', () => {
		it('should switch chain successfully', async () => {
			await walletInstance.switchChain(137);
			expect(mockWalletClient.switchChain).toHaveBeenCalledWith({ id: 137 });
		});

		it('should throw ChainSwitchError on unsupported chain switch', async () => {
			vi.mocked(mockWalletClient.switchChain).mockRejectedValueOnce({
				name: 'SwitchChainNotSupportedError',
			});
			await expect(walletInstance.switchChain(137)).rejects.toThrow(
				ChainSwitchError,
			);
		});

		it('should throw UserRejectedRequestError when user rejects chain switch', async () => {
			vi.mocked(mockWalletClient.switchChain).mockRejectedValueOnce({
				name: 'UserRejectedRequestError',
			});
			await expect(walletInstance.switchChain(137)).rejects.toThrow(
				UserRejectedRequestError,
			);
		});
	});

	describe('handleSignMessageStep', () => {
		const mockSignatureStep: SignatureStep = {
			id: StepType.signEIP191,
			data: '0xmessage',
			to: '0x456' as Address,
			value: '0x0',
			price: '0x0',
			post: {
				endpoint: '/api/test',
				method: 'POST',
				body: {},
			},
		};

		it('should handle EIP-191 signature', async () => {
			// Add MSW handler for any API calls that might happen during signing
			server.use(
				mockIndexerHandler('GetTokenBalances', {
					page: { page: 1, pageSize: 10, more: false },
					balances: [],
				}),
			);

			const mockSignature = '0xsignature';
			vi.mocked(mockWalletClient.signMessage).mockResolvedValueOnce(
				mockSignature,
			);

			const result =
				await walletInstance.handleSignMessageStep(mockSignatureStep);

			expect(result).toBe(mockSignature);
			expect(mockWalletClient.signMessage).toHaveBeenCalled();
		});

		it('should handle EIP-712 signature', async () => {
			const mockEip712Step: SignatureStep & {
				signature: NonNullable<SignatureStep['signature']>;
			} = {
				id: StepType.signEIP712,
				data: '0x',
				to: '0x456' as Address,
				value: '0x0',
				price: '0x0',
				post: {
					endpoint: '/api/test',
					method: 'POST',
					body: {},
				},
				signature: {
					domain: {
						name: 'Test Domain',
						version: '1',
						chainId: 1,
						verifyingContract: '0x123' as Address,
					},
					types: {},
					primaryType: 'Mail',
					value: {},
				},
			};

			// Add specific handler for EIP-712 signing
			server.use(
				mockMetadataHandler('GetContractInfo', {
					contractInfo: {
						address: mockEip712Step.signature.domain.verifyingContract,
						chainId: mockEip712Step.signature.domain.chainId,
						name: mockEip712Step.signature.domain.name,
						type: 'ERC721',
					},
				}),
			);

			const mockSignature = '0xsignature';
			vi.mocked(mockWalletClient.signTypedData).mockResolvedValueOnce(
				mockSignature,
			);

			const result = await walletInstance.handleSignMessageStep(mockEip712Step);

			expect(result).toBe(mockSignature);
			expect(mockWalletClient.signTypedData).toHaveBeenCalled();
		});

		it('should throw TransactionSignatureError on signature failure', async () => {
			vi.mocked(mockWalletClient.signMessage).mockRejectedValueOnce(
				new Error('Signature failed'),
			);

			await expect(
				walletInstance.handleSignMessageStep(mockSignatureStep),
			).rejects.toThrow(TransactionSignatureError);
		});
	});

	describe('handleSendTransactionStep', () => {
		const mockTxStep: TransactionStep = {
			id: StepType.buy,
			to: '0x456' as Address,
			value: '0x0',
			data: '0x',
			price: '0x0',
		};

		it('should send transaction successfully', async () => {
			// Add MSW handler for transaction-related API calls
			server.use(
				mockIndexerHandler('FetchTransactionReceipt', {
					receipt: {
						txnHash: '0xtxhash',
						txnStatus: 'SUCCESSFUL',
					},
				}),
			);

			const mockTxHash = '0xtxhash';
			vi.mocked(mockWalletClient.sendTransaction).mockResolvedValueOnce(
				mockTxHash,
			);

			const result = await walletInstance.handleSendTransactionStep(
				1,
				mockTxStep,
			);

			expect(result).toBe(mockTxHash);
			expect(mockWalletClient.sendTransaction).toHaveBeenCalledWith(
				expect.objectContaining({
					to: mockTxStep.to,
					value: hexToBigInt('0x0'),
				}),
			);
		});

		it('should throw TransactionExecutionError on transaction failure', async () => {
			vi.mocked(mockWalletClient.sendTransaction).mockRejectedValueOnce(
				new Error('Transaction failed'),
			);

			await expect(
				walletInstance.handleSendTransactionStep(1, mockTxStep),
			).rejects.toThrow(TransactionExecutionError);
		});

		it('should handle transaction with contract interaction', async () => {
			const mockContractTxStep: TransactionStep = {
				id: StepType.buy,
				to: '0x456' as Address,
				price: '0x0',
				value: '0x0',
				data: '0x123456', // Mock contract interaction data
			};

			// Add handlers for contract-related API calls
			server.use(
				mockIndexerHandler('FetchTransactionReceipt', {
					receipt: {
						txnHash: '0xtxhash',
						txnStatus: 'SUCCESSFUL',
						logs: [],
					},
				}),
				mockMetadataHandler('GetContractInfo', {
					contractInfo: {
						address: mockContractTxStep.to,
						chainId: 1,
						name: 'Test Contract',
						type: 'ERC721',
					},
				}),
			);

			const mockTxHash = '0xtxhash';
			vi.mocked(mockWalletClient.sendTransaction).mockResolvedValueOnce(
				mockTxHash,
			);

			const result = await walletInstance.handleSendTransactionStep(
				1,
				mockContractTxStep,
			);

			expect(result).toBe(mockTxHash);
			expect(mockWalletClient.sendTransaction).toHaveBeenCalledWith(
				expect.objectContaining({
					to: mockContractTxStep.to,
					data: mockContractTxStep.data,
				}),
			);
		});
	});
});
