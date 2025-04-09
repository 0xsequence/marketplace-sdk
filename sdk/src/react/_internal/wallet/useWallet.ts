import { skipToken, useQuery } from '@tanstack/react-query';
import {
	type Connector,
	useAccount,
	useChainId,
	usePublicClient,
	useSwitchChain,
	useWalletClient,
} from 'wagmi';
import { useConfig } from '../../hooks';
import { type WalletInstance, wallet } from './wallet';

type UseWalletReturn = {
	wallet: WalletInstance | null | undefined;
	isLoading: boolean;
	isError: boolean;
	// connector to be used for testing
	_connector?: Connector;
};

export const useWallet = (_connector?: Connector): UseWalletReturn => {
	const { chains } = useSwitchChain();
	const {
		data: walletClient,
		isLoading: wagmiWalletIsLoading,
		isError: wagmiWalletIsError,
	} = useWalletClient();
	const { connector, isConnected, isConnecting } = useAccount();
	const sdkConfig = useConfig();
	const chainId = useChainId();
	const publicClient = usePublicClient();

	const { data, isLoading, isError } = useQuery({
		queryKey: ['wallet', chainId, connector?.uid],
		queryFn:
			walletClient && connector && isConnected && publicClient
				? () => {
						return wallet({
							wallet: walletClient,
							chains,
							connector: _connector || connector,
							sdkConfig,
							publicClient,
						});
					}
				: skipToken,
		staleTime: Number.POSITIVE_INFINITY,
	});

	return {
		wallet: data,
		isLoading: isLoading || isConnecting || wagmiWalletIsLoading,
		isError: isError || wagmiWalletIsError,
	};
};
