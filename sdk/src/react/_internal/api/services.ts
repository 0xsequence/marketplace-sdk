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
	const env = config._internal?.overrides?.api?.builder?.env || 'production';
	const projectAccessKey =
		config._internal?.overrides?.api?.builder?.accessKey ||
		config.projectAccessKey;
	return new BuilderAPI(builderRpcApiURL(env), projectAccessKey);
};

export const getMetadataClient = (config: SdkConfig) => {
	const env = config._internal?.overrides?.api?.metadata?.env || 'production';
	const projectAccessKey =
		config._internal?.overrides?.api?.metadata?.accessKey ||
		config.projectAccessKey;
	return new SequenceMetadata(metadataURL(env), projectAccessKey);
};

export const getIndexerClient = (chain: ChainNameOrId, config: SdkConfig) => {
	const env = config._internal?.overrides?.api?.indexer?.env || 'production';
	const projectAccessKey =
		config._internal?.overrides?.api?.indexer?.accessKey ||
		config.projectAccessKey;
	return new SequenceIndexer(indexerURL(chain, env), projectAccessKey);
};

export const getMarketplaceClient = (config: SdkConfig) => {
	const env =
		config._internal?.overrides?.api?.marketplace?.env || 'production';
	const projectAccessKey =
		config._internal?.overrides?.api?.marketplace?.accessKey ||
		config.projectAccessKey;
	return new SequenceMarketplace(marketplaceApiURL(env), projectAccessKey);
};

export const getSequenceApiClient = (config: SdkConfig) => {
	const env =
		config._internal?.overrides?.api?.sequenceApi?.env || 'production';
	const projectAccessKey =
		config._internal?.overrides?.api?.sequenceApi?.accessKey ||
		config.projectAccessKey;
	return new SequenceAPIClient(sequenceApiUrl(env), projectAccessKey);
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
