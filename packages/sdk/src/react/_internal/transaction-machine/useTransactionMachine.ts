import type { Hash } from "viem";
import {
  type TransactionConfig,
  TransactionMachine,
} from "./execute-transaction";
import { useWalletClient } from "wagmi";
import { useSwitchChainModal } from "../../ui/modals/_internal/components/switchChainModal";
import { getPublicRpcClient } from "../../../utils";
import { useConfig } from "../../hooks";

export const useTransactionMachine = (
  config: Omit<TransactionConfig, "sdkConfig">,
  onSuccess?: (hash: Hash) => void,
  onError?: (error: Error) => void
) => {
  const { data: walletClient } = useWalletClient();
  const { show: showSwitchChainModal } = useSwitchChainModal();
  const sdkConfig = useConfig();

  if (!walletClient) return null;

  return new TransactionMachine(
    { config: { sdkConfig, ...config }, onSuccess, onError },
    walletClient,
    getPublicRpcClient(config.chainId),
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
