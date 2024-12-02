import { useState, useCallback } from 'react';
import type { Hash } from 'viem';
import { 
  SellInput,
  TransactionType, 
  type TransactionSteps 
} from '../_internal/transaction-machine/execute-transaction';
import { 
  useTransactionMachine, 
  type UseTransactionMachineConfig 
} from '../_internal/transaction-machine/useTransactionMachine';

interface UseSellArgs extends Omit<UseTransactionMachineConfig, 'type'> {
  onSuccess?: (hash: Hash) => void;
  onError?: (error: Error) => void;
}

export const useSell = ({
  onSuccess,
  onError,
  ...config
}: UseSellArgs) => {
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState<TransactionSteps | null>(null);

  const machine = useTransactionMachine(
    {
      ...config,
      type: TransactionType.SELL,
    },
    onSuccess,
    onError,
  );

  const loadSteps = useCallback(
    async (props: SellInput) => {
      if (!machine) return;
      setIsLoading(true);
      try {
        const generatedSteps = await machine.getTransactionSteps(props);
        setSteps(generatedSteps);
      } catch (error) {
        onError?.(error as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [machine, onError],
  );

  return {
    sell: (props: SellInput) => machine?.start({ props }),
    getSellSteps: (props: SellInput) => ({
      isLoading,
      steps,
      refreshSteps: () => loadSteps(props),
    }),
  };
};
