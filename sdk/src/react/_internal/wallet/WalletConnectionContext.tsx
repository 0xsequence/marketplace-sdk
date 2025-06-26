import { createContext, useContext } from 'react';
import { WalletConnectionHandler } from './types';

export const WalletConnectionContext = createContext<WalletConnectionHandler | null>(null);

export const useWalletConnection = () => {
  const context = useContext(WalletConnectionContext);
  if (!context) {
    throw new Error('useWalletConnection must be used within a WalletConnectionProvider');
  }
  return context;
};