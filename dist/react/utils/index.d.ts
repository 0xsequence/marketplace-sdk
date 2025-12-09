import { _ as SdkConfig } from "../../create-config.js";
import { Indexer } from "@0xsequence/api-client";
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
}) => Promise<Indexer.TransactionReceipt>;
//#endregion
export { waitForTransactionReceipt };
//# sourceMappingURL=index.d.ts.map