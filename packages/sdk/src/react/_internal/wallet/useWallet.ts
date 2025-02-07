import { useAccount, useChainId, useSwitchChain, useWalletClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { wallet, type WalletInstance } from './wallet';
import { useConfig } from '../../hooks';

type UseWalletReturn = {
	wallet: WalletInstance | null | undefined;
	isLoading: boolean;
	isError: boolean;
};

export const useWallet = (): UseWalletReturn => {
	const { chains } = useSwitchChain();
	const { data: walletClient, isLoading: wagmiWalletIsLoading } =
		useWalletClient();
	const { connector, isConnected, isConnecting } = useAccount();
	const sdkConfig = useConfig();
	const chainId = useChainId();

	const { data, isLoading, isError } = useQuery({
		queryKey: ['wallet', chainId, connector?.uid],
		queryFn: () => {
			if (!walletClient || !connector || !isConnected) {
				return null;
			}
			return wallet({
				wallet: walletClient,
				chains,
				connector,
				sdkConfig,
			});
		},
		staleTime: Number.POSITIVE_INFINITY,
		enabled: Boolean(walletClient && connector && isConnected),
	});

	return {
		wallet: data,
		isLoading: isLoading || isConnecting || wagmiWalletIsLoading,
		isError,
	};
};
