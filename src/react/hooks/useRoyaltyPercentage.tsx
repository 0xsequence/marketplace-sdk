import { type ChainId, type QueryArg, collectableKeys } from '@internal';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';
import { getContract } from 'viem';
import { EIP2981_ABI } from '../../utils/abi/abi/standard/EIP2981';
import { getPublicRpcClient } from '../../utils/get-public-rpc-client';

type UseRoyaletyPercentageArgs = {
	chainId: ChainId;
	collectionAddress: string;
	collectibleId: string;
} & QueryArg;

const fetchRoyaletyPercentage = async (args: UseRoyaletyPercentageArgs) => {
	const publicClient = getPublicRpcClient(args.chainId);

	const contract = getContract({
		address: args.collectionAddress as Hex,
		abi: EIP2981_ABI,
		client: publicClient,
	});

	try {
		const [_, royaltyPercentage] = await contract.read.royaltyInfo([
			BigInt(args.collectibleId),
			100n,
		]);

		return royaltyPercentage;
	} catch {
		//TODO: dont swallow errors
		return 0n;
	}
};

export const royaletyPercentageOptions = (args: UseRoyaletyPercentageArgs) =>
	queryOptions({
		...args.query,
		queryKey: [...collectableKeys.royaltyPercentage, args],
		queryFn: () => fetchRoyaletyPercentage(args),
	});

export const useRoyaltyPercentage = (args: UseRoyaletyPercentageArgs) => {
	return useQuery(royaletyPercentageOptions(args));
};
