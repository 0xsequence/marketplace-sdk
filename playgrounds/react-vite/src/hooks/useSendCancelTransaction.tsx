import { useSendTransaction } from "wagmi";
import { useMarketplace } from "../lib/MarketplaceContext";
import { useGenerateCancelTransaction } from "../../../../packages/sdk/src/react";
import { useEffect } from "react";
import { StepType } from "../../../../packages/sdk/src";
import { Hex } from "viem";

export default function useSendCancelTransaction() {
  const { chainId } = useMarketplace();
  const {
    sendTransaction,
    isPending: cancelTransactionPending,
    isError: cancelTransactionError,
    isSuccess: cancelTransactionSuccess,
  } = useSendTransaction();
  const { data: cancelTransactionSteps, generateCancelTransaction } =
    useGenerateCancelTransaction({ chainId });

  useEffect(() => {
    const cancelStep = cancelTransactionSteps?.find(
      (step) => step.id === StepType.cancel
    );

    if (cancelStep) {
      sendTransaction({
        value: BigInt(cancelStep.value),
        chainId: Number(chainId),
        to: cancelStep.to as Hex,
        data: cancelStep.data as Hex,
      });
    }
  }, [cancelTransactionSteps]);

  return {
    sendCancelTransaction: generateCancelTransaction,
    isPending: cancelTransactionPending,
    isError: cancelTransactionError,
    isSuccess: cancelTransactionSuccess,
  };
}
