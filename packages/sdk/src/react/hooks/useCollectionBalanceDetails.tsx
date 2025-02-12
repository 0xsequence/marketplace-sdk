import { useCollectionBalanceDetails as useKitCollectionBalanceDetails } from '@0xsequence/kit';
import { z } from 'zod';
import {
	AddressSchema,
	ChainIdSchema,
	QueryArgSchema,
	balanceQueries,
} from '../_internal';
import { useQuery } from '@tanstack/react-query';
import { useConfig } from './useConfig';

const filterSchema = z.object({
	accountAddresses: z.array(AddressSchema),
	contractWhitelist: z.array(AddressSchema).optional(),
	omitNativeBalances: z.boolean(),
});

const useCollectionBalanceDetailsArgsSchema = z.object({
	chainId: ChainIdSchema.pipe(z.coerce.number()),
	filter: filterSchema,
	query: QueryArgSchema.optional(),
});

export type CollectionBalanceFilter = z.infer<typeof filterSchema>;
export type UseCollectionBalanceDetailsArgs = z.input<
	typeof useCollectionBalanceDetailsArgsSchema
>;

export const useCollectionBalanceDetails = (
	args: UseCollectionBalanceDetailsArgs,
) => {
	const config = useConfig();

	const parsedArgs = useCollectionBalanceDetailsArgsSchema.parse(args);

	const { data: collectionBalanceDetails } = useKitCollectionBalanceDetails({
		chainId: parsedArgs.chainId,
		filter: {
			accountAddresses: parsedArgs.filter.accountAddresses || [],
			contractWhitelist: parsedArgs.filter.contractWhitelist || [],
			omitNativeBalances: parsedArgs.filter.omitNativeBalances ?? true,
		},
	});

	return useQuery({
		queryKey: [...balanceQueries.collectionBalanceDetails, args, config],
		queryFn: () => {
			if (collectionBalanceDetails) {
				return collectionBalanceDetails;
			}
			throw new Error('Failed to fetch collection balance details');
		},
		...args.query,
	});
};
