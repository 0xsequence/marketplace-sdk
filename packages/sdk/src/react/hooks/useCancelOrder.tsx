import {
  type CancelInput,
  TransactionType,
} from "../_internal/transaction-machine/execute-transaction";
import {
  useTransactionMachine,
  type UseTransactionMachineConfig,
} from "../_internal/transaction-machine/useTransactionMachine";

interface UseCancelOrderArgs extends UseTransactionMachineConfig {
  onSuccess?: (hash: string) => void;
  onError?: (error: Error) => void;
}

export const useCancelOrder = ({
  onSuccess,
  onError,
  ...config
}: UseCancelOrderArgs) => {
  const machine = useTransactionMachine(
    {
      ...config,
      type: TransactionType.CANCEL,
    },
    onSuccess,
    onError
  );

  return {
    cancel: (props: CancelInput) => machine?.start({ props }),
    onError,
    onSuccess,
  };
};
