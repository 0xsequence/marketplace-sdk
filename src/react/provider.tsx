'use client';

import { createContext } from 'react';
import '@0xsequence/design-system/styles.css';
import type { SdkConfig } from '@types';
import { PROVIDER_ID } from './_internal/get-provider';

export const MarketplaceSdkContext = createContext({} as SdkConfig);

export type MarketplaceSdkProviderProps = {
	config: SdkConfig;
	children: React.ReactNode;
};

export function MarketplaceProvider({
	config,
	children,
}: MarketplaceSdkProviderProps) {
	return (
		<MarketplaceSdkContext.Provider value={config}>
			<div id={PROVIDER_ID}>{children}</div>
		</MarketplaceSdkContext.Provider>
	);
}
