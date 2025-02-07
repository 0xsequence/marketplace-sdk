import {
	type Account,
	type Address,
	type Chain,
	type Hex,
	TransactionReceiptNotFoundError,
	type TypedDataDomain,
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
import { ERC1155_ABI, getPublicRpcClient } from '../../../utils';
import {
	ChainSwitchError,
	TransactionConfirmationError,
	TransactionExecutionError,
	TransactionSignatureError,
	UserRejectedRequestError,
} from '../../../utils/_internal/error/transaction';
import { getIndexerClient, StepType, WalletKind } from '../api';
import { createLogger } from '../logger';
import type { SignatureStep, TransactionStep } from '../utils';
import {
	SEQUENCE_MARKET_V1_ADDRESS,
	SEQUENCE_MARKET_V2_ADDRESS,
} from '../../../consts';
import type { SdkConfig } from '../../../types';
import type { TransactionReceipt } from '@0xsequence/indexer';

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
}: {
	wallet: WalletClient;
	chains: readonly [Chain, ...Chain[]];
	connector: Connector;
	sdkConfig: SdkConfig;
}): WalletInstance => {
	const logger = createLogger('Wallet');

	const walletInstance = {
		transport: custom(wallet.transport),
		isWaaS: connector.id.endsWith('waas'),
		walletKind:
			connector.id === 'sequence' ? WalletKind.sequence : WalletKind.unknown,
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
						throw new ChainSwitchError(await wallet.getChainId(), chainId);
					case 'UserRejectedRequestError':
						throw new UserRejectedRequestError();
					case 'ChainNotConfiguredError':
						return;
					default:
						throw new ChainSwitchError(await wallet.getChainId(), chainId);
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
					// biome-ignore lint/style/noUselessElse: <explanation>
				} else if (stepItem.id === StepType.signEIP712) {
					logger.debug('Signing with EIP-712', {
						domain: stepItem.domain,
						types: stepItem.signature?.types,
					});
					return await wallet.signTypedData({
						account: wallet.account,
						domain: stepItem.signature!.domain as TypedDataDomain,
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						types: stepItem.signature!.types,
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						primaryType: stepItem.signature!.primaryType,
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						message: stepItem.signature!.value,
					});
				}
			} catch (error) {
				logger.error('Signature failed', error);
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
			} catch (error) {
				logger.error('Transaction failed', error);
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
			const publicClient = getPublicRpcClient(await wallet.getChainId());
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
					throw new Error('Unsupported contract type for approval checking');
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
