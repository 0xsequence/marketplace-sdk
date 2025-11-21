import type { LookupMarketplaceReturn } from '@0xsequence/api-client';
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
	shadowDom?: boolean;
	experimentalShadowDomCssOverride?: string;
	waasFeeOptionSelectionType?: 'automatic' | 'manual';
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
