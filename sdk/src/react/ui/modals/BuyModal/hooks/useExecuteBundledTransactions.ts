import { sendTransactions } from '@0xsequence/connect';
import type { FeeOption } from '@0xsequence/waas';
import { useState } from 'react';
import type { Hex } from 'viem';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { useConfig } from '../../../..';
import { getIndexerClient, type Step } from '../../../../_internal';
import { useBuyModalData } from './useBuyModalData';

// https://github.com/0xsequence/web-sdk/blob/620b6fe7681ae49efd4eb3fa7607ef01dd7ede54/packages/connect/src/utils/transactions.ts#L11-L19
class FeeOptionInsufficientFundsError extends Error {
	public readonly feeOptions: FeeOption[];

	constructor(message: string, feeOptions: FeeOption[]) {
		super(message);
		this.name = 'FeeOptionInsufficientFundsError';
		this.feeOptions = feeOptions;
	}
}

type UseExecuteBundledTransactions = {
	chainId: number;
	approvalStep?: Step;
	priceAmount: bigint;
};

const useExecuteBundledTransactions = ({
	chainId,
	approvalStep,
	priceAmount,
}: UseExecuteBundledTransactions) => {
	const config = useConfig();
	const [isExecuting, setIsExecuting] = useState(false);
	const { address, connector } = useAccount();
	const publicClient = usePublicClient();
	const { data: walletClient } = useWalletClient();
	const indexerClient = getIndexerClient(chainId, config);

	const { collection, currency } = useBuyModalData();

	const isReady =
		!!address &&
		!!publicClient &&
		!!walletClient &&
		!!indexerClient &&
		!!connector &&
		!!collection?.address &&
		priceAmount != null;

	const executeBundledTransactions = async ({
		step,
		onBalanceInsufficientForFeeOption,
		onTransactionFailed,
	}: {
		step: Step;
		onBalanceInsufficientForFeeOption?: (error: Error) => void;
		onTransactionFailed?: (error: Error) => void;
	}) => {
		setIsExecuting(true);

		try {
			if (!address) {
				throw new Error('Address not found');
			}

			if (!publicClient) {
				throw new Error('Public client not found');
			}

			if (!walletClient) {
				throw new Error('Wallet client not found');
			}

			if (!indexerClient) {
				throw new Error('Indexer client not found');
			}

			if (!connector) {
				throw new Error('Connector not found');
			}

			if (!collection?.address) {
				throw new Error('Collection address not found');
			}

			if (priceAmount == null) {
				throw new Error('Price amount not found');
			}

			const approvalData = approvalStep
				? {
						to: approvalStep.to,
						data: approvalStep.data as Hex,
						chainId,
					}
				: undefined;

			const transactionData = {
				to: step.to,
				data: step.data as Hex,
				chainId,
				...(currency?.nativeCurrency ? { value: priceAmount } : {}),
			};

			const transactions = [
				...(approvalData ? [approvalData] : []),
				transactionData,
			];

			const sendTransactionFns = await sendTransactions({
				chainId,
				senderAddress: address,
				publicClient,
				walletClient,
				// TODO: Remove @ts-expect-error once @0xsequence/connect is updated to support
				// the latest @0xsequence/indexer types. Currently there's a type mismatch
				// between the indexer client version expected by connect and the one we use.
				// @ts-expect-error - Temporary: indexer client type mismatch, remove when deps updated
				indexerClient,
				connector,
				transactions,
				transactionConfirmations: 1,
				waitConfirmationForLastTransaction: false,
			});

			if (!sendTransactionFns.length) {
				throw new Error('No transactions returned');
			}

			let txHash: string | undefined;

			for (const sendTransaction of sendTransactionFns) {
				txHash = await sendTransaction();
			}

			if (!txHash) {
				throw new Error('Transaction hash not found');
			}

			return txHash;
		} catch (error) {
			if (error instanceof FeeOptionInsufficientFundsError) {
				if (onBalanceInsufficientForFeeOption) {
					onBalanceInsufficientForFeeOption(error);
				}

				throw error;
			}

			if (onTransactionFailed) {
				onTransactionFailed(error as Error);
			}

			throw error;
		} finally {
			setIsExecuting(false);
		}
	};

	return {
		executeBundledTransactions,
		isExecuting,
		isReady,
	};
};

export { useExecuteBundledTransactions };
