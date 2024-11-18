import { type State, cookieToInitialState } from 'wagmi';
import type { SdkConfig } from '../../types/sdk-config';
import { getQueryClient } from '../_internal/api/get-query-client';
import { createWagmiConfig } from '../_internal/wagmi/create-config';
import { marketplaceConfigOptions } from '../hooks/options/marketplaceConfigOptions';

type InitSSRClientArgs = {
	cookie: string;
	config: SdkConfig;
};

type InitialState = { wagmi?: State };

const marketplaceConfig = async (config: SdkConfig) => {
	const queryClient = getQueryClient();
	const configOptions = marketplaceConfigOptions(config);
	return queryClient.fetchQuery(configOptions);
};

const initialState = async (args: InitSSRClientArgs): Promise<InitialState> => {
	const marketConfig = await marketplaceConfig(args.config);
	const wagmiConfig = createWagmiConfig(marketConfig, args.config, true);
	return { wagmi: cookieToInitialState(wagmiConfig, args.cookie) };
};

export const createSSRClient = (args: InitSSRClientArgs) => {
	const getMarketplaceConfig = async () => marketplaceConfig(args.config);
	const getInitialState = async () => initialState(args);
	const config = args.config;
	return { getInitialState, getMarketplaceConfig, config };
};
