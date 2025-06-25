import { useLogin, usePrivy } from '@privy-io/react-auth';
import { type ReactNode, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { WalletConnectionContext, type WalletConnectionHandler } from '../../../../sdk/src/react/_internal/wallet';

interface PrivyWalletConnectionProviderProps {
  children: ReactNode;
}

export const PrivyWalletConnectionProvider = ({ 
  children 
}: PrivyWalletConnectionProviderProps) => {
  const { login } = useLogin();
  const { authenticated } = usePrivy();
  const { address } = useAccount();

  const handler: WalletConnectionHandler = useMemo(() => ({
    openConnectModal: () => login(),
    isConnected: authenticated && !!address,
    address,
  }), [login, authenticated, address]);

  return (
    <WalletConnectionContext.Provider value={handler}>
      {children}
    </WalletConnectionContext.Provider>
  );
};