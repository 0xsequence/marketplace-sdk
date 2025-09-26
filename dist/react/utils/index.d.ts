import { SdkConfig } from "../../create-config-goz-zUX1.js";
import { TransactionReceipt } from "@0xsequence/indexer";
import { Hex } from "viem";

//#region src/react/utils/waitForTransactionReceipt.d.ts
declare const waitForTransactionReceipt: ({
  txHash,
  chainId,
  sdkConfig,
  timeout
}: {
  txHash: Hex;
  chainId: number;
  sdkConfig: SdkConfig;
  timeout?: number;
}) => Promise<TransactionReceipt>;
//#endregion
export { waitForTransactionReceipt };
//# sourceMappingURL=index.d.ts.map