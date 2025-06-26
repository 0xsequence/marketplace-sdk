import type { SdkConfig } from '../../../sdk/src';

export function getOverrides(sdkConfig: SdkConfig) {
	return {
		...sdkConfig._internal?.overrides,
		api: {
			...sdkConfig._internal?.overrides?.api,
			builder: sdkConfig._internal?.overrides?.api?.builder || {
				env: 'production',
			},
			marketplace: {
				...sdkConfig._internal?.overrides?.api?.marketplace,
			},
			metadata: sdkConfig._internal?.overrides?.api?.metadata || {
				env: 'production',
			},
			indexer: sdkConfig._internal?.overrides?.api?.indexer || {
				env: 'production',
			},
			sequenceApi: sdkConfig._internal?.overrides?.api?.sequenceApi || {
				env: 'production',
			},
			sequenceWallet: sdkConfig._internal?.overrides?.api?.sequenceWallet || {
				env: 'production',
			},
			nodeGateway: sdkConfig._internal?.overrides?.api?.nodeGateway || {
				env: 'production',
			},
		},
	};
}
