import { useQuery } from '@tanstack/react-query';
import { marketplaceConfigOptions } from '../queries/marketplaceConfig';
import { useConfig } from './useConfig';

export const useMarketplaceConfig = () => {
	const config = useConfig();
	return useQuery(marketplaceConfigOptions(config));
};
