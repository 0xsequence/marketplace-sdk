import type { MarketplaceKind } from '../../types';
import {
	type BuyInput,
	TransactionType,
} from '../_internal/transaction-machine/execute-transaction';
import {
	type UseTransactionMachineConfig,
	useTransactionMachine,
} from '../_internal/transaction-machine/useTransactionMachine';
import type { ModalCallbacks } from '../ui/modals/_internal/types';

export default function useBuy({
	closeModalFn,
	collectibleId,
	collectionAddress,
	chainId,
	orderId,
	collectableDecimals,
	marketplace,
	quantity,
	callbacks,
}: {
	closeModalFn: () => void;
	collectibleId: string;
	collectionAddress: string;
	chainId: string;
	orderId: string;
	collectableDecimals: number;
	marketplace: MarketplaceKind;
	quantity: string;
	callbacks: ModalCallbacks;
}) {
	const buyProps = {
		orderId,
		collectableDecimals,
		marketplace,
		quantity,
	} as BuyInput;
	const machineConfig = {
		transactionInput: {
			type: TransactionType.BUY,
			props: buyProps,
		},
		collectionAddress,
		chainId,
		collectibleId,
		type: TransactionType.BUY,
		fetchStepsOnInitialize: true,
	} as UseTransactionMachineConfig;
	const machine = useTransactionMachine({
		config: machineConfig,
		closeActionModalCallback: closeModalFn,
		onSuccess: callbacks.onSuccess,
		onError: callbacks.onError,
	});

	async function execute() {
		if (!machine) return;

		await machine.execute({
			type: TransactionType.BUY,
			props: buyProps,
		});
	}

	return {
		transactionState: machine?.transactionState,
		execute,
	};
}
