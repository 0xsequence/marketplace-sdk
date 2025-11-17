import { $ as SdkConfig } from "../../create-config-BA_ne-vj.js";
import { TransactionReceipt } from "@0xsequence/indexer";
import { Hex } from "viem";

//#region src/react/utils/waitForTransactionReceipt.d.ts
declare const waitForTransactionReceipt: ({
  txHash,
  chainId,
  sdkConfig,
  maxBlockWait
}: {
  txHash: Hex;
  chainId: number;
  sdkConfig: SdkConfig;
  maxBlockWait?: number;
}) => Promise<TransactionReceipt>;
//#endregion
export { waitForTransactionReceipt };
//# sourceMappingURL=index-Dy4xnNbD.d.ts.map