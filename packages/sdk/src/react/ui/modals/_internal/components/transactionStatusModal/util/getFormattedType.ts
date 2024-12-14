import { TransactionType } from '../../../../../../_internal/transaction-machine/execute-transaction';

export function getFormattedType(
	transactionType: TransactionType,
	verb = false,
): string {
	switch (transactionType) {
		case TransactionType.TRANSFER:
			return verb ? 'transferred' : 'transfer';
		case TransactionType.LISTING:
			return verb ? 'listed' : 'listing';
		case TransactionType.BUY:
			return verb ? 'purchased' : 'purchase';
		case TransactionType.SELL:
			return verb ? 'sold' : 'sale';
		case TransactionType.CANCEL:
			return verb ? 'cancelled' : 'cancellation';
		case TransactionType.OFFER:
			return verb ? 'offered' : 'offer';
		default:
			return 'transaction';
	}
}
