import {
	type Account,
	type WalletClient as ViemWalletClient,
	custom,
	hexToBigInt,
	type Chain,
	isHex,
	type Hex,
} from 'viem';
import { createLogger } from './logger';
import type { SignatureStep, TransactionStep } from './utils';
import { StepType, WalletKind } from '../api';
import type { Connector } from 'wagmi';

interface WalletClient extends Omit<ViemWalletClient, 'account'> {
	account: Account;
}

export interface WalletInstance {
	transport: ReturnType<typeof custom>;
	isWaaS: boolean;
	walletKind: WalletKind;
	address: () => Promise<Hex>;
	handleSignMessageStep: (stepItem: SignatureStep) => Promise<Hex | undefined>;
	handleSendTransactionStep: (
		chainId: number,
		stepItem: TransactionStep,
	) => Promise<Hex>;
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
		address: async () => {
			let address = wallet.account?.address;
			if (!address) {
				[address] = await wallet.getAddresses();
			}
			return address;
		},
		handleSignMessageStep: async (stepItem: SignatureStep) => {
			if (stepItem.id === StepType.signEIP191) {
				logger.debug('Execute Steps: Signing with eip191');
				const message = isHex(stepItem.data)
					? { raw: stepItem.data }
					: stepItem.data;
				return await wallet.signMessage({
					account: wallet.account,
					message,
				});
			} else if (stepItem.id === StepType.signEIP712) {
				logger.debug('Execute Steps: Signing with eip712');
				return await wallet.signTypedData({
					account: wallet.account,
					domain: stepItem.domain,
					types: stepItem.signature!.types,
					primaryType: stepItem.signature!.primaryType,
					message: stepItem.signature!.value,
				});
			}
		},
		handleSendTransactionStep: async (
			chainId: number,
			stepItem: TransactionStep,
		) => {
			const chain = chains.find((chain) => chain.id === chainId);
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
		},
	};
};
