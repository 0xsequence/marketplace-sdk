import type { Address } from 'viem';
import { useAccount } from 'wagmi';
import { useCurrencyBalance } from '../../../hooks';

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
	const { data: balanceData, isLoading } = useCurrencyBalance({
		currencyAddress: tokenAddress,
		chainId,
		userAddress: address,
	});

	const balance = balanceData?.value ?? 0n;

	return {
		data: {
			hasSufficientBalance: balance >= value || value === 0n,
			balance,
		},
		isLoading,
	};
};
