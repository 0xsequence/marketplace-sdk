import type { MarketplaceSettings } from '../react/_internal/api/builder.gen';

export type Env = 'development' | 'next' | 'production';

export type SdkConfig = {
	projectAccessKey: string;
	projectId: string;
	walletConnectProjectId?: string;
	_internal?: {
		prefetchedMarketplaceSettings?: MarketplaceSettings;
		devAccessKey?: string;
		nextAccessKey?: string;
		builderEnv?: Env;
		marketplaceEnv?: Env;
		nodeGatewayEnv?: Env;
		metadataEnv?: Env;
		indexerEnv?: Env;
		sequenceApiEnv?: Env;
		sequenceWalletEnv?: Env;
	};
};
