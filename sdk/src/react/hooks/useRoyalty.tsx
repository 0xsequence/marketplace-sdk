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
	query: QueryArgSchema.optional(),
});

type UseRoyaltyArgs = z.infer<typeof UseRoyaltySchema>;

export const useRoyalty = (args: UseRoyaltyArgs) => {
	const { chainId, collectionAddress, collectibleId, query } = args;
	const scopeKey = `${collectableKeys.royaltyPercentage.join('.')}-${chainId}-${collectionAddress}-${collectibleId}`;

	const contractResult = useReadContract({
		scopeKey: scopeKey,
		abi: EIP2981_ABI,
		address: collectionAddress,
		functionName: 'royaltyInfo',
		args: [BigInt(collectibleId), BigInt(100)],
		chainId: Number(chainId),
		query: query,
	});

	const [recipient, percentage] = contractResult.data ?? [];
	const formattedData =
		recipient && percentage
			? {
					percentage,
					recipient,
				}
			: null;

	return {
		...contractResult,
		data: formattedData,
	};
};
