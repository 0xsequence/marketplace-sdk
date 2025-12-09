import type { Address } from 'viem';
import { useAccount, useReadContract } from 'wagmi';
import { ERC20_ABI } from '../../../../../../utils/abi';

export interface UseERC20AllowanceArgs {
	tokenAddress: Address | undefined;
	spenderAddress: Address | undefined;
	chainId: number;
	enabled?: boolean;
}

export function useERC20Allowance({
	tokenAddress,
	spenderAddress,
	chainId,
	enabled = true,
}: UseERC20AllowanceArgs) {
	const { address: ownerAddress } = useAccount();

	const isEnabled =
		enabled &&
		!!tokenAddress &&
		!!ownerAddress &&
		!!spenderAddress &&
		chainId > 0;

	const { data: allowance, ...rest } = useReadContract({
		address: tokenAddress,
		abi: ERC20_ABI,
		functionName: 'allowance',
		args: [ownerAddress!, spenderAddress!],
		chainId,
		query: {
			enabled: isEnabled,
		},
	});

	return {
		allowance: allowance as bigint | undefined,
		...rest,
	};
}
