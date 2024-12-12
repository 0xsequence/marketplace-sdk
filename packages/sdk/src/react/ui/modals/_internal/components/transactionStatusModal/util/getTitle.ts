import type { TransactionType } from '../../../../../../_internal/transaction-machine/execute-transaction';
import type { TransactionStatus } from '../store';
import { getFormattedType } from './getFormattedType';

export function getTransactionStatusModalTitle({
	transactionStatus,
	transactionType,
}: {
	transactionStatus: TransactionStatus;
	transactionType: TransactionType;
}): string {
	switch (transactionStatus) {
		case 'PENDING':
			return `Your ${getFormattedType(transactionType)} is processing`;
		case 'SUCCESS':
			return `Your ${getFormattedType(transactionType)} has processed`;
		case 'FAILED':
			return `Your ${getFormattedType(transactionType)} has failed`;
		case 'TIMEOUT':
			return `Your ${getFormattedType(transactionType)} takes too long`;
		default:
			return 'Your transaction is processing';
	}
}

export function getTransactionStatusModalSpinnerTitle({
	transactionStatus,
}: {
	transactionStatus: TransactionStatus;
}): string {
	switch (transactionStatus) {
		case 'PENDING':
			return 'Processing transaction';
		case 'SUCCESS':
			return 'Transaction completed';
		case 'FAILED':
			return 'Transaction failed';
		case 'TIMEOUT':
			return 'Taking too long';
		default:
			return 'Processing transaction';
	}
}
