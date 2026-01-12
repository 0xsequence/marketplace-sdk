import type { Address } from '@0xsequence/api-client';
import { zeroAddress } from 'viem';
import { useAccount, useReadContract } from 'wagmi';
import { ERC20_ABI } from '../../../../../../utils/abi';

export type UseERC20AllowanceArgs = {
	tokenAddress: Address | undefined;
	spenderAddress: Address | undefined;
	chainId: number;
	enabled?: boolean;
};

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
		args: [ownerAddress ?? zeroAddress, spenderAddress ?? zeroAddress],
		chainId,
		query: {
			enabled: isEnabled,
		},
	});

	return {
		allowance,
		...rest,
	};
}
