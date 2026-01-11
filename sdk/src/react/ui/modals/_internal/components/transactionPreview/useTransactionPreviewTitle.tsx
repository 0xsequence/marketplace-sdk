import type { TransactionType } from '../../../../../_internal/types';
import type { ConfirmationStatus } from '../transactionStatusModal/store';
import { TRANSACTION_TITLES } from './consts';

export function useTransactionPreviewTitle(
	orderId: string | undefined,
	status: ConfirmationStatus,
	type?: TransactionType  ,
): string {
	if (!type) return '';

	const { isConfirming, isConfirmed, isFailed } = status;
	const titles = TRANSACTION_TITLES[type];

	if (isConfirmed || orderId) return titles.confirmed;
	if (isConfirming) return titles.confirming;
	if (isFailed) return titles.failed;

	return '';
}
