import { sendTransactions } from '@0xsequence/connect';
import { useIndexerClient } from '@0xsequence/hooks';
import { type Address, type Hex } from 'viem';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { useConnectorMetadata } from '../../../../..';
import { Step } from '../../../../../_internal';
import { useBuyModalData } from '../../hooks/useBuyModalData';

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
	const { isWaaS } = useConnectorMetadata();
	const { address, connector } = useAccount();
	const publicClient = usePublicClient();
	const { data: walletClient } = useWalletClient({ chainId });
	const indexerClient = useIndexerClient(chainId);

	const { collection, currency } = useBuyModalData();

	const executePurchaseWithWaas = async (step: Step) => {
		if (!isWaaS) {
			throw new Error('executeWithWaas is only available for WaaS');
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
		});

		return txHash;
	};

	return {
		executePurchaseWithWaas,
	};
};

export { useExecutePurchaseWithWaas };
