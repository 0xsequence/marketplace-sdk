import type { TransactionType } from '../../../../../../_internal/transaction-machine/execute-transaction';
import type { TransactionStatus } from '../store';
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
	// without this, the text will be "Your cancellation CollectibleXXX has failed." which sounds weird
	const hideCollectibleName = transactionType === 'CANCEL';

	switch (transactionStatus) {
		case 'PENDING':
			return `You just ${getFormattedType(transactionType, true)}${!hideCollectibleName ? ` ${collectibleName}` : ''}. It should be confirmed on the blockchain shortly.`;
		case 'SUCCESS':
			return `You just ${getFormattedType(transactionType, true)}${!hideCollectibleName ? ` ${collectibleName}` : ''}. It’s been confirmed on the blockchain!`;
		case 'FAILED':
			return `Your ${getFormattedType(transactionType)} has failed.`;
		case 'TIMEOUT':
			return `Your ${getFormattedType(transactionType)} takes too long. Click the link below to track it on the explorer.`;
		default:
			return 'Your transaction is processing';
	}
}
