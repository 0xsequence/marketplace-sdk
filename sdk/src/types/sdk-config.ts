import type { MarketplaceConfig } from '../react/queries/marketplaceConfig';
export type Env = 'development' | 'next' | 'production';

export type SdkConfig = {
	projectAccessKey: string;
	projectId: string;
	walletConnectProjectId?: string;
	_internal?: {
		prefetchedMarketplaceConfig?: MarketplaceConfig;
		devAccessKey?: string;
		nextAccessKey?: string;
		builderEnv?: Env;
		marketplaceEnv?: Env;
		nodeGatewayEnv?: Env;
		metadataEnv?: Env;
		indexerEnv?: Env;
		sequenceWalletEnv?: Env;
	};
};
