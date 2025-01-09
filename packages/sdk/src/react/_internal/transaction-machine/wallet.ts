import {
	type Account,
	type Address,
	type Chain,
	type Hex,
	type TransactionReceipt,
	type WalletClient as ViemWalletClient,
	custom,
	hexToBigInt,
	isHex,
} from 'viem';
import type { Connector } from 'wagmi';
import type { SwitchChainErrorType } from 'wagmi/actions';
import { getPublicRpcClient } from '../../../utils';
import {
	ChainSwitchError,
	TransactionConfirmationError,
	TransactionExecutionError,
	TransactionSignatureError,
	UserRejectedRequestError,
} from '../../../utils/_internal/error/transaction';
import { StepType, WalletKind } from '../api';
import { createLogger } from './logger';
import type { SignatureStep, TransactionStep } from './utils';

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
}

export const wallet = ({
	wallet,
	chains,
	connector,
}: {
	wallet: WalletClient;
	chains: readonly [Chain, ...Chain[]];
	connector: Connector;
}): WalletInstance => {
	const logger = createLogger('Wallet');

	return {
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
						domain: stepItem.domain,
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
				const publicClient = getPublicRpcClient(chainId);
				const receipt = await publicClient.waitForTransactionReceipt({
					hash: txHash as Address,
				});
				logger.info('Transaction confirmed', { txHash, receipt });
				return receipt;
			} catch (error) {
				logger.error('Transaction confirmation failed', error);
				throw new TransactionConfirmationError(txHash, error as Error);
			}
		},
	};
};
