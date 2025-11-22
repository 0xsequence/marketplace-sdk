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
	shadowDom?: boolean;
	experimentalShadowDomCssOverride?: string;
	/**
	 * Controls how WaaS transaction fee options are selected:
	 * - 'automatic': Automatically selects first option with sufficient balance and confirms immediately (headless mode)
	 * - 'manual': Shows UI for user to review and manually confirm fee option selection (default)
	 * @default 'manual'
	 */
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
