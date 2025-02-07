import { useAccount, useSwitchChain, useWalletClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { wallet, type WalletInstance } from './wallet';
import { useConfig } from '../../hooks';

type UseWalletReturn = {
  data: WalletInstance | null | undefined;
  isLoading: boolean;
  isError: boolean;
};

export const useWallet = (): UseWalletReturn => {
  const { chains } = useSwitchChain();
  const { data: walletClient, isLoading: wagmiWalletIsLoading } = useWalletClient();
  const { connector, isConnected, isConnecting } = useAccount();
  const sdkConfig = useConfig();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['wallet', walletClient?.account.address, connector?.id],
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
    enabled: Boolean(walletClient && connector && isConnected),
  });

  return {
    data,
    isLoading: isLoading || isConnecting || wagmiWalletIsLoading,
    isError,
  };
};
