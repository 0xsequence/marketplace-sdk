import {
	useTransactionMachine,
	UseTransactionMachineConfig,
} from '../_internal/transaction-machine/useTransactionMachine';
import {
	CancelInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import { ModalCallbacks } from '../ui/modals/_internal/types';
import { StepType, Step } from '../_internal';

export default function useCancel({
	collectionAddress,
	chainId,
	collectibleId,
	onSuccess,
	onError,
}: {
	collectionAddress: string;
	chainId: string;
	collectibleId: string;
	onSuccess?: ModalCallbacks['onSuccess'];
	onError?: ModalCallbacks['onError'];
}) {
	const machineConfig = {
		chainId: chainId,
		collectionAddress: collectionAddress,
		collectibleId: collectibleId,
		fetchStepsOnInitialize: true,
	} as UseTransactionMachineConfig;
	const machine = useTransactionMachine({
		config: machineConfig,
		onSuccess,
		onError,
	});

	async function execute(cancelProps: CancelInput) {
		if (!machine || !machine?.transactionState?.transaction.ready) return;

		const steps = await machine!.fetchSteps({
			type: TransactionType.CANCEL,
			props: cancelProps,
		});

		const executionStep = steps.find(
			(step) => step.id === StepType.cancel,
		) as Step;

		await machine.execute(
			{
				type: TransactionType.CANCEL,
				props: cancelProps,
			},
			executionStep,
		);
	}

	return {
		execute,
		isLoading: machine?.transactionState?.transaction.executing,
		executed: machine?.transactionState?.transaction.executed,
	};
}
