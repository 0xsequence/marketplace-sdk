import type { Address } from 'viem';
import { compareAddress } from '../../utils';
import type { CollectiblePrimarySaleItem } from '../_internal/api/marketplace.gen';
import { useGetTokenSuppliesMap } from './useGetTokenSuppliesMap';
import { useListPrimarySaleItems } from './useListPrimarySaleItems';

interface UseERC721SaleMintedTokensProps {
	chainId: number;
	contractAddress: Address;
	salesContractAddress: Address;
	enabled?: boolean;
	tokenIds: string[];
}

export function useERC721SaleMintedTokens({
	chainId,
	contractAddress,
	salesContractAddress,
	tokenIds,
	enabled = true,
}: UseERC721SaleMintedTokensProps) {
	const { data: primarySaleItemsResponse, isLoading: primarySaleItemsLoading } =
		useListPrimarySaleItems({
			chainId,
			primarySaleContractAddress: salesContractAddress,
		});

	// Get token supplies for all potential tokens in the sale
	const { data: tokenSupplies, isLoading: tokenSuppliesLoading } =
		useGetTokenSuppliesMap({
			chainId,
			tokenIds,
			collectionAddress: contractAddress,
			query: {
				enabled,
			},
		});

	const isLoading = primarySaleItemsLoading || tokenSuppliesLoading;

	// Count how many tokens have been minted/owned
	const ownedCount = tokenIds.reduce((count, tokenId) => {
		const supplies = tokenSupplies?.supplies[contractAddress];
		const supply = supplies?.find((s) => s.tokenID === tokenId);
		// If supply exists and is greater than 0, token exists and is owned
		const hasOwner = supply ? BigInt(supply.supply) > 0n : false;
		return count + (hasOwner ? 1 : 0);
	}, 0);

	// Find the relevant sale item for this collection
	const saleItem = primarySaleItemsResponse?.primarySaleItems.find(
		(item: CollectiblePrimarySaleItem) =>
			compareAddress(item.primarySaleItem.itemAddress, contractAddress),
	);

	const totalSupplyCap = saleItem?.primarySaleItem.supplyCap
		? Number(saleItem.primarySaleItem.supplyCap)
		: 0;
	const remainingCount = Math.max(0, totalSupplyCap - ownedCount);

	return {
		ownedCount,
		totalSupplyCap,
		remainingCount,
		isLoading,
		error: null,
	};
}
