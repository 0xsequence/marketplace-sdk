import { useQuery } from '@tanstack/react-query';
import { marketplaceConfigOptions } from '../../queries/marketplace/config';
import { useConfig } from '../config/useConfig';

export const useMarketplaceConfig = () => {
	const config = useConfig();
	return useQuery(marketplaceConfigOptions(config));
};
