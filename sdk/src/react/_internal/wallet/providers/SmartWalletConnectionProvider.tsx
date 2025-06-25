import { type ReactNode, useContext } from 'react';
import { WalletConnectionContext } from '../WalletConnectionContext';
import { SequenceWalletConnectionProvider } from './SequenceWalletConnectionProvider';

interface SmartWalletConnectionProviderProps {
  children: ReactNode;
  fallbackProvider?: ReactNode;
}

export const SmartWalletConnectionProvider = ({ 
  children,
  fallbackProvider
}: SmartWalletConnectionProviderProps) => {
  // Check if we're already inside a WalletConnectionProvider
  const existingContext = useContext(WalletConnectionContext);
  
  if (existingContext) {
    // Already have a wallet connection provider, just pass through
    return <>{children}</>;
  }

  // Try to detect if we have Sequence Connect available
  try {
    return (
      <SequenceWalletConnectionProvider>
        {children}
      </SequenceWalletConnectionProvider>
    );
  } catch (error) {
    // If Sequence Connect is not available, use fallback if provided
    if (fallbackProvider) {
      return <>{fallbackProvider}</>;
    }
    
    throw new Error(
      'No supported wallet provider found. Please wrap your app with a WalletConnectionProvider.'
    );
  }
};