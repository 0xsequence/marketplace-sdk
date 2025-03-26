import { useQuery } from '@tanstack/react-query';
import { useReadContract } from 'wagmi';
import { z } from 'zod';
import { EIP2981_ABI } from '../../utils';
import {
	AddressSchema,
	ChainIdSchema,
	QueryArgSchema,
	collectableKeys,
} from '../_internal';

const UseRoyaltySchema = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	collectionAddress: AddressSchema,
	collectibleId: z.string(),
	query: QueryArgSchema.default({ enabled: true }).optional(),
});

type UseRoyaltyArgs = z.infer<typeof UseRoyaltySchema>;

export const useRoyalty = (args: UseRoyaltyArgs) => {
	const result = useReadContract({
		abi: EIP2981_ABI,
		address: args.collectionAddress,
		functionName: 'royaltyInfo',
		args: [BigInt(args.collectibleId), BigInt(100)],
		chainId: Number(args.chainId),
		query: {
			enabled:
				!!args.collectibleId &&
				!!args.collectionAddress &&
				!!args.chainId &&
				args.query?.enabled,
		},
	});

	console.log(result.data);

	return useQuery({
		...args.query,
		queryKey: [...collectableKeys.royaltyPercentage, args],
		queryFn: () => {
			if (!result.data) return null;

			return {
				percentage: result.data[1],
				recipient: result.data[0],
			};
		},
		enabled:
			!!args.collectibleId &&
			!!args.collectionAddress &&
			!!args.chainId &&
			args.query?.enabled,
	});
};
