import { $ as SdkConfig } from "../../create-config-l2-8j3NB.js";
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
//# sourceMappingURL=index.d.ts.map