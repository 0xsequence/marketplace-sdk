'use client';

import { useOpenConnectModal } from '@0xsequence/connect';
import { QueryClientProvider } from '@tanstack/react-query';
import { createContext } from 'react';
import type {
	MarketplaceSdkContext as MarketplaceSdkContextType,
	SdkConfig,
} from '../types';
import { InvalidProjectAccessKeyError } from '../utils/_internal/error/config';
import { getQueryClient } from './_internal/api/get-query-client';
import { PROVIDER_ID } from './_internal/get-provider';

export const MarketplaceSdkContext = createContext(
	{} as MarketplaceSdkContextType,
);

export type MarketplaceSdkProviderProps = {
	config: SdkConfig;
	children: React.ReactNode;
	openConnectModal?: () => void;
};

export function MarketplaceQueryClientProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const queryClient = getQueryClient();
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

export function MarketplaceProvider({
	config,
	children,
	openConnectModal,
}: MarketplaceSdkProviderProps) {
	if (config.projectAccessKey === '' || !config.projectAccessKey) {
		throw new InvalidProjectAccessKeyError(config.projectAccessKey);
	}

	const { setOpenConnectModal } = useOpenConnectModal();

	const context: MarketplaceSdkContextType = {
		...config,
		setOpenConnectModal: openConnectModal ?? (() => setOpenConnectModal(true)),
	};

	return (
		<MarketplaceQueryClientProvider>
			<MarketplaceSdkContext.Provider value={context}>
				<div id={PROVIDER_ID}>{children}</div>
			</MarketplaceSdkContext.Provider>
		</MarketplaceQueryClientProvider>
	);
}
