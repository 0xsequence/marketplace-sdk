import { useState, useCallback, useEffect } from 'react';
import { StepType } from '../../../_internal';
import { useGenerateOfferTransaction } from '../../../hooks/useGenerateOfferTransaction';
import { OrderbookKind } from '../../../../types';
import { ModalCallbacks } from '../_internal/types';
import {
	OfferInput,
	TransactionType,
} from '../../../_internal/transaction-machine/execute-transaction';
import { WalletInstance } from '../../../_internal/transaction-machine/wallet';
import { useTransactionStatusModal } from '../_internal/components/transactionStatusModal';
import { Address } from 'viem';

export interface TransactionStep {
	isExist: boolean;
	isExecuting: boolean;
	execute: () => Promise<void>;
}

export interface TransactionSteps {
	approval: TransactionStep;
	transaction: TransactionStep;
}

export type ExecutionState = 'approval' | 'offer' | null;

interface UseTransactionStepsArgs {
	offerInput: OfferInput;
	chainId: string;
	collectionAddress: string;
	orderbookKind?: OrderbookKind;
	wallet: WalletInstance | null;
	callbacks?: ModalCallbacks;
	closeMainModal: () => void;
}

export const 	useTransactionSteps = ({
	offerInput,
	chainId,
	collectionAddress,
	orderbookKind = OrderbookKind.sequence_marketplace_v2,
	wallet,
	callbacks,
	closeMainModal,
}: UseTransactionStepsArgs) => {
	const [steps, setSteps] = useState<TransactionSteps | null>(null);
	const [executionState, setExecutionState] = useState<ExecutionState>(null);
	const expiry = new Date(Number(offerInput.offer.expiry) * 1000);
	const { show: showTransactionStatusModal } = useTransactionStatusModal();

	const { generateOfferTransactionAsync, isPending: generatingSteps } =
		useGenerateOfferTransaction({
			chainId,
			onSuccess: (steps) => {
				if (!steps) return;
				// Handle success if needed
			},
		});

	const getOfferSteps = async () => {
		if (!wallet) return;

		try {
			const address = await wallet.address();

			const steps = await generateOfferTransactionAsync({
				collectionAddress,
				maker: address,
				walletType: wallet.walletKind,
				contractType: offerInput.contractType,
				orderbook: orderbookKind,
				offer: {
					...offerInput.offer,
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
			throw error;
		}
	};

	const executeApproval = async () => {
		if (!wallet) return;

		try {
			setExecutionState('approval');
			const approvalStep = await getOfferSteps().then((steps) =>
				steps?.find((step) => step.id === StepType.tokenApproval),
			);

			await wallet.handleSendTransactionStep(
				Number(chainId),
				approvalStep as any,
			);

			setExecutionState(null);
		} catch (error) {
			setExecutionState(null);
			throw error;
		}
	};

	const executeTransaction = async () => {
		if (!wallet) return;
		try {
			setExecutionState('offer');
			const transactionStep = await getOfferSteps().then((steps) =>
				steps?.find((step) => step.id === StepType.createOffer),
			);

			const hash = await wallet.handleSendTransactionStep(
				Number(chainId),
				transactionStep as any,
			);

			closeMainModal();

			showTransactionStatusModal({
				type: TransactionType.OFFER,
				collectionAddress: collectionAddress as Address,
				chainId,
				collectibleId: offerInput.offer.tokenId,
				hash,
				callbacks
			});

			setExecutionState(null);
		} catch (error) {
			setExecutionState(null);
			throw error;
		}
	};

	type LoadStepsFunction = (props: OfferInput) => Promise<void>;
	const loadSteps: LoadStepsFunction = useCallback(
		async () => {
			if (!wallet) return;

			try {
				const steps = await getOfferSteps();

				if (!steps) {
					return;
				}

				const approvalStep = steps.find(
					(step) => step.id === StepType.tokenApproval,
				);
				const transactionStep = steps.find(
					(step) => step.id === StepType.createOffer,
				);

				setSteps({
					approval: {
						isExist: !!approvalStep,
						isExecuting: executionState === 'approval',
						execute: () => executeApproval(),
					},
					transaction: {
						isExist: !!transactionStep,
						isExecuting: executionState === 'offer',
						execute: () => executeTransaction(),
					},
				});
			} catch (error) {
				console.error('Error loading steps', error);
			}
		},
		[
			wallet,
			chainId,
			collectionAddress,
			orderbookKind,
			generateOfferTransactionAsync,
		],
	);

	useEffect(() => {
		(async () => {
			await loadSteps(offerInput);
		})();
	}, []);

	return {
		steps,
		executionState,
		generatingSteps,
	};
};
