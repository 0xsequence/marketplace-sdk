import type { LookupMarketplaceReturn } from '../react/_internal/api/builder.gen';
import type { MarketplaceConfig } from './types';

export type Env = 'development' | 'production' | 'next';

export type ApiConfig = {
	env: Env;
	accessKey?: string;
};

export type SdkConfig = {
	projectAccessKey: string;
	projectId: string;
	walletConnectProjectId?: string;
	_internal?: {
		prefetchedMarketplaceSettings?: LookupMarketplaceReturn;
		overrides?: {
			marketplaceConfig?: Partial<MarketplaceConfig>;

			api?: {
				builder?: ApiConfig;
				marketplace?: ApiConfig;
				nodeGateway?: ApiConfig;
				metadata?: ApiConfig;
				indexer?: ApiConfig;
				sequenceApi?: ApiConfig;
				sequenceWallet?: ApiConfig;
			};
		};
	};
};
