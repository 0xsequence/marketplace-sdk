import type { Hash } from "viem";
import {
  type TransactionConfig,
  TransactionMachine,
} from "./execute-transaction";
import { useWalletClient } from "wagmi";
import { useSwitchChainModal } from "../../ui/modals/_internal/components/switchChainModal";
import { getPublicRpcClient } from "../../../utils";
import { useConfig, useMarketplaceConfig } from "../../hooks";
import { useSelectPaymentModal } from "@0xsequence/kit-checkout";

export const useTransactionMachine = (
  config: Omit<TransactionConfig, "sdkConfig">,
  onSuccess?: (hash: Hash) => void,
  onError?: (error: Error) => void
) => {
  const { data: walletClient } = useWalletClient();
  const { show: showSwitchChainModal } = useSwitchChainModal();
  const sdkConfig = useConfig();
  const { data: marketplaceConfig, error: marketplaceError } =
    useMarketplaceConfig();
  const { openSelectPaymentModal } = useSelectPaymentModal();


  if (marketplaceError) {
    throw marketplaceError; //TODO: Add error handling
  }

  if (!walletClient || !marketplaceConfig) return null;

  return new TransactionMachine(
    { config: { sdkConfig, ...config }, onSuccess, onError },
    walletClient,
    getPublicRpcClient(config.chainId),
    marketplaceConfig,
    openSelectPaymentModal,
    async (chainId) => {
      return new Promise<void>((resolve, reject) => {
        showSwitchChainModal({
          chainIdToSwitchTo: Number(chainId),
          onSwitchChain: () => {
            resolve();
          },
          callbacks: {
            onUserRejectedRequest: () =>
              reject(new Error("User rejected chain switch")),
          },
        });
      });
    },
    { onStateChange: () => {} } //TODO: Add onStateChange
  );
};
