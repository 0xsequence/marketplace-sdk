import { Mn as index_d_exports$1, m as SdkConfig } from "../../create-config.js";
import "../../index2.js";
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
}) => Promise<index_d_exports$1.TransactionReceipt>;
//#endregion
export { waitForTransactionReceipt };
//# sourceMappingURL=index.d.ts.map