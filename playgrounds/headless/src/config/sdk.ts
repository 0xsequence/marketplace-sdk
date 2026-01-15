import type { SdkConfig } from '@0xsequence/marketplace-sdk';

export const DEFAULT_PROJECT_ID = '34598';
export const DEFAULT_PROJECT_ACCESS_KEY = 'AQAAAAAAAIcmbL1VY2opsM234KeDmS5PxeM';

export function createSdkConfig(overrides?: Partial<SdkConfig>): SdkConfig {
	return {
		projectId: DEFAULT_PROJECT_ID,
		projectAccessKey: DEFAULT_PROJECT_ACCESS_KEY,
		...overrides,
	};
}
