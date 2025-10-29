import { n as getIndexerClient } from "./api-D_M2JwE1.js";
import { TransactionReceiptNotFoundError, WaitForTransactionReceiptTimeoutError } from "viem";

//#region src/react/utils/waitForTransactionReceipt.ts
const THREE_MIN = 3 * (60 * 1e3);
const waitForTransactionReceipt = async ({ txHash, chainId, sdkConfig, timeout = THREE_MIN }) => {
	const indexer = getIndexerClient(chainId, sdkConfig);
	return Promise.race([new Promise((resolve, reject) => {
		indexer.subscribeReceipts({ filter: { txnHash: txHash } }, {
			onMessage: ({ receipt }) => {
				resolve(receipt);
			},
			onError: () => {
				reject(TransactionReceiptNotFoundError);
			}
		});
	}), new Promise((_, reject) => {
		setTimeout(() => {
			reject(WaitForTransactionReceiptTimeoutError);
		}, timeout);
	})]);
};

//#endregion
export { waitForTransactionReceipt as t };
//# sourceMappingURL=waitForTransactionReceipt-BSeGx3lO.js.map