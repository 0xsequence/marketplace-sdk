import { useMemo } from 'react';
import { TransactionType } from '../../../types/transactions';
import type { BuyModalProps } from '../../ui/modals/BuyModal/store';

/**
 * Hook to detect transaction type from modal props
 * Returns TransactionType.PRIMARY_SALE for shop transactions,
 * otherwise returns TransactionType.MARKET_BUY
 */
export function useTransactionType(modalProps: BuyModalProps) {
	return useMemo(() => {
		// Shop transactions are primary sales
		if (modalProps.cardType === 'shop') {
			return TransactionType.PRIMARY_SALE;
		}

		// Everything else is a market transaction
		return TransactionType.MARKET_BUY;
	}, [modalProps.cardType]);
}
