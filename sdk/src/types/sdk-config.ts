import type { LookupMarketplaceReturn } from '../react/_internal/api/builder.gen';
import type { ContractType } from './api-types';
import type { MarketplaceConfig } from './types';

export type Env = 'development' | 'production' | 'next';

export type ApiConfig = {
	env: Env;
	accessKey?: string;
};

export type CollectionOverride = {
	// Required identifier fields
	chainId: number;
	contractAddress: string;

	// Display metadata overrides
	name?: string;
	symbol?: string;
	description?: string;
	bannerUrl?: string;
	ogImage?: string;

	// Marketplace functionality overrides
	contractType?: ContractType;
	feePercentage?: number;
	currencyOptions?: string[];

	// Shop functionality overrides
	saleAddress?: string;
};

export type SdkConfig = {
	projectAccessKey: string;
	projectId: string;
	walletConnectProjectId?: string;
	_internal?: {
		prefetchedMarketplaceSettings?: LookupMarketplaceReturn;
		overrides?: {
			marketplaceConfig?: Partial<MarketplaceConfig>;
			collection?: CollectionOverride;
			api: {
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
