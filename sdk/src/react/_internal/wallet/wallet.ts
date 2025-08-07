import type { TransactionReceipt } from '@0xsequence/indexer';
import {
	type Account,
	type Address,
	BaseError,
	type Chain,
	custom,
	erc20Abi,
	erc721Abi,
	type Hex,
	hexToBigInt,
	isHex,
	type PublicClient,
	TransactionReceiptNotFoundError,
	type TypedDataDomain,
	UserRejectedRequestError as ViemUserRejectedRequestError,
	type WalletClient as ViemWalletClient,
	WaitForTransactionReceiptTimeoutError,
} from 'viem';

import {
	SEQUENCE_MARKET_V1_ADDRESS,
	SEQUENCE_MARKET_V2_ADDRESS,
} from '../../../consts';
import type { SdkConfig } from '../../../types/index';
import { ERC1155_ABI } from '../../../utils';
import {
	TransactionConfirmationError,
	TransactionExecutionError,
	TransactionSignatureError,
	UserRejectedRequestError,
} from '../../../utils/_internal/error/transaction';
import { getIndexerClient, StepType } from '../api';
import { createLogger } from '../logger';
import type { SignatureStep, TransactionStep } from '../utils';

interface WalletClient extends Omit<ViemWalletClient, 'account'> {
	account: Account;
}

export interface WalletInstance {
	transport: ReturnType<typeof custom>;
	getChainId: () => Promise<number>;
	address: () => Promise<Address>;
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
	publicClient: PublicClient;
}

export const wallet = ({
	wallet,
	chains,
	sdkConfig,
	publicClient,
}: {
	wallet: WalletClient;
	chains: readonly [Chain, ...Chain[]];
	sdkConfig: SdkConfig;
	publicClient: PublicClient;
}): WalletInstance => {
	const logger = createLogger('Wallet');

	const walletInstance = {
		transport: custom(wallet.transport),
		getChainId: wallet.getChainId,
		address: async () => {
			let address = wallet.account?.address;
			if (!address) {
				[address] = await wallet.getAddresses();
			}
			return address;
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
					return await wallet.signTypedData({
						account: wallet.account,
						// biome-ignore lint/style/noNonNullAssertion: signature is guaranteed to exist for EIP712 step type
						domain: stepItem.signature!.domain as TypedDataDomain,
						// biome-ignore lint/style/noNonNullAssertion: signature is guaranteed to exist for EIP712 step type
						types: stepItem.signature!.types,
						// biome-ignore lint/style/noNonNullAssertion: signature is guaranteed to exist for EIP712 step type
						primaryType: stepItem.signature!.primaryType,
						// biome-ignore lint/style/noNonNullAssertion: signature is guaranteed to exist for EIP712 step type
						message: stepItem.signature!.value,
					});
				}
			} catch (e) {
				const error = e as TransactionSignatureError;
				logger.error('Signature failed', error);

				if (error.cause instanceof BaseError) {
					const viemError = error.cause as BaseError;
					if (viemError instanceof ViemUserRejectedRequestError) {
						throw new UserRejectedRequestError();
					}
				}

				throw new TransactionSignatureError(stepItem.id, error as Error);
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
				const error = e as TransactionExecutionError;
				logger.error('Transaction failed', error);

				if (error.cause instanceof BaseError) {
					const viemError = error.cause as BaseError;
					if (viemError instanceof ViemUserRejectedRequestError) {
						throw new UserRejectedRequestError();
					}
				}

				throw new TransactionExecutionError(stepItem.id, error as Error);
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

				throw new TransactionConfirmationError(txHash, error as Error);
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
			const walletAddress = await walletInstance.address();
			const spenderAddress =
				spender === 'sequenceMarketV1'
					? SEQUENCE_MARKET_V1_ADDRESS
					: spender === 'sequenceMarketV2'
						? SEQUENCE_MARKET_V2_ADDRESS
						: spender;

			switch (tokenType) {
				case 'ERC20':
					return (await publicClient.readContract({
						address: contractAddress as Address,
						abi: erc20Abi,
						functionName: 'allowance',
						args: [walletAddress, spenderAddress],
					})) as bigint;
				case 'ERC721':
					return (await publicClient.readContract({
						address: contractAddress as Address,
						abi: erc721Abi,
						functionName: 'isApprovedForAll',
						args: [walletAddress, spenderAddress],
					})) as boolean;
				case 'ERC1155':
					return (await publicClient.readContract({
						address: contractAddress as Address,
						abi: ERC1155_ABI,
						functionName: 'isApprovedForAll',
						args: [walletAddress, spenderAddress],
					})) as boolean;
				default:
					throw new Error('Unsupported contract type for approval checking');
			}
		},
		publicClient,
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
