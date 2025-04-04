import { queryOptions } from '@tanstack/react-query';
import type { SdkConfig } from '../../types';
//TODO: This is not complete, there is no hook for this,
// add it if we need it in the future
import { LaosAPI, getIndexerClient } from '../_internal';

export type UseGetTokenSuppliesArgs = {
	chainId: number;
	contractAddress: string;
	tokenId: string;
	isLaos721?: boolean;
};

export async function getTokenSupplies(
	args: UseGetTokenSuppliesArgs,
	config: SdkConfig,
) {
	if (args.isLaos721) {
		const laosApi = new LaosAPI();
		return laosApi.getTokenSupplies({
			chainId: args.chainId.toString(),
			contractAddress: args.contractAddress,
		});
	}

	const indexerClient = getIndexerClient(args.chainId, config);
	return await indexerClient.getTokenSupplies(args);
}

export function getTokenSuppliesOptions(
	args: UseGetTokenSuppliesArgs,
	config: SdkConfig,
) {
	return queryOptions({
		queryKey: ['getTokenSupplies', args],
		queryFn: () => getTokenSupplies(args, config),
	});
}
