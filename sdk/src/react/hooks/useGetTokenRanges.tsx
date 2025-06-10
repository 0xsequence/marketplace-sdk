import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { SdkConfig } from '../../types';
import { AddressSchema, QueryArgSchema, getIndexerClient } from '../_internal';
import { useConfig } from './useConfig';

const UseGetTokenRangesSchema = z.object({
	chainId: z.number(),
	collectionAddress: AddressSchema,
	query: QueryArgSchema,
});

export type UseGetTokenRangesArgs = z.infer<typeof UseGetTokenRangesSchema>;

export type UseGetTokenRangesReturn = Awaited<
	ReturnType<typeof fetchTokenRanges>
>;

const fetchTokenRanges = async (
	args: UseGetTokenRangesArgs,
	config: SdkConfig,
) => {
	const parsedArgs = UseGetTokenRangesSchema.parse(args);
	const indexerClient = getIndexerClient(parsedArgs.chainId, config);

	return indexerClient.getTokenIDRanges({
		contractAddress: parsedArgs.collectionAddress,
	});
};

export const tokenRangesOptions = (
	args: UseGetTokenRangesArgs,
	config: SdkConfig,
) => {
	return queryOptions({
		...args.query,
		queryKey: ['indexer', 'tokenRanges', args, config],
		queryFn: () => fetchTokenRanges(args, config),
	});
};

export const useGetTokenRanges = (args: UseGetTokenRangesArgs) => {
	const config = useConfig();
	return useQuery(tokenRangesOptions(args, config));
};
