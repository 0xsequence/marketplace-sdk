import { useState, useCallback } from 'react';
import type { Hash } from 'viem';
import { 
  OfferInput,
  TransactionType, 
  type TransactionSteps 
} from '../_internal/transaction-machine/execute-transaction';
import { 
  useTransactionMachine, 
  type UseTransactionMachineConfig 
} from '../_internal/transaction-machine/useTransactionMachine';

interface UseMakeOfferArgs extends Omit<UseTransactionMachineConfig, 'type'> {
  onSuccess?: (hash: Hash) => void;
  onError?: (error: Error) => void;
}

export const useMakeOffer = ({
  onSuccess,
  onError,
  ...config
}: UseMakeOfferArgs) => {
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState<TransactionSteps | null>(null);

  const machine = useTransactionMachine(
    {
      ...config,
      type: TransactionType.OFFER,
    },
    onSuccess,
    onError,
  );

  const loadSteps = useCallback(
    async (props: OfferInput) => {
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
    makeOffer: (props: OfferInput) => machine?.start({ props }),
    getMakeOfferSteps: (props: OfferInput) => ({
      isLoading,
      steps,
      refreshSteps: () => loadSteps(props),
    }),
  };
};