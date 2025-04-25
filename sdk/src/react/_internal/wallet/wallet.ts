import type { TransactionReceipt } from '@0xsequence/indexer';
import {
	type Account,
	type Address,
	type Chain,
	type Hex,
	type PublicClient,
	TransactionReceiptNotFoundError,
	type TypedDataDomain,
	UserRejectedRequestError as ViemUserRejectedRequestError,
	type WalletClient as ViemWalletClient,
	WaitForTransactionReceiptTimeoutError,
	custom,
	erc20Abi,
	erc721Abi,
	hexToBigInt,
	isHex,
} from 'viem';
import type { Connector } from 'wagmi';
import type { SwitchChainErrorType } from 'wagmi/actions';
import {
	SEQUENCE_MARKET_V1_ADDRESS,
	SEQUENCE_MARKET_V2_ADDRESS,
} from '../../../consts';
import type { SdkConfig } from '../../../types';
import { ERC1155_ABI } from '../../../utils';
import {
	BaseError,
	ErrorCodes,
	createError,
	createUserRejectionError,
} from '../../../utils/_internal/error';
import { StepType, WalletKind, getIndexerClient } from '../api';
import { createLogger } from '../logger';
import type { SignatureStep, TransactionStep } from '../utils';

interface WalletClient extends Omit<ViemWalletClient, 'account'> {
	account: Account;
}

export interface WalletInstance {
	transport: ReturnType<typeof custom>;
	isWaaS: boolean;
	walletKind: WalletKind;
	getChainId: () => Promise<number>;
	switchChain: (chainId: number) => Promise<void>;
	address: () => Promise<Hex>;
	handleSignMessageStep: (stepItem: SignatureStep) => Promise<Hex | undefined>;
	handleSendTransactionStep: (
		chainId: number,
		stepItem: TransactionStep,
	) => Promise<Hex>;
	handleConfirmTransactionStep: (
		txHash: Hex,
		chainId: number,
	) => Promise<TransactionReceipt>;
	hasTokenApproval: (args: {
		tokenType: 'ERC20' | 'ERC721' | 'ERC1155';
		contractAddress: Address;
		spender: Address | 'sequenceMarketV1' | 'sequenceMarketV2';
	}) => Promise<bigint | boolean>;
}

