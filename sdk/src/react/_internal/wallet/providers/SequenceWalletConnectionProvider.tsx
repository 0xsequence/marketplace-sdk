import { useOpenConnectModal } from '@0xsequence/connect';
import { type ReactNode, useMemo } from 'react';
import { WalletConnectionContext } from '../WalletConnectionContext';
import type { WalletConnectionHandler } from '../types';
import { useWallet } from '../useWallet';

interface SequenceWalletConnectionProviderProps {
  children: ReactNode;
}

export const SequenceWalletConnectionProvider = ({ 
  children 
}: SequenceWalletConnectionProviderProps) => {
  const { setOpenConnectModal } = useOpenConnectModal();
  const { wallet } = useWallet();

  const handler: WalletConnectionHandler = useMemo(() => ({
    openConnectModal: () => setOpenConnectModal(true),
    isConnected: !!wallet,
    getAddress: wallet?.address,
  }), [setOpenConnectModal, wallet]);

  return (
    <WalletConnectionContext.Provider value={handler}>
      {children}
    </WalletConnectionContext.Provider>
  );
};