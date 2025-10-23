import type { TransactionReceipt } from '@0xsequence/indexer';
import {
	type Hex,
	TransactionReceiptNotFoundError,
	WaitForTransactionReceiptTimeoutError,
} from 'viem';
import type { SdkConfig } from '../../types';
import { getIndexerClient } from '../_internal/api';

const ONE_MIN = 60 * 1000;
const THREE_MIN = 3 * ONE_MIN;

export const waitForTransactionReceipt = async ({
	txHash,
	chainId,
	sdkConfig,
	timeout = THREE_MIN,
}: {
	txHash: Hex;
	chainId: number;
	sdkConfig: SdkConfig;
	timeout?: number;
}): Promise<TransactionReceipt> => {
	const indexer = getIndexerClient(chainId, sdkConfig);
	return Promise.race([
		new Promise<TransactionReceipt>((resolve, reject) => {
			indexer.subscribeReceipts(
				{
					filter: {
						txnHash: txHash,
					},
				},
				{
					onMessage: ({ receipt }) => {
						resolve(receipt);
					},
					onError: () => {
						reject(TransactionReceiptNotFoundError);
					},
				},
			);
		}),
		new Promise<TransactionReceipt>((_, reject) => {
			setTimeout(() => {
				reject(WaitForTransactionReceiptTimeoutError);
			}, timeout);
		}),
	]);
};
