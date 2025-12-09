import type { Address } from 'viem';
import { useAccount, useReadContract } from 'wagmi';
import { ERC721_ABI, ERC1155_ABI } from '../../../../../../utils/abi';
import { ContractType } from '../../../../../_internal';

export interface UseCollectibleApprovalArgs {
	collectionAddress: Address | undefined;
	spenderAddress: Address | undefined;
	chainId: number;
	contractType: ContractType | undefined;
	enabled?: boolean;
}

export function useCollectibleApproval({
	collectionAddress,
	spenderAddress,
	chainId,
	contractType,
	enabled = true,
}: UseCollectibleApprovalArgs) {
	const { address: ownerAddress } = useAccount();

	const isEnabled =
		enabled &&
		!!collectionAddress &&
		!!ownerAddress &&
		!!spenderAddress &&
		!!contractType &&
		chainId > 0;

	const abi = contractType === ContractType.ERC721 ? ERC721_ABI : ERC1155_ABI;

	const { data: isApproved, ...rest } = useReadContract({
		address: collectionAddress,
		abi,
		functionName: 'isApprovedForAll',
		args: [ownerAddress!, spenderAddress!],
		chainId,
		query: {
			enabled: isEnabled,
		},
	});

	return {
		isApproved: isApproved as boolean | undefined,
		...rest,
	};
}
