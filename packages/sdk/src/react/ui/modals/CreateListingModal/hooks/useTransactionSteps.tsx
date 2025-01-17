import type { Observable } from '@legendapp/state';
import type { Address } from 'viem';
import type { OrderbookKind } from '../../../../../types';
import {
	ExecuteType,
	type Step,
	StepType,
	type TransactionSteps,
	getMarketplaceClient,
} from '../../../../_internal';
import {
	type ListingInput,
	TransactionType,
} from '../../../../_internal/transaction-machine/execute-transaction';
import { useWallet } from '../../../../_internal/transaction-machine/useWallet';
import type { SignatureStep } from '../../../../_internal/transaction-machine/utils';
import { useConfig, useGenerateListingTransaction } from '../../../../hooks';
import { useGetReceiptFromHash } from '../../../../hooks/useGetReceiptFromHash';
import { useTransactionStatusModal } from '../../_internal/components/transactionStatusModal';
import type { ModalCallbacks } from '../../_internal/types';

interface UseTransactionStepsArgs {
	listingInput: ListingInput;
	chainId: string;
	collectionAddress: string;
	orderbookKind: OrderbookKind;
	callbacks?: ModalCallbacks;
	closeMainModal: () => void;
	steps$: Observable<TransactionSteps>;
}

export const useTransactionSteps = ({
	listingInput,
	chainId,
	collectionAddress,
	orderbookKind,
	callbacks,
	closeMainModal,
	steps$,
}: UseTransactionStepsArgs) => {
	const { wallet } = useWallet();
	const expiry = new Date(Number(listingInput.listing.expiry) * 1000);
	const { show: showTransactionStatusModal } = useTransactionStatusModal();
	const sdkConfig = useConfig();
	const marketplaceClient = getMarketplaceClient(chainId, sdkConfig);
	const { waitForReceipt } = useGetReceiptFromHash();
	const { generateListingTransactionAsync, isPending: generatingSteps } =
		useGenerateListingTransaction({
			chainId,
			onSuccess: (steps) => {
				if (!steps) return;
			},
		});

	const getListingSteps = async () => {
		if (!wallet) return;

		try {
			const address = await wallet.address();

			const steps = await generateListingTransactionAsync({
				collectionAddress,
				owner: address,
				walletType: wallet.walletKind,
				contractType: listingInput.contractType,
				orderbook: orderbookKind,
				listing: {
					...listingInput.listing,
					expiry,
				},
			});

			return steps;
		} catch (error) {
			if (callbacks?.onError) {
				callbacks.onError(error as Error);
			} else {
				console.debug('onError callback not provided:', error);
			}
		}
	};

	const executeApproval = async () => {
		if (!wallet) return;

		try {
			steps$.approval.isExecuting.set(true);
			const approvalStep = await getListingSteps().then((steps) =>
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
		}
	};

	const createListing = async () => {
		if (!wallet) return;

		try {
			steps$.transaction.isExecuting.set(true);
			const steps = await getListingSteps();
			const transactionStep = steps?.find(
				(step) => step.id === StepType.createListing,
			);
			const signatureStep = steps?.find(
				(step) => step.id === StepType.signEIP712,
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
				type: TransactionType.LISTING,
				collectionAddress: collectionAddress as Address,
				chainId,
				collectibleId: listingInput.listing.tokenId,
				hash,
				orderId,
				callbacks,
			});

			if (hash) {
				await waitForReceipt(hash);

				steps$.transaction.isExecuting.set(false);
				steps$.transaction.exist.set(false);
				if (callbacks?.onSuccess && typeof callbacks.onSuccess === 'function') {
					callbacks.onSuccess({ hash });
				}
			}

			if (orderId) {
				steps$.transaction.isExecuting.set(false);
				steps$.transaction.exist.set(false);

				if (callbacks?.onSuccess && typeof callbacks.onSuccess === 'function') {
					callbacks.onSuccess({ orderId });
				}
			}
		} catch (error) {
			steps$.transaction.isExecuting.set(false);
			steps$.transaction.exist.set(false);
			if (callbacks?.onError && typeof callbacks.onError === 'function') {
				callbacks.onError(error as Error);
			}
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
		createListing,
	};
};
