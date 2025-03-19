import { queryOptions, skipToken, useQuery } from '@tanstack/react-query';
import type { PublicClient } from 'viem';
import { getContract } from 'viem';
import { usePublicClient } from 'wagmi';
import { z } from 'zod';
import { EIP2981_ABI } from '../../utils';
import {
	AddressSchema,
	ChainIdSchema,
	QueryArgSchema,
	collectableKeys,
} from '../_internal';

const UseRoyaletyPercentageSchema = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	collectionAddress: AddressSchema,
	collectibleId: z.string(),
	query: QueryArgSchema,
});

type UseRoyaletyPercentageArgs = z.infer<typeof UseRoyaletyPercentageSchema>;

const fetchRoyaletyPercentage = async (
	args: UseRoyaletyPercentageArgs,
	publicClient: PublicClient,
) => {
	const parsedArgs = UseRoyaletyPercentageSchema.parse(args);

	const contract = getContract({
		address: parsedArgs.collectionAddress,
		abi: EIP2981_ABI,
		client: publicClient,
	});

	try {
		const [_, royaltyPercentage] = await contract.read.royaltyInfo([
			BigInt(args.collectibleId),
			100n,
		]);

		return royaltyPercentage;
	} catch (error) {
		throw new Error('Failed to fetch royalty percentage');
	}
};

export const royaletyPercentageOptions = (
	args: UseRoyaletyPercentageArgs,
	publicClient?: PublicClient,
) =>
	queryOptions({
		...args.query,
		queryKey: [...collectableKeys.royaltyPercentage, args],
		queryFn: publicClient
			? () => fetchRoyaletyPercentage(args, publicClient)
			: skipToken,
	});

export const useRoyaltyPercentage = (args: UseRoyaletyPercentageArgs) => {
	const publicClient = usePublicClient({ chainId: Number(args.chainId) });
	return useQuery(royaletyPercentageOptions(args, publicClient));
};
