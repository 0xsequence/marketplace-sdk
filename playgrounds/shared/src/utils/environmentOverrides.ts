import type { ConnectConfig } from '@0xsequence/connect';
import type { SdkConfig } from '@0xsequence/marketplace-sdk';

interface EnvironmentUrls {
	production: {
		metadata: string;
		indexer: string;
		api: string;
		builder: string;
		marketplaceApi: string;
	};
	development: {
		metadata: string;
		indexer: string;
		api: string;
		builder: string;
		marketplaceApi: string;
	};
}

const ENVIRONMENT_URLS: EnvironmentUrls = {
	production: {
		metadata: 'https://metadata.sequence.app',
		indexer: 'https://indexer.sequence.app',
		api: 'https://api.sequence.app',
		builder: 'https://api.sequence.build',
		marketplaceApi: 'https://marketplace-api.sequence.app',
	},
	development: {
		metadata: 'https://dev-metadata.sequence.app',
		indexer: 'https://dev-indexer.sequence.app',
		api: 'https://dev-api.sequence.app',
		builder: 'https://dev-api.sequence.build',
		marketplaceApi: 'https://dev-marketplace-api.sequence.app',
	},
};

export function createProcessedSdkConfig(
	config: SdkConfig,
	defaultEnv: 'production' | 'development',
): SdkConfig {
	return {
		...config,
		_internal: {
			overrides: {
				...config._internal?.overrides,
				api: {
					...config._internal?.overrides?.api,
					builder: config._internal?.overrides?.api?.builder || {
						env: defaultEnv,
					},
					marketplace: config._internal?.overrides?.api?.marketplace || {
						env: defaultEnv,
					},
					metadata: config._internal?.overrides?.api?.metadata || {
						env: defaultEnv,
					},
					indexer: config._internal?.overrides?.api?.indexer || {
						env: defaultEnv,
					},
					sequenceApi: config._internal?.overrides?.api?.sequenceApi || {
						env: defaultEnv,
					},
					sequenceWallet: config._internal?.overrides?.api?.sequenceWallet || {
						env: defaultEnv,
					},
					nodeGateway: config._internal?.overrides?.api?.nodeGateway || {
						env: defaultEnv,
					},
				},
			},
		},
	};
}

export function createConnectConfig(
	config: SdkConfig,
	projectName: string,
	defaultEnv: 'production' | 'development',
): ConnectConfig {
	const urls = ENVIRONMENT_URLS[defaultEnv];

	return {
		projectAccessKey: config.projectAccessKey,
		signIn: {
			projectName,
			descriptiveSocials: true,
		},
		env: {
			metadataUrl:
				config._internal?.overrides?.api?.metadata?.url || urls.metadata,
			indexerGatewayUrl:
				config._internal?.overrides?.api?.indexer?.url || urls.indexer,
			apiUrl: config._internal?.overrides?.api?.sequenceApi?.url || urls.api,
			builderUrl:
				config._internal?.overrides?.api?.builder?.url || urls.builder,
			indexerUrl:
				config._internal?.overrides?.api?.indexer?.url || urls.indexer,
		},
	};
}
