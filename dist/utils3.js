import { n as getIndexerClient } from "./api.js";
import { TransactionReceiptNotFoundError } from "viem";

//#region src/react/utils/waitForTransactionReceipt.ts
const MAX_RETRIES = 3;
const MAX_BLOCK_WAIT = 30;
const waitForTransactionReceipt = async ({ txHash, chainId, sdkConfig, maxBlockWait = MAX_BLOCK_WAIT }) => {
	const indexer = getIndexerClient(chainId, sdkConfig);
	let retries = 0;
	while (retries < MAX_RETRIES) try {
		return (await indexer.fetchTransactionReceipt({
			txnHash: txHash,
			maxBlockWait
		})).receipt;
	} catch (error) {
		retries++;
		console.error(`Failed to fetch transaction receipt (attempt ${retries}/${MAX_RETRIES}):`, error);
		if (retries >= MAX_RETRIES) throw TransactionReceiptNotFoundError;
	}
	throw TransactionReceiptNotFoundError;
};

//#endregion
export { waitForTransactionReceipt as t };
//# sourceMappingURL=utils3.js.map