import { TransactionType } from '../../../../../../_internal/transaction-machine/execute-transaction';
import { TransactionStatus } from '../store';
import { getFormattedType } from './getFormattedType';

export function getTransactionStatusModalMessage({
	transactionStatus,
	transactionType,
	collectibleName,
}: {
	transactionStatus: TransactionStatus;
	transactionType: TransactionType;
	collectibleName: string;
}): string {
	switch (transactionStatus) {
		case 'PENDING':
			return `You just ${getFormattedType(transactionType, true)} ${collectibleName}. It should be confirmed on the blockchain shortly.`;
		case 'SUCCESS':
			return `You just ${getFormattedType(transactionType, true)} ${collectibleName}. It’s been confirmed on the blockchain!`;
		case 'FAILED':
			return `Your ${getFormattedType(transactionType)} has failed.`;
		case 'TIMEOUT':
			return `Your ${getFormattedType(transactionType)} takes too long. Click the link below to track it on the explorer.`;
		default:
			return 'Your transaction is processing';
	}
}
