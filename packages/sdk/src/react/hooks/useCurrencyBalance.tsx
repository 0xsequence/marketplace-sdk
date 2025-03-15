import { skipToken, useQuery } from '@tanstack/react-query';
import { type Address, erc20Abi, formatUnits, zeroAddress } from 'viem';
import { usePublicClient } from 'wagmi';
export function useCurrencyBalance({
	currencyAddress,
	chainId,
	userAddress,
}: {
	currencyAddress: Address | undefined;
	chainId: number | undefined;
	userAddress: Address | undefined;
}) {
	const publicClient = usePublicClient({ chainId });

	return useQuery({
		queryKey: ['balance', currencyAddress, chainId, userAddress],
		queryFn:
			!!userAddress && !!chainId && !!currencyAddress && !!publicClient
				? async () => {
						if (currencyAddress === zeroAddress) {
							const balance = await publicClient.getBalance({
								address: userAddress,
							});
							return {
								value: balance,
								formatted: formatUnits(balance, 18),
							};
						}

						const [balance, decimals] = await Promise.all([
							publicClient.readContract({
								address: currencyAddress,
								abi: erc20Abi,
								functionName: 'balanceOf',
								args: [userAddress],
							}),
							publicClient.readContract({
								address: currencyAddress,
								abi: erc20Abi,
								functionName: 'decimals',
							}),
						]);

						return {
							value: balance,
							formatted: formatUnits(balance, decimals),
						};
					}
				: skipToken,
	});
}
