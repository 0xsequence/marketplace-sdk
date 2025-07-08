import type { LookupMarketplaceReturn } from '../react/_internal/api/builder.gen';
import type { DatabeatAnalytics } from '../react/_internal/databeat';
import type { MarketplaceConfig } from './types';

export type Env = 'development' | 'production' | 'next';

export type ApiConfig = {
	env?: Env;
	url?: string;
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

export type MarketplaceSdkContext = {
	openConnectModal: () => void;
	analytics: DatabeatAnalytics;
} & SdkConfig;
