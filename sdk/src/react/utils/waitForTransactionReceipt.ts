import type { Indexer } from '@0xsequence/api-client';
import { type Hex, TransactionReceiptNotFoundError } from 'viem';
import type { SdkConfig } from '../../types';
import { getIndexerClient } from '../_internal/api';

const MAX_RETRIES = 3;
const MAX_BLOCK_WAIT = 30;

export const waitForTransactionReceipt = async ({
	txHash,
	chainId,
	sdkConfig,
	maxBlockWait = MAX_BLOCK_WAIT,
}: {
	txHash: Hex;
	chainId: number;
	sdkConfig: SdkConfig;
	maxBlockWait?: number;
}): Promise<Indexer.TransactionReceipt> => {
	const indexer = getIndexerClient(chainId, sdkConfig);
	let retries = 0;

	while (retries < MAX_RETRIES) {
		try {
			const result = await indexer.fetchTransactionReceipt({
				txnHash: txHash,
				maxBlockWait,
			});
			return result.receipt;
		} catch (error) {
			retries++;
			console.error(
				`Failed to fetch transaction receipt (attempt ${retries}/${MAX_RETRIES}):`,
				error,
			);
			if (retries >= MAX_RETRIES) {
				throw TransactionReceiptNotFoundError;
			}
		}
	}

	throw TransactionReceiptNotFoundError;
};
