import {
	ExecuteType,
	getMarketplaceClient,
	MarketplaceKind,
	OrderData,
	Step,
	StepType,
	TransactionSteps,
} from '../../../../_internal';
import { ModalCallbacks } from '../../_internal/types';
import { TransactionType } from '../../../../_internal/transaction-machine/execute-transaction';
import { useTransactionStatusModal } from '../../_internal/components/transactionStatusModal';
import { Address } from 'viem';
import { Observable } from '@legendapp/state';
import { useWallet } from '../../../../_internal/transaction-machine/useWallet';
import { SignatureStep } from '../../../../_internal/transaction-machine/utils';
import { useGetReceiptFromHash } from '../../../../hooks/useGetReceiptFromHash';
import { useConfig, useGenerateSellTransaction } from '../../../../hooks';
import { useFees } from '../../BuyModal/hooks/useFees';

export type ExecutionState = 'approval' | 'sell' | null;

interface UseTransactionStepsArgs {
	collectibleId: string;
	chainId: string;
	collectionAddress: string;
	marketplace: MarketplaceKind;
	ordersData: Array<OrderData>;
	callbacks?: ModalCallbacks;
	closeMainModal: () => void;
	steps$: Observable<TransactionSteps>;
}

export const useTransactionSteps = ({
	collectibleId,
	chainId,
	collectionAddress,
	marketplace,
	ordersData,
	callbacks,
	closeMainModal,
	steps$,
}: UseTransactionStepsArgs) => {
	const { wallet } = useWallet();
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const sdkConfig = useConfig();
	const marketplaceClient = getMarketplaceClient(chainId, sdkConfig);
	const { waitForReceipt } = useGetReceiptFromHash();
	const { amount, receiver } = useFees({
		chainId: Number(chainId),
		collectionAddress: collectionAddress,
	});
	const { generateSellTransactionAsync, isPending: generatingSteps } =
		useGenerateSellTransaction({
			chainId,
			onSuccess: (steps) => {
				if (!steps) return;
			},
		});

		console.log('amount', amount);
		console.log('receiver', receiver);

	const getSellSteps = async () => {
		if (!wallet) return;

		try {
			const address = await wallet.address();

			const steps = await generateSellTransactionAsync({
				collectionAddress,
				walletType: wallet.walletKind,
				marketplace,
				ordersData,
				additionalFees: [{
					amount,
					receiver,
				}],
				seller: address,
			});

			return steps;
		} catch (error) {
			if (callbacks?.onError) {
				callbacks.onError(error as Error);
			} else {
				console.debug('onError callback not provided:', error);
			}
			throw error;
		}
	};

	const executeApproval = async () => {
		if (!wallet) return;

		try {
			steps$.approval.isExecuting.set(true);
			const approvalStep = await getSellSteps().then((steps) =>
				steps?.find((step) => step.id === StepType.tokenApproval),
			);

			const hash = await wallet.handleSendTransactionStep(
				Number(chainId),
				approvalStep as any,
			);

			const receipt = await waitForReceipt(hash);

			if (receipt) {
				steps$.approval.isExecuting.set(false);
				steps$.approval.exist.set(false);
			}
		} catch (error) {
			steps$.approval.isExecuting.set(false);
			throw error;
		}
	};

	const sell = async () => {
		if (!wallet) return;

		try {
			steps$.transaction.isExecuting.set(true);
			const transactionStep = await getSellSteps().then((steps) =>
				steps?.find((step) => step.id === StepType.sell),
			);
			const signatureStep = await getSellSteps().then((steps) =>
				steps?.find((step) => step.id === StepType.signEIP712),
			);

			console.debug('transactionStep', transactionStep);
			console.debug('signatureStep', signatureStep);

			if (!transactionStep && !signatureStep) {
				throw new Error('No transaction or signature step found');
			}

			let hash, orderId: string | undefined;

			if (transactionStep) {
				hash = await executeTransaction({ transactionStep });
			}

			if (signatureStep) {
				orderId = await executeSignature({ signatureStep });
			}

			closeMainModal();

			showTransactionStatusModal({
				type: TransactionType.SELL,
				collectionAddress: collectionAddress as Address,
				chainId,
				collectibleId,
				hash,
				orderId,
				callbacks,
			});

			steps$.transaction.isExecuting.set(false);
		} catch (error) {
			steps$.transaction.isExecuting.set(false);
			throw error;
		}
	};

	const executeTransaction = async ({
		transactionStep,
	}: { transactionStep: Step }) => {
		if (!wallet) return;

		const hash = await wallet.handleSendTransactionStep(
			Number(chainId),
			transactionStep as any,
		);

		return hash;
	};

	const executeSignature = async ({
		signatureStep,
	}: { signatureStep: Step }) => {
		if (!wallet) return;

		const signature = await wallet.handleSignMessageStep(
			signatureStep as SignatureStep,
		);

		const result = await marketplaceClient.execute({
			signature: signature as string,
			executeType: ExecuteType.order,
			body: signatureStep.post?.body,
		});

		return result.orderId;
	};

	return {
		generatingSteps,
		executeApproval,
		sell,
	};
};
