import {
	type Address,
	type Hex,
	type PublicClient,
	parseEventLogs,
} from 'viem';
import { SequenceMarketplaceV1_ABI } from '..';

export const getSequenceMarketplaceRequestId = async (
	hash: Hex,
	publicClient: PublicClient,
	walletAddress: Address,
) => {
	const receipt = await publicClient.getTransactionReceipt({
		hash: hash,
	});

	const logs = parseEventLogs({
		abi: SequenceMarketplaceV1_ABI,
		eventName: 'RequestCreated',
		args: {
			creator: walletAddress,
		},
		logs: receipt.logs,
	});

	return logs[0].args.requestId.toString();
};
