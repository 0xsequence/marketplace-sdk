import {
  type BuyInput,
  TransactionType,
} from "../_internal/transaction-machine/execute-transaction";
import {
  useTransactionMachine,
  type UseTransactionMachineConfig,
} from "../_internal/transaction-machine/useTransactionMachine";

interface UseBuyOrderArgs extends UseTransactionMachineConfig {
  onSuccess?: (hash: string) => void;
  onError?: (error: Error) => void;
}

export const useBuyCollectable = ({
  onSuccess,
  onError,
  ...config
}: UseBuyOrderArgs) => {
  const machine = useTransactionMachine(
    {
      ...config,
      type: TransactionType.BUY,
    },
    onSuccess,
    onError
  );

  return {
    buy: (props: BuyInput) => machine?.start({ props }),
    onError,
    onSuccess,
  };
};
