import { useAccount } from 'wagmi';
import { zeroAddress } from 'viem';
import type { BuyModalProps } from '../../ui/modals/BuyModal/store';
import { isShopProps, isMarketProps } from '../../ui/modals/BuyModal/store';
import { useTransactionType } from './useTransactionType';
import { useMarketTransactionSteps } from './useMarketTransactionSteps';
import { usePrimarySaleTransactionSteps } from './usePrimarySaleTransactionSteps';
import { TransactionType } from '../../../types/transactions';
import { MarketplaceKind } from '../../_internal/api';
import { ContractType } from '../../_internal';

/**
 * Unified hook that handles both market and primary sale transactions
 * Automatically selects the appropriate transaction type based on modal props
 */
export function useBuyTransaction(modalProps: BuyModalProps) {
	const { address: buyer } = useAccount();
	const transactionType = useTransactionType(modalProps);

	// Market transaction query
	const marketQuery = useMarketTransactionSteps({
		chainId: modalProps.chainId,
		collectionAddress: modalProps.collectionAddress,
		buyer: buyer!,
		marketplace: isMarketProps(modalProps)
			? modalProps.marketplace
			: MarketplaceKind.sequence_marketplace_v2,
		orderId: isMarketProps(modalProps) ? modalProps.orderId : '',
		collectibleId: isMarketProps(modalProps) ? modalProps.collectibleId : '',
		quantity: '1', // Single item purchase for now
		enabled: transactionType === TransactionType.MARKET_BUY && !!buyer,
	});

	// Primary sale transaction query
	const primaryQuery = usePrimarySaleTransactionSteps({
		chainId: modalProps.chainId,
		buyer: buyer!,
		salesContractAddress: isShopProps(modalProps)
			? modalProps.salesContractAddress
			: zeroAddress,
		tokenIds: isShopProps(modalProps)
			? modalProps.items.map((item) => item.tokenId || '0')
			: [],
		amounts: isShopProps(modalProps)
			? modalProps.items.map((item) => Number(item.quantity) || 1)
			: [],
		maxTotal: isShopProps(modalProps) ? modalProps.salePrice.amount : '0',
		paymentToken: isShopProps(modalProps)
			? modalProps.salePrice.currencyAddress
			: zeroAddress,
		contractType: ContractType.ERC1155, // TODO: Determine from contract
		enabled: transactionType === TransactionType.PRIMARY_SALE && !!buyer,
	});

	// Return the active query based on transaction type
	if (transactionType === TransactionType.MARKET_BUY) {
		return {
			data: marketQuery.data,
			isLoading: marketQuery.isLoading,
			error: marketQuery.error,
			isError: marketQuery.isError,
			refetch: marketQuery.refetch,
		};
	}

	return {
		data: primaryQuery.data,
		isLoading: primaryQuery.isLoading,
		error: primaryQuery.error,
		isError: primaryQuery.isError,
		refetch: primaryQuery.refetch,
	};
}
