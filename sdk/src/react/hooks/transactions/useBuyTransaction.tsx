import { ContractType, MarketplaceKind } from '@0xsequence/api-client';
import type { Address } from 'viem';
import { zeroAddress } from 'viem';
import { useAccount } from 'wagmi';
import { TransactionType } from '../../../types/transactions';
import { useMarketPlatformFee } from '../../ui/modals/BuyModal/hooks/useMarketPlatformFee';
import type { BuyModalProps } from '../../ui/modals/BuyModal/store';
import {
	isMarketProps,
	isShopProps,
	useQuantity,
} from '../../ui/modals/BuyModal/store';
import { useMarketTransactionSteps } from './useMarketTransactionSteps';
import { usePrimarySaleTransactionSteps } from './usePrimarySaleTransactionSteps';
import { useTransactionType } from './useTransactionType';

export interface UseBuyTransactionOptions {
	modalProps: BuyModalProps;
	primarySalePrice?: {
		amount: bigint | undefined;
		currencyAddress: Address | undefined;
	};
	contractType: ContractType.ERC721 | ContractType.ERC1155;
}

/**
 * Unified hook that handles both market and primary sale transactions
 * Automatically selects the appropriate transaction type based on modal props
 */
export function useBuyTransaction(options: UseBuyTransactionOptions) {
	const { modalProps, primarySalePrice, contractType } = options;
	const { collectionAddress, chainId } = modalProps;
	const { address: buyer } = useAccount();
	const quantity = useQuantity();
	const transactionType = useTransactionType(modalProps);
	const marketPlatformFee = useMarketPlatformFee({
		chainId,
		collectionAddress,
	});
	const normalizedQuantity = quantity && quantity > 0 ? quantity : 1;

	// Market transaction query
	const marketQuery = useMarketTransactionSteps({
		chainId,
		collectionAddress,
		buyer: buyer!,
		marketplace: isMarketProps(modalProps)
			? modalProps.marketplace
			: MarketplaceKind.sequence_marketplace_v2,
		orderId: isMarketProps(modalProps) ? modalProps.orderId : '',
		tokenId: isMarketProps(modalProps) ? modalProps.tokenId : 0n,
		quantity: 1n, // Single item purchase for now
		additionalFees: [marketPlatformFee],
		enabled: transactionType === TransactionType.MARKET_BUY,
	});

	// Primary sale transaction query
	const primaryQuery = usePrimarySaleTransactionSteps({
		chainId: modalProps.chainId,
		buyer: buyer!,
		salesContractAddress: isShopProps(modalProps)
			? modalProps.salesContractAddress
			: zeroAddress,
		tokenIds: isShopProps(modalProps) ? [modalProps.item.tokenId] : [],
		amounts: isShopProps(modalProps) ? [normalizedQuantity] : [],
		maxTotal: primarySalePrice?.amount!,
		paymentToken: primarySalePrice?.currencyAddress!,
		contractType,
		enabled: transactionType === TransactionType.PRIMARY_SALE,
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
