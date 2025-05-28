import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { ERC721_SALE_ABI } from '../../../../sdk/src';
import { useGetTokenSuppliesMap } from './useGetTokenSuppliesMap';

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
	const {
		data: saleDetails,
		isLoading: saleDetailsLoading,
		error: saleDetailsError,
	} = useReadContract({
		chainId,
		address: salesContractAddress,
		abi: ERC721_SALE_ABI,
		functionName: 'saleDetails',
		query: {
			enabled,
		},
	});

	// Get token supplies for all potential tokens in the sale
	const { data: tokenSupplies, isLoading: tokenSuppliesLoading } =
		useGetTokenSuppliesMap({
			chainId,
			tokenIds,
			collectionAddress: contractAddress,
		});

	const isLoading = saleDetailsLoading || tokenSuppliesLoading;

	// Count how many tokens have been minted/owned
	const ownedCount = tokenIds.reduce((count, tokenId) => {
		const supplies = tokenSupplies?.supplies[contractAddress];
		const supply = supplies?.find((s) => s.tokenID === tokenId);
		// If supply exists and is greater than 0, token exists and is owned
		const hasOwner = supply ? BigInt(supply.supply) > 0n : false;
		return count + (hasOwner ? 1 : 0);
	}, 0);

	const totalSupplyCap = saleDetails?.supplyCap
		? Number(saleDetails.supplyCap)
		: 0;
	const remainingCount = Math.max(0, totalSupplyCap - ownedCount);

	return {
		ownedCount,
		totalSupplyCap,
		remainingCount,
		isLoading,
		error: saleDetailsError,
		saleDetails,
	};
}
