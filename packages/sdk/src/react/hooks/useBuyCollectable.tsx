import type { Hash, Hex } from 'viem';
import type { TransactionErrorTypes } from '../../utils/_internal/error/transaction';
import { TransactionType } from '../_internal/transaction-machine/types';
import type { BuyInput } from '../_internal/transaction-machine/types';
import {
	type UseTransactionMachineConfig,
	useTransactionMachine,
} from '../_internal/transaction-machine/useTransactionMachine';
import { useCallback } from 'react';

type UseBuyOrderError = TransactionErrorTypes;

interface UseBuyOrderArgs
	extends Omit<UseTransactionMachineConfig, 'type' | 'orderbookKind'> {
	onSuccess?: (hash: Hash) => void;
	onError?: (error: UseBuyOrderError) => void;
	onTransactionSent?: (hash?: Hex) => void;
	setPaymentLoadingModalOpen: (value: boolean) => void;
	onPaymentModalLoaded: () => void;
	enabled: boolean;
}

export const useBuyCollectable = ({
	onSuccess,
	onError,
	onTransactionSent,
	setPaymentLoadingModalOpen,
	onPaymentModalLoaded,
	enabled,
	...config
}: UseBuyOrderArgs) => {
	const machineConfig = {
		...config,
		type: TransactionType.BUY,
	};
	const { machine, error, isLoading } = useTransactionMachine({
		config: machineConfig,
		enabled,
		onSuccess,
		onError,
		onTransactionSent,
		onPaymentModalLoaded,
	});

	const buy = useCallback(
		(props: BuyInput) => {
			if (!machine || isLoading) return;
			setPaymentLoadingModalOpen(true);
			machine.start(props);
		},
		[setPaymentLoadingModalOpen, machine],
	);

	return {
		buy,
		isLoading,
		error,
	};
};
