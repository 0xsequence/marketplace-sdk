import {
  type TransactionConfig,
  type BuyInput,
  TransactionType,
} from "../_internal/transaction-machine/execute-transaction";
import { useTransactionMachine } from "../_internal/transaction-machine/useTransactionMachine";

interface UseBuyOrderArgs
  extends Omit<TransactionConfig, "sdkConfig" | "type"> {
  onSuccess?: (hash: string) => void;
  onError?: (error: Error) => void;
}

export const useBuyOrder = ({
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
