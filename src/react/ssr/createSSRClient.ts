import { SdkConfig } from '../../types/sdk-config';
import { getQueryClient } from '../_internal/api/getQueryClient';
import { createWagmiConfig } from '../_internal/wagmi/createConfig';
import { marketplaceConfigOptions } from '../hooks/useMarketplaceConfig';
import { cookieToInitialState, type State } from 'wagmi';

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
