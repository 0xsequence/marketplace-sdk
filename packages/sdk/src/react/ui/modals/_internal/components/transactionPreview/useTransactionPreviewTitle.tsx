import type { ConfirmationStatus } from '../transactionStatusModal/store';
import { TRANSACTION_TITLES } from './consts';
import { TransactionType } from '../../../../../_internal/transaction-machine/execute-transaction';

export function useTransactionPreviewTitle(
	orderId: string | undefined,
	status: ConfirmationStatus,
	type?: TransactionType | undefined,
): string {
	if (!type) return '';

	const { isConfirming, isConfirmed, isFailed } = status;
	const titles = TRANSACTION_TITLES[type];

	if (isConfirmed || orderId) return titles.confirmed;
	if (isConfirming) return titles.confirming;
	if (isFailed) return titles.failed;

	return '';
}
