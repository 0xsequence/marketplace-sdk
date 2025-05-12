import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import {
	ContractType,
	ERC1155_SALES_CONTRACT_ABI,
	type TokenMetadata,
} from '../../../../sdk/src';
import type { ShopCardProps } from '../ui';
import { useTokenSaleDetailsBatch } from './use1155SaleDetailsBatch';
import { useListTokenMetadata } from './useListTokenMetadata';

interface UseList1155ShopCardDataProps {
	tokenIds: string[];
	chainId: number;
	contractAddress: Address;
	salesContractAddress: Address;
}

export function useList1155shopCardData({
	tokenIds,
	chainId,
	contractAddress,
	salesContractAddress,
}: UseList1155ShopCardDataProps) {
	const {
		data: tokenMetadata,
		isLoading: tokenMetadataLoading,
		error: tokenMetadataError,
	} = useListTokenMetadata({
		chainId,
		contractAddress,
		tokenIds,
	});

	const { extendedSupplyData, getSupply, supplyDataLoading, supplyDataError } =
		useTokenSaleDetailsBatch({
			tokenIds,
			salesContractAddress,
			chainId,
		});

	const { data: paymentToken } = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC1155_SALES_CONTRACT_ABI,
		functionName: 'paymentToken',
	});

	const collectibleCards = tokenIds.map((tokenId) => {
		const token = tokenMetadata?.find((token) => token.tokenId === tokenId);

		const saleData = extendedSupplyData?.find(
			(data) => data.tokenId === tokenId,
		);

		const cost =
			saleData && typeof saleData.result === 'object'
				? saleData.result.cost?.toString() || ''
				: '';

		return {
			collectibleId: tokenId,
			chainId,
			collectionAddress: contractAddress,
			collectionType: ContractType.ERC1155,
			tokenMetadata: token as TokenMetadata,
			cardLoading: supplyDataLoading || tokenMetadataLoading,
			supply: getSupply(tokenId) ?? 0,
			salesContractAddress,
			salePrice: {
				amount: cost,
				currencyAddress: paymentToken ?? '0x',
			},
		} satisfies ShopCardProps;
	});

	return {
		collectibleCards,
		tokenMetadataError,
		supplyDataError,
	};
}
