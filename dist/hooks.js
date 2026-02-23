import { t as ContractType } from "./dist.js";
import { n as ERC1155_ABI, r as ERC721_ABI } from "./token.js";
import { useAccount, useReadContract } from "wagmi";
import { zeroAddress } from "viem";

//#region src/react/ui/modals/CreateListingModal/internal/hooks/use-collectible-approval.ts
function useCollectibleApproval({ collectionAddress, spenderAddress, chainId, contractType, enabled = true }) {
	const { address: ownerAddress } = useAccount();
	const isEnabled = enabled && !!collectionAddress && !!ownerAddress && !!spenderAddress && !!contractType && chainId > 0;
	const { data: isApproved, ...rest } = useReadContract({
		address: collectionAddress,
		abi: contractType === ContractType.ERC721 ? ERC721_ABI : ERC1155_ABI,
		functionName: "isApprovedForAll",
		args: [ownerAddress ?? zeroAddress, spenderAddress ?? zeroAddress],
		chainId,
		query: { enabled: isEnabled }
	});
	return {
		isApproved,
		...rest
	};
}

//#endregion
export { useCollectibleApproval as t };
//# sourceMappingURL=hooks.js.map