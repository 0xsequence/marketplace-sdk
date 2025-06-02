import { SequenceAPIClient } from '@0xsequence/api';
import { SequenceIndexer } from '@0xsequence/indexer';
import { SequenceMetadata } from '@0xsequence/metadata';
import { networks, stringTemplate } from '@0xsequence/network';
import type { Env, SdkConfig } from '../../../types/sdk-config';
import { MissingConfigError } from '../../../utils/_internal/error/transaction';
import { SequenceMarketplace } from './marketplace-api';

const SERVICES = {
	sequenceApi: 'https://${prefix}api.sequence.app',
	metadata: 'https://${prefix}metadata.sequence.app',
	indexer: 'https://${prefix}${network}-indexer.sequence.app',
	marketplaceApi: 'https://${prefix}marketplace-api.sequence.app',
	builderRpcApi: 'https://${prefix}api.sequence.build',
	//Used for fetching css and manifest
	builderMarketplaceApi:
		'https://${prefix}api.sequence.build/marketplace/${projectId}',
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

export const builderRpcApi = (env: Env = 'production') => {
	const prefix = getPrefix(env);
	return stringTemplate(SERVICES.builderRpcApi, { prefix });
};

export const sequenceApiUrl = (env: Env = 'production') => {
	const prefix = getPrefix(env);
	return stringTemplate(SERVICES.sequenceApi, { prefix });
};

export const builderMarketplaceApi = (
	projectId: string,
	env: Env = 'production',
) => {
	const prefix = getPrefix(env);
	return stringTemplate(SERVICES.builderMarketplaceApi, {
		projectId,
		prefix,
	});
};
export const getMetadataClient = (config: SdkConfig) => {
	const env = config._internal?.metadataEnv || 'production';
	const projectAccessKey = getAccessKey({ env, config });
	return new SequenceMetadata(metadataURL(env), projectAccessKey);
};
export const getIndexerClient = (chain: ChainNameOrId, config: SdkConfig) => {
	const env = config._internal?.indexerEnv || 'production';
	const projectAccessKey = getAccessKey({ env, config });
	return new SequenceIndexer(indexerURL(chain, env), projectAccessKey);
};
export const getMarketplaceClient = (config: SdkConfig) => {
	const env = config._internal?.marketplaceEnv || 'production';
	const projectAccessKey = getAccessKey({ env, config });
	return new SequenceMarketplace(marketplaceApiURL(env), projectAccessKey);
};
export const getSequenceApiClient = (config: SdkConfig) => {
	const env = config._internal?.sequenceApiEnv || 'production';
	const projectAccessKey = getAccessKey({ env, config });
	return new SequenceAPIClient(sequenceApiUrl(env), projectAccessKey);
};
const getAccessKey = ({ env, config }: { env: Env; config: SdkConfig }) => {
	switch (env) {
		case 'development':
			if (!config._internal?.devAccessKey)
				throw new MissingConfigError('devAccessKey for development env');
			return config._internal?.devAccessKey;
		case 'production':
			return config.projectAccessKey;
		case 'next':
			if (!config._internal?.nextAccessKey)
				throw new MissingConfigError('nextAccessKey for next env');
			return config._internal?.nextAccessKey;
	}
};

const getPrefix = (env: Env) => {
	switch (env) {
		case 'development':
			return 'dev-';
		case 'production':
			return '';
		case 'next':
			return 'next-';
	}
};
