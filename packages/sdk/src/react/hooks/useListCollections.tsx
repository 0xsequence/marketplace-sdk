import { queryOptions, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import type { MarketplaceConfig, SdkConfig } from '../../types';
import {
	QueryArgSchema,
	collectionKeys,
	getMetadataClient,
} from '../_internal';
import { useConfig } from './useConfig';
import { useMarketplaceConfig } from './useMarketplaceConfig';
import { ContractInfo } from '@0xsequence/metadata';

const UseListCollectionsSchema: z.ZodObject<{
    query: z.ZodDefault<z.ZodOptional<z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled?: boolean | undefined;
    }, {
        enabled?: boolean | undefined;
    }>>>>;
}, "strip"> = z.object({
	query: QueryArgSchema.optional().default({}),
});

export type UseListCollectionsArgs = z.input<typeof UseListCollectionsSchema>;

export type UseListCollectionsReturn = Awaited<
	ReturnType<typeof fetchListCollections>
>;

type FetchListCollectionsArgs = {
	marketplaceConfig: MarketplaceConfig;
	query?: z.infer<typeof QueryArgSchema>;
};

const fetchListCollections = async (
	{ marketplaceConfig }: FetchListCollectionsArgs,
	config: SdkConfig,
): Promise<ContractInfo[]> => {
	const metadataClient = getMetadataClient(config);

	if (!marketplaceConfig?.collections?.length) {
		return [];
	}

	// Group collections by chainId
	const collectionsByChain = marketplaceConfig.collections.reduce<
		Record<string, string[]>
	>((acc, curr) => {
		const { chainId, address } = curr;
		if (!acc[chainId]) {
			acc[chainId] = [];
		}
		acc[chainId].push(address);
		return acc;
	}, {});

	// Fetch collections for each chain
	const promises = Object.entries(collectionsByChain).map(
		([chainId, addresses]) =>
			metadataClient
				.getContractInfoBatch({
					chainID: chainId,
					contractAddresses: addresses,
				})
				.then((resp) => Object.values(resp.contractInfoMap)),
	);

	const results = await Promise.all(promises);
	return results.flat();
};

export const listCollectionsOptions = (
	args: FetchListCollectionsArgs,
	config: SdkConfig,
): any => {
	return queryOptions({
		...args.query,
		queryKey: [...collectionKeys.list],
		queryFn: () => fetchListCollections(args, config),
	});
};

export const useListCollections = (args: UseListCollectionsArgs = {}): DefinedQueryObserverResult<TData, TError> => {
	const config = useConfig();
	const { data: marketplaceConfig, isLoading: isLoadingConfig } =
		useMarketplaceConfig();

	return useQuery({
		...listCollectionsOptions(
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			{ marketplaceConfig: marketplaceConfig!, query: args.query },
			config,
		),
		enabled: !isLoadingConfig && !!marketplaceConfig,
	});
};
