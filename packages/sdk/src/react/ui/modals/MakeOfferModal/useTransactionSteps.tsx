import { useState, useCallback, useEffect } from 'react';
import { StepType } from '../../../_internal';
import { useGenerateOfferTransaction } from '../../../hooks/useGenerateOfferTransaction';
import { OrderbookKind } from '../../../../types';
import { ModalCallbacks } from '../_internal/types';
import { OfferInput } from '../../../_internal/transaction-machine/execute-transaction';

export interface TransactionStep {
	isPending: boolean;
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
	wallet: any;
	callbacks?: ModalCallbacks;
}

export const useTransactionSteps = ({
	offerInput,
	chainId,
	collectionAddress,
	orderbookKind = OrderbookKind.sequence_marketplace_v2,
	wallet,
	callbacks,
}: UseTransactionStepsArgs) => {
	const [steps, setSteps] = useState<TransactionSteps | null>(null);
	const [executionState, setExecutionState] = useState<ExecutionState>(null);

	const { generateOfferTransactionAsync, isPending: generatingSteps } =
		useGenerateOfferTransaction({
			chainId,
			onSuccess: (steps) => {
				if (!steps) return;
				// Handle success if needed
			},
		});

	const handleStepExecution = useCallback(
		async (type: ExecutionState, execute: () => Promise<any> | undefined) => {
			if (!type) return;
			setExecutionState(type);
			try {
				await execute();
			} catch (error) {
				setExecutionState(null);
				throw error;
			}
		},
		[],
	);

	type LoadStepsFunction = (props: OfferInput) => Promise<void>;
	const loadSteps: LoadStepsFunction = useCallback(
		async (props) => {
			if (!wallet) return;

			try {
				const generatedSteps = await generateOfferTransactionAsync({
					collectionAddress,
					maker: await wallet.address(),
					walletType: wallet.walletKind,
					contractType: props.contractType,
					orderbook: orderbookKind,
					offer: {
						...props.offer,
						expiry: props.offer.expiry as unknown as Date,
					},
				});

				if (!generatedSteps) {
					return;
				}

				const approvalStep = generatedSteps.find(
					(step) => step.id === StepType.tokenApproval,
				);
				const transactionStep = generatedSteps.find(
					(step) => step.id === StepType.createOffer,
				);

				setSteps({
					approval: {
						isPending: !!approvalStep,
						isExecuting: executionState === 'approval',
						execute: async () => {
							if (!approvalStep) return;
							try {
								const hash = await wallet.handleSendTransactionStep(
									Number(chainId),
									approvalStep as any,
								);
							} catch (error) {
								throw error;
							}
						},
					},
					transaction: {
						isPending: !!transactionStep,
						isExecuting: executionState === 'offer',
						execute: async () => {
							if (!transactionStep) return;
							try {
								const hash = await wallet.handleSendTransactionStep(
									Number(chainId),
									transactionStep as any,
								);
							} catch (error) {
								throw error;
							}
						},
					},
				});
			} catch (error) {}
		},
		[
			chainId,
			collectionAddress,
			executionState,
			generateOfferTransactionAsync,
			orderbookKind,
			wallet,
		],
	);

	useEffect(() => {
		loadSteps(offerInput);
	}, [offerInput]);

	return {
		steps,
		executionState,
		handleStepExecution,
		generatingSteps,
	};
};
