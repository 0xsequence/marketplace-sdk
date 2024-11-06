import { useMemo } from 'react';
import {
	ConfirmationStatus,
	StatusOrderType,
} from '../transactionStatusModal/store';
import { TRANSACTION_TITLES } from './consts';

export function useTransactionPreviewTitle(
	status: ConfirmationStatus,
	type?: StatusOrderType | undefined,
): string {
	return useMemo(() => {
		if (!type) return '';

		const { isConfirming, isConfirmed, isFailed } = status;
		const titles = TRANSACTION_TITLES[type];

		if (isConfirming) return titles.confirming;
		if (isConfirmed) return titles.confirmed;
		if (isFailed) return titles.failed;

		return '';
	}, [status, type]);
}
