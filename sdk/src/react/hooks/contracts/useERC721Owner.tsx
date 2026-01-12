import { ContractType } from '@0xsequence/api-client';
import type { Address } from '@0xsequence/api-client';
import { useReadContract } from 'wagmi';
import { ERC721_ABI } from '../../../utils/abi';

interface UseERC721OwnerParams {
	chainId: number;
	collectionAddress?: Address;
	tokenId?: bigint;
	contractType: ContractType;
	enabled?: boolean;
}

export function useERC721Owner({
	chainId,
	collectionAddress,
	tokenId,
	contractType,
	enabled = true,
}: UseERC721OwnerParams) {
	const queryEnabled =
		enabled &&
		contractType === ContractType.ERC721 &&
		!!collectionAddress &&
		tokenId !== undefined;

	const {
		data: owner,
		isLoading,
		error,
	} = useReadContract({
		address: collectionAddress,
		chainId,
		abi: ERC721_ABI,
		functionName: 'ownerOf',
		args: tokenId !== undefined ? [tokenId] : undefined,
		query: {
			enabled: queryEnabled,
		},
	});

	return {
		owner: owner,
		isLoading,
		error,
	};
}
