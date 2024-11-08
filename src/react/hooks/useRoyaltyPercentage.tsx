import {
	AddressSchema,
	ChainIdSchema,
	QueryArgSchema,
	collectableKeys,
} from '@internal';
import { queryOptions, useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';
import { getContract } from 'viem';
import { z } from 'zod';
import { EIP2981_ABI } from '../../utils/abi/abi/standard/EIP2981';
import { getPublicRpcClient } from '../../utils/get-public-rpc-client';

const UseRoyaletyPercentageSchema = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	collectionAddress: AddressSchema,
	collectibleId: z.string(),
	query: QueryArgSchema,
});

type UseRoyaletyPercentageArgs = z.infer<typeof UseRoyaletyPercentageSchema>;

const fetchRoyaletyPercentage = async (args: UseRoyaletyPercentageArgs) => {
	const parsedArgs = UseRoyaletyPercentageSchema.parse(args);
	const publicClient = getPublicRpcClient(parsedArgs.chainId);

	const contract = getContract({
		address: parsedArgs.collectionAddress as Hex,
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
