import { skipToken, useQuery } from '@tanstack/react-query';
import { type Address, erc20Abi, formatUnits, zeroAddress } from 'viem';
import { getPublicRpcClient } from '../../utils';

export function useCurrencyBalance({
	currencyAddress,
	chainId,
	userAddress,
}: {
	currencyAddress: Address | undefined;
	chainId: number | undefined;
	userAddress: Address | undefined;
}) {
	return useQuery({
		queryKey: ['balance', currencyAddress, chainId, userAddress],
		queryFn:
			!!userAddress && !!chainId && !!currencyAddress
				? async () => {
						if (!userAddress) return null;

						const publicClient = getPublicRpcClient(chainId);

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
