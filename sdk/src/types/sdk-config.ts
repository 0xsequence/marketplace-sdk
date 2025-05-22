import type { LookupMarketplaceReturn } from '../react/_internal/api/builder.gen';
import type { ContractType } from './api-types';

export type Env = 'development' | 'next' | 'production';

export type ShopConfig = {
	title: string;
	bannerUrl: string;
	ogImage?: string;
	collections: {
		address: string;
		contractType: ContractType;
		bannerUrl: string;
		chainId: number;
		primarySalesContractAddress: string;
		tokenIds: string[];
	}[];
};

export type SdkConfig = {
	projectAccessKey: string;
	projectId: string;
	walletConnectProjectId?: string;
	tmpShopConfig?: ShopConfig;
	_internal?: {
		prefetchedMarketplaceSettings?: LookupMarketplaceReturn;
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
