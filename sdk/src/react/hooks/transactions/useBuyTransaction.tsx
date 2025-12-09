import { zeroAddress } from 'viem';
import { useAccount } from 'wagmi';
import { TransactionType } from '../../../types/transactions';
import { ContractType, MarketplaceKind } from '../../_internal';
import { useMarketPlatformFee } from '../../ui/modals/BuyModal/hooks/useMarketPlatformFee';
import type { BuyModalProps } from '../../ui/modals/BuyModal/store';
import { isMarketProps, isShopProps } from '../../ui/modals/BuyModal/store';
import { useMarketTransactionSteps } from './useMarketTransactionSteps';
import { usePrimarySaleTransactionSteps } from './usePrimarySaleTransactionSteps';
import { useTransactionType } from './useTransactionType';

/**
 * Unified hook that handles both market and primary sale transactions
 * Automatically selects the appropriate transaction type based on modal props
 */
export function useBuyTransaction(modalProps: BuyModalProps) {
	const { address: buyer } = useAccount();
	const transactionType = useTransactionType(modalProps);
	const marketPlatformFee = useMarketPlatformFee({
		chainId: modalProps.chainId,
		collectionAddress: modalProps.collectionAddress,
	});

	// Market transaction query
	const marketQuery = useMarketTransactionSteps({
		chainId: modalProps.chainId,
		collectionAddress: modalProps.collectionAddress,
		buyer: buyer!,
		marketplace: isMarketProps(modalProps)
			? modalProps.marketplace
			: MarketplaceKind.sequence_marketplace_v2,
		orderId: isMarketProps(modalProps) ? modalProps.orderId : '',
		tokenId: isMarketProps(modalProps) ? modalProps.tokenId : 0n,
		quantity: 1n, // Single item purchase for now
		additionalFees: [marketPlatformFee],
		enabled: transactionType === TransactionType.MARKET_BUY && !!buyer,
	});

	// Primary sale transaction query
	const primaryQuery = usePrimarySaleTransactionSteps({
		chainId: modalProps.chainId,
		buyer: buyer!,
		salesContractAddress: isShopProps(modalProps)
			? modalProps.salesContractAddress
			: zeroAddress,
		tokenIds: isShopProps(modalProps) ? [modalProps.item.tokenId] : [],
		amounts: isShopProps(modalProps)
			? [Number(modalProps.item.quantity) || 1]
			: [],
		maxTotal: isShopProps(modalProps) ? modalProps.salePrice.amount : 0n,
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
