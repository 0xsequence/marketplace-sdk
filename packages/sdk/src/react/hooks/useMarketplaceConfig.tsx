import { useQuery } from '@tanstack/react-query';
import { marketplaceConfigOptions } from './options/marketplaceConfigOptions';
import { useConfig } from './useConfig';

export * from './options/marketplaceConfigOptions';

export const useMarketplaceConfig = () => {
	const config = useConfig();
	return useQuery(marketplaceConfigOptions(config));
};
