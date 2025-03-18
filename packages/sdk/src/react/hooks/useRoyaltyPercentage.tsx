import type { ChainId } from '@0xsequence/network';
import { queryOptions, skipToken, useQuery } from '@tanstack/react-query';
import type { Hex, PublicClient } from 'viem';
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

const UseRoyaletyPercentageSchema: z.ZodObject<
	{
		chainId: z.ZodPipeline<
			z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodNativeEnum<ChainId>]>,
			z.ZodString
		>;
		collectionAddress: z.ZodEffects<z.ZodString, Address, string>;
		collectibleId: z.ZodString;
		query: z.ZodOptional<
			z.ZodObject<
				{
					enabled: z.ZodOptional<z.ZodBoolean>;
				},
				'strip',
				z.ZodTypeAny,
				{
					enabled?: boolean | undefined;
				},
				{
					enabled?: boolean | undefined;
				}
			>
		>;
	},
	'strip'
> = z.object({
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

export const royaletyPercentageOptions = (
	args: UseRoyaletyPercentageArgs,
	publicClient?: PublicClient,
): any =>
	queryOptions({
		...args.query,
		queryKey: [...collectableKeys.royaltyPercentage, args],
		queryFn: publicClient
			? () => fetchRoyaletyPercentage(args, publicClient)
			: skipToken,
	});

export const useRoyaltyPercentage = (
	args: UseRoyaletyPercentageArgs,
): DefinedQueryObserverResult<TData, TError> => {
	const publicClient = usePublicClient({ chainId: Number(args.chainId) });
	return useQuery(royaletyPercentageOptions(args, publicClient));
};
