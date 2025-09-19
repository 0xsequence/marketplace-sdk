import { sendTransactions } from '@0xsequence/connect';
import type { FeeOption } from '@0xsequence/waas';
import { useState } from 'react';
import type { Address, Hex } from 'viem';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { useConfig, useConnectorMetadata } from '../../../../..';
import { getIndexerClient, type Step } from '../../../../../_internal';
import { useBuyModalData } from '../../hooks/useBuyModalData';

// https://github.com/0xsequence/web-sdk/blob/620b6fe7681ae49efd4eb3fa7607ef01dd7ede54/packages/connect/src/utils/transactions.ts#L11-L19
class FeeOptionInsufficientFundsError extends Error {
	public readonly feeOptions: FeeOption[];

	constructor(message: string, feeOptions: FeeOption[]) {
		super(message);
		this.name = 'FeeOptionInsufficientFundsError';
		this.feeOptions = feeOptions;
	}
}

type ExecutePurchaseWithWaasProps = {
	chainId: number;
	approvalStep?: Step;
	priceAmount: string;
};

const useExecutePurchaseWithWaas = ({
	chainId,
	approvalStep,
	priceAmount,
}: ExecutePurchaseWithWaasProps) => {
	const config = useConfig();
	const [isExecuting, setIsExecuting] = useState(false);
	const { isWaaS } = useConnectorMetadata();
	const { address, connector } = useAccount();
	const publicClient = usePublicClient();
	const { data: walletClient } = useWalletClient({ chainId });
	const indexerClient = getIndexerClient(chainId, config);

	const { collection, currency } = useBuyModalData();

	const executePurchaseWithWaas = async ({
		step,
		onBalanceInsufficientForFeeOption,
		onTransactionFailed,
	}: {
		step: Step;
		onBalanceInsufficientForFeeOption?: (error: Error) => void;
		onTransactionFailed?: (error: Error) => void;
	}) => {
		setIsExecuting(true);

		if (!isWaaS) {
			throw new Error(
				'executeWithWaas is only available for Sequence WaaS connector',
			);
		}

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

		if (!priceAmount) {
			throw new Error('Price amount not found');
		}

		const approvalData = approvalStep
			? {
					to: approvalStep.to as Address,
					data: approvalStep.data as Hex,
					chainId,
				}
			: undefined;

		const purchaseData = {
			to: step.to as Address,
			data: step.data as Hex,
			chainId,
			...(currency?.nativeCurrency
				? { value: BigInt(priceAmount) as bigint }
				: {}),
		};

		const transactions = [
			...(approvalData ? [approvalData] : []),
			purchaseData,
		];

		const txHash = await sendTransactions({
			chainId,
			senderAddress: address,
			publicClient,
			walletClient,
			indexerClient,
			connector,
			transactions,
			transactionConfirmations: 1,
			waitConfirmationForLastTransaction: false,
		}).catch((error) => {
			setIsExecuting(false);

			if (error instanceof FeeOptionInsufficientFundsError) {
				if (onBalanceInsufficientForFeeOption) {
					onBalanceInsufficientForFeeOption(error);
				}

				throw error;
			}

			if (onTransactionFailed) {
				onTransactionFailed(error);
			}

			throw error;
		});

		setIsExecuting(false);

		return txHash;
	};

	return {
		executePurchaseWithWaas,
		isExecuting,
	};
};

export { useExecutePurchaseWithWaas };
