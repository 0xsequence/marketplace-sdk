import { useQuery } from '@tanstack/react-query';
import type { NewMarketplaceType } from '../../types/new-marketplace-types';
import { listCollectionsOptions } from '../queries/listCollections';
import { useConfig } from './useConfig';
import { useMarketplaceConfig } from './useMarketplaceConfig';

type UseListCollectionsArgs = {
	marketplaceType?: NewMarketplaceType;
	query?: {
		enabled?: boolean;
	};
};

export const useListCollections = (args: UseListCollectionsArgs = {}) => {
	const config = useConfig();
	const { data: marketplaceConfig } = useMarketplaceConfig();

	return useQuery(
		listCollectionsOptions({
			marketplaceType: args.marketplaceType,
			marketplaceConfig: marketplaceConfig,
			config,
		}),
	);
};
