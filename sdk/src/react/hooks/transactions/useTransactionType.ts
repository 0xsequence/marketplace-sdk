import { useMemo } from 'react';
import type { BuyModalProps } from '../../ui/modals/BuyModal/store';
import { TransactionType } from '../../../types/transactions';

/**
 * Hook to detect transaction type from modal props
 * Returns TransactionType.PRIMARY_SALE for shop transactions,
 * otherwise returns TransactionType.MARKET_BUY
 */
export function useTransactionType(modalProps: BuyModalProps) {
	return useMemo(() => {
		// Shop transactions are primary sales
		if (modalProps.marketplaceType === 'shop') {
			return TransactionType.PRIMARY_SALE;
		}

		// Everything else is a market transaction
		return TransactionType.MARKET_BUY;
	}, [modalProps.marketplaceType]);
}
