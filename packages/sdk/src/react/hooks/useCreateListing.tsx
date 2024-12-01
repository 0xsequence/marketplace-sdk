import {
  type ListingInput,
  TransactionType,
} from "../_internal/transaction-machine/execute-transaction";
import {
  useTransactionMachine,
  type UseTransactionMachineConfig,
} from "../_internal/transaction-machine/useTransactionMachine";

interface UseCreateListingArgs
  extends Omit<UseTransactionMachineConfig, "type"> {
  onSuccess?: (hash: string) => void;
  onError?: (error: Error) => void;
}

export const UseCreateListing = ({
  onSuccess,
  onError,
  ...config
}: UseCreateListingArgs) => {
  const machine = useTransactionMachine(
    {
      ...config,
      type: TransactionType.LISTING,
    },
    onSuccess,
    onError
  );

  return {
    list: (props: ListingInput) => machine?.start({ props }),
    getListingSteps: (props: ListingInput) => machine?.getTransactionSteps(props),
    onError,
    onSuccess,
  };
};
