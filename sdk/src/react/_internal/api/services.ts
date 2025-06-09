import { SequenceAPIClient } from '@0xsequence/api';
import { SequenceIndexer } from '@0xsequence/indexer';
import { SequenceMetadata } from '@0xsequence/metadata';
import { networks, stringTemplate } from '@0xsequence/network';
import type { ApiConfig, Env, SdkConfig } from '../../../types/sdk-config';
import { MissingConfigError } from '../../../utils/_internal/error/transaction';
import { BuilderAPI } from './builder-api';
import { SequenceMarketplace } from './marketplace-api';

const SERVICES = {
	sequenceApi: 'https://${prefix}api.sequence.app',
	metadata: 'https://${prefix}metadata.sequence.app',
	indexer: 'https://${prefix}${network}-indexer.sequence.app',
	marketplaceApi: 'https://${prefix}marketplace-api.sequence.app',
	builderRpcApi: 'https://${prefix}api.sequence.build',
};

type ChainNameOrId = string | number;

const getNetwork = (nameOrId: ChainNameOrId) => {
	for (const network of Object.values(networks)) {
		if (
			network.name === String(nameOrId).toLowerCase() ||
			network.chainId === Number(nameOrId)
		) {
			return network;
		}
	}
	throw new MissingConfigError(`Network configuration for chain ${nameOrId}`);
};

const metadataURL = (env: Env = 'production') => {
	const prefix = getPrefix(env);
	return stringTemplate(SERVICES.metadata, { prefix });
};

const indexerURL = (chain: ChainNameOrId, env: Env = 'production') => {
	const prefix = getPrefix(env);
	const network = getNetwork(chain).name;
	return stringTemplate(SERVICES.indexer, { network: network, prefix });
};

const marketplaceApiURL = (env: Env = 'production') => {
	// TODO: remove this once we have a production endpoint
	if (env === 'development') {
		return 'https://dev-marketplace-api-v2.sequence-dev.app';
	}
	const prefix = getPrefix(env);
	return stringTemplate(SERVICES.marketplaceApi, { prefix });
};

const builderRpcApiURL = (env: Env = 'production') => {
	const prefix = getPrefix(env);
	return stringTemplate(SERVICES.builderRpcApi, { prefix });
};

export const sequenceApiUrl = (env: Env = 'production') => {
	const prefix = getPrefix(env);
	return stringTemplate(SERVICES.sequenceApi, { prefix });
};

export const getBuilderClient = (config: SdkConfig) => {
	const overrides = config._internal?.overrides?.api?.builder;
	const url =
		overrides?.url || builderRpcApiURL(overrides?.env || 'production');
	const projectAccessKey = overrides?.accessKey || config.projectAccessKey;
	return new BuilderAPI(url, projectAccessKey);
};

export const getMetadataClient = (config: SdkConfig) => {
	const overrides = config._internal?.overrides?.api?.metadata;
	const url = overrides?.url || metadataURL(overrides?.env || 'production');
	const projectAccessKey = overrides?.accessKey || config.projectAccessKey;
	return new SequenceMetadata(url, projectAccessKey);
};

export const getIndexerClient = (chain: ChainNameOrId, config: SdkConfig) => {
	const overrides = config._internal?.overrides?.api?.indexer;
	const url =
		overrides?.url || indexerURL(chain, overrides?.env || 'production');
	const projectAccessKey = overrides?.accessKey || config.projectAccessKey;
	return new SequenceIndexer(url, projectAccessKey);
};

export const getMarketplaceClient = (config: SdkConfig) => {
	const overrides = config._internal?.overrides?.api?.marketplace;
	const url =
		overrides?.url || marketplaceApiURL(overrides?.env || 'production');
	const projectAccessKey = overrides?.accessKey || config.projectAccessKey;
	return new SequenceMarketplace(url, projectAccessKey);
};

export const getSequenceApiClient = (config: SdkConfig) => {
	const overrides = config._internal?.overrides?.api?.sequenceApi;
	const url = overrides?.url || sequenceApiUrl(overrides?.env || 'production');
	const projectAccessKey = overrides?.accessKey || config.projectAccessKey;
	return new SequenceAPIClient(url, projectAccessKey);
};

const getPrefix = (env: ApiConfig['env']) => {
	switch (env) {
		case 'development':
			return 'dev-';
		case 'production':
			return '';
		case 'next':
			return 'next-';
	}
};
