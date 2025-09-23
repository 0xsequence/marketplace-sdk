import { useQuery } from '@tanstack/react-query';
import { type Address, erc20Abi, zeroAddress } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';

export const useHasSufficientBalance = ({
	chainId,
	value,
	tokenAddress,
}: {
	chainId: number;
	value: bigint;
	tokenAddress: Address;
}) => {
	const { address } = useAccount();
	const publicClient = usePublicClient({ chainId });
	const nativeToken = tokenAddress === zeroAddress;

	return useQuery({
		queryKey: ['sufficientBalance', address, chainId, tokenAddress, value],
		queryFn: async () => {
			if (!address || !publicClient) return;

			const balance = nativeToken
				? await publicClient.getBalance({ address })
				: await publicClient.readContract({
						address: tokenAddress,
						abi: erc20Abi,
						functionName: 'balanceOf',
						args: [address],
					});


			return {
				hasSufficientBalance: balance >= value || value === 0n,
				balance,
			};
		},
		enabled:
			!!address &&
			!!publicClient &&
			!!tokenAddress &&
			(!!value || value === 0n),
	});
};