export const wallet = ({
	wallet,
	chains,
	connector,
	sdkConfig,
	publicClient,
}: {
	wallet: WalletClient;
	chains: readonly [Chain, ...Chain[]];
	connector: Connector;
	sdkConfig: SdkConfig;
	publicClient: PublicClient;
}): WalletInstance => {
	const logger = createLogger('Wallet');

	const isSequenceWallet =
		connector.id === 'sequence' || connector.id === 'sequence-waas';

	const walletInstance = {
		transport: custom(wallet.transport),
		isWaaS: connector.id.endsWith('waas'),
		walletKind: isSequenceWallet ? WalletKind.sequence : WalletKind.unknown,
		getChainId: wallet.getChainId,
		address: async () => {
			let address = wallet.account?.address;
			if (!address) {
				[address] = await wallet.getAddresses();
			}
			return address;
		},
		switchChain: async (chainId: number) => {
			logger.debug('Switching chain', { targetChainId: chainId });

			try {
				await wallet.switchChain({
					id: chainId,
				});
				logger.info('Chain switch successful', { chainId });
				return;
			} catch (e) {
				const error = e as SwitchChainErrorType;
				logger.error('Chain switch failed', error);

				switch (error.name) {
					case 'SwitchChainNotSupportedError':
						throw createError(ErrorCodes.TX_CHAIN_SWITCH_FAILED, {
							params: {
								currentChainId: await wallet.getChainId(),
								targetChainId: chainId,
							},
						});
					case 'UserRejectedRequestError':
						throw createUserRejectionError();
					case 'ChainNotConfiguredError':
						return;
					default:
						throw createError(ErrorCodes.TX_CHAIN_SWITCH_FAILED, {
							cause: error,
							params: {
								currentChainId: await wallet.getChainId(),
								targetChainId: chainId,
							},
						});
				}
			}
		},
		handleSignMessageStep: async (stepItem: SignatureStep) => {
			try {
				if (stepItem.id === StepType.signEIP191) {
					logger.debug('Signing with EIP-191', { data: stepItem.data });
					const message = isHex(stepItem.data)
						? { raw: stepItem.data }
						: stepItem.data;
					return await wallet.signMessage({
						account: wallet.account,
						message,
					});
				}

				if (stepItem.id === StepType.signEIP712) {
					logger.debug('Signing with EIP-712', {
						domain: stepItem.domain,
						types: stepItem.signature?.types,
					});

					if (!stepItem.signature) {
						throw createError(ErrorCodes.STEP_MISSING_SIGNATURE, {
							params: { stepId: stepItem.id },
						});
					}

					return await wallet.signTypedData({
						account: wallet.account,
						domain: stepItem.signature.domain as TypedDataDomain,
						types: stepItem.signature.types,
						primaryType: stepItem.signature.primaryType,
						message: stepItem.signature.value,
					});
				}

				return undefined;
			} catch (e) {
				const error = e as Error;
				logger.error('Signature failed', error);

				if (error instanceof BaseError) {
					const viemError = error as BaseError;
					if (viemError instanceof ViemUserRejectedRequestError) {
						throw createUserRejectionError();
					}
				}

				throw createError(ErrorCodes.TX_SIGNATURE_FAILED, {
					cause: error,
					params: { stepId: stepItem.id },
				});
			}
		},
		handleSendTransactionStep: async (
			chainId: number,
			stepItem: TransactionStep,
		) => {
			logger.debug('Sending transaction', {
				chainId,
				to: stepItem.to,
				value: stepItem.value,
			});

			const chain = chains.find((chain) => chain.id === chainId);
			try {
				return await wallet.sendTransaction({
					chain,
					data: stepItem.data,
					account: wallet.account,
					to: stepItem.to,
					value: hexToBigInt(stepItem.value || '0x0'),
					...(stepItem.maxFeePerGas && {
						maxFeePerGas: hexToBigInt(stepItem.maxFeePerGas),
					}),
					...(stepItem.maxPriorityFeePerGas && {
						maxPriorityFeePerGas: hexToBigInt(stepItem.maxPriorityFeePerGas),
					}),
					...(stepItem.gas && {
						gas: hexToBigInt(stepItem.gas),
					}),
				});
			} catch (e) {
				const error = e as Error;
				logger.error('Transaction failed', error);

				if (error.cause instanceof BaseError) {
					const viemError = error.cause as BaseError;
					if (viemError instanceof ViemUserRejectedRequestError) {
						throw createUserRejectionError();
					}
				}

				throw createError(ErrorCodes.TX_EXECUTION_FAILED, {
					cause: error,
					params: { stepId: stepItem.id },
				});
			}
		},
		handleConfirmTransactionStep: async (txHash: Hex, chainId: number) => {
			logger.debug('Confirming transaction', { txHash, chainId });
			try {
				const receipt = await awaitTransactionReceipt({
					txHash,
					chainId,
					sdkConfig,
				});
				logger.info('Transaction confirmed', { txHash, receipt });
				return receipt;
			} catch (error) {
				logger.error('Transaction confirmation failed', error);

				if (error === TransactionReceiptNotFoundError) {
					throw createError(ErrorCodes.TX_RECEIPT_NOT_FOUND, {
						params: { txHash },
					});
				}

				if (error === WaitForTransactionReceiptTimeoutError) {
					throw createError(ErrorCodes.TX_CONFIRMATION_FAILED, {
						cause: error as Error,
						params: { txHash },
					});
				}

				throw createError(ErrorCodes.TX_CONFIRMATION_FAILED, {
					cause: error as Error,
					params: { txHash },
				});
			}
		},
		hasTokenApproval: async ({
			tokenType,
			contractAddress,
			spender,
		}: {
			tokenType: 'ERC20' | 'ERC721' | 'ERC1155';
			contractAddress: Address;
			spender: Address | 'sequenceMarketV1' | 'sequenceMarketV2';
		}) => {
			try {
				const walletAddress = await walletInstance.address();
				const spenderAddress =
					spender === 'sequenceMarketV1'
						? SEQUENCE_MARKET_V1_ADDRESS
						: spender === 'sequenceMarketV2'
							? SEQUENCE_MARKET_V2_ADDRESS
							: spender;

				switch (tokenType) {
					case 'ERC20':
						return await publicClient.readContract({
							address: contractAddress as Hex,
							abi: erc20Abi,
							functionName: 'allowance',
							args: [walletAddress, spenderAddress],
						});
					case 'ERC721':
						return await publicClient.readContract({
							address: contractAddress as Hex,
							abi: erc721Abi,
							functionName: 'isApprovedForAll',
							args: [walletAddress, spenderAddress],
						});
					case 'ERC1155':
						return await publicClient.readContract({
							address: contractAddress as Hex,
							abi: ERC1155_ABI,
							functionName: 'isApprovedForAll',
							args: [walletAddress, spenderAddress],
						});
					default:
						throw createError(ErrorCodes.CONTRACT_INVALID_TYPE, {
							params: { contractType: tokenType },
						});
				}
			} catch (error) {
				throw createError(ErrorCodes.TX_EXECUTION_FAILED, {
					cause: error as Error,
					params: {
						method: 'hasTokenApproval',
						tokenType,
						contractAddress,
						spender,
					},
				});
			}
		},
	};

	return walletInstance;
};

const ONE_MIN = 60 * 1000;
const THREE_MIN = 3 * ONE_MIN;

const awaitTransactionReceipt = async ({
	txHash,
	chainId,
	sdkConfig,
	timeout = THREE_MIN,
}: {
	txHash: Hex;
	chainId: number;
	sdkConfig: SdkConfig;
	timeout?: number;
}) => {
	const indexer = getIndexerClient(chainId, sdkConfig);
	return Promise.race([
		new Promise<TransactionReceipt>((resolve, reject) => {
			indexer.subscribeReceipts(
				{
					filter: {
						txnHash: txHash,
					},
				},
				{
					onMessage: ({ receipt }) => {
						resolve(receipt);
					},
					onError: () => {
						reject(TransactionReceiptNotFoundError);
					},
				},
			);
		}),
		new Promise<TransactionReceipt>((_, reject) => {
			setTimeout(() => {
				reject(WaitForTransactionReceiptTimeoutError);
			}, timeout);
		}),
	]);
};
