import type { QueryClient } from '@tanstack/react-query';
import { type State, cookieToInitialState } from 'wagmi';
import type { SdkConfig } from '../../types/sdk-config';
import { createWagmiConfig } from '../_internal/wagmi/create-config';
import { marketplaceConfigOptions } from '../hooks/options/marketplaceConfigOptions';

type InitSSRClientArgs = {
	cookie: string;
	config: SdkConfig;
	queryClient: QueryClient;
};

type InitialState = { wagmi?: State };

const marketplaceConfig = async (
	config: SdkConfig,
	queryClient: QueryClient,
) => {
	const configOptions = marketplaceConfigOptions(config);
	return queryClient.fetchQuery(configOptions);
};

const initialState = async (args: InitSSRClientArgs): Promise<InitialState> => {
	const marketConfig = await marketplaceConfig(args.config, args.queryClient);
	const wagmiConfig = createWagmiConfig(marketConfig, args.config, true);
	return { wagmi: cookieToInitialState(wagmiConfig, args.cookie) };
};

export const createSSRClient = (args: InitSSRClientArgs) => {
	const getMarketplaceConfig = async () =>
		marketplaceConfig(args.config, args.queryClient);
	const getInitialState = async () => initialState(args);
	const config = args.config;
	return { getInitialState, getMarketplaceConfig, config };
};
