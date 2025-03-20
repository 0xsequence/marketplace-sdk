import { useReadContract } from 'wagmi';
import { z } from 'zod';
import { EIP2981_ABI } from '../../utils';
import { AddressSchema, ChainIdSchema, QueryArgSchema } from '../_internal';

const UseRoyaltyPercentageSchema = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.string()),
	collectionAddress: AddressSchema,
	collectibleId: z.string(),
	query: QueryArgSchema.optional(),
});

type UseRoyaltyPercentageArgs = z.infer<typeof UseRoyaltyPercentageSchema>;

export const useRoyaltyPercentage = (args: UseRoyaltyPercentageArgs) => {
	const result = useReadContract({
		abi: EIP2981_ABI,
		address: args.collectionAddress,
		functionName: 'royaltyInfo',
		args: [BigInt(args.collectibleId), BigInt(100)],
		chainId: Number(args.chainId),
	});

	return result;
};
