import { i as ERC20_ABI } from "./token.js";
import { useAccount, useReadContract } from "wagmi";

//#region src/react/ui/modals/MakeOfferModal/internal/hooks/use-erc20-allowance.ts
function useERC20Allowance({ tokenAddress, spenderAddress, chainId, enabled = true }) {
	const { address: ownerAddress } = useAccount();
	const { data: allowance, ...rest } = useReadContract({
		address: tokenAddress,
		abi: ERC20_ABI,
		functionName: "allowance",
		args: [ownerAddress, spenderAddress],
		chainId,
		query: { enabled: enabled && !!tokenAddress && !!ownerAddress && !!spenderAddress && chainId > 0 }
	});
	return {
		allowance,
		...rest
	};
}

//#endregion
export { useERC20Allowance as t };
//# sourceMappingURL=hooks.js.map