import { useQuery } from '@tanstack/react-query';
import type { MarketplaceType } from '../../types/new-marketplace-types';
import { listCollectionsOptions } from '../queries/listCollections';
import { useConfig } from './useConfig';
import { useMarketplaceConfig } from './useMarketplaceConfig';

type UseListCollectionsArgs = {
	marketplaceType?: MarketplaceType;
	query?: {
		enabled?: boolean;
	};
};

export const useListCollections = (args: UseListCollectionsArgs = {}) => {
	const config = useConfig();
	const { data: marketplaceConfig } = useMarketplaceConfig();

	return useQuery({
		...args.query,
		...listCollectionsOptions({
			marketplaceType: args.marketplaceType,
			marketplaceConfig,
			config,
		}),
	});
};
