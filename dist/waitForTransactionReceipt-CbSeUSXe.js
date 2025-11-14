import { getIndexerClient } from "./api-GwTR0dBA.js";
import { TransactionReceiptNotFoundError } from "viem";

//#region src/react/utils/waitForTransactionReceipt.ts
const MAX_RETRIES = 3;
const MAX_BLOCK_WAIT = 30;
const waitForTransactionReceipt = async ({ txHash, chainId, sdkConfig, maxBlockWait = MAX_BLOCK_WAIT }) => {
	const indexer = getIndexerClient(chainId, sdkConfig);
	let retries = 0;
	while (retries < MAX_RETRIES) try {
		const result = await indexer.fetchTransactionReceipt({
			txnHash: txHash,
			maxBlockWait
		});
		return result.receipt;
	} catch (error) {
		retries++;
		console.error(`Failed to fetch transaction receipt (attempt ${retries}/${MAX_RETRIES}):`, error);
		if (retries >= MAX_RETRIES) throw TransactionReceiptNotFoundError;
	}
	throw TransactionReceiptNotFoundError;
};

//#endregion
export { waitForTransactionReceipt };
//# sourceMappingURL=waitForTransactionReceipt-CbSeUSXe.js.map