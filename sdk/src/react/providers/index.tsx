'use client';

import { useOpenConnectModal } from '@0xsequence/connect';
import { QueryClientProvider } from '@tanstack/react-query';
import { createContext } from 'react';
import type {
	MarketplaceSdkContext as MarketplaceSdkContextType,
	SdkConfig,
} from '../../types';
import { InvalidProjectAccessKeyError } from '../../utils/_internal/error/config';
import { getQueryClient } from '../_internal/api/get-query-client';
import type { DatabeatAnalytics } from '../_internal/databeat';
import { PROVIDER_ID } from '../_internal/get-provider';
import { AnalyticsProvider } from './analytics-provider';
import { ThemeProvider } from './theme-provider';

export const MarketplaceSdkContext = createContext<
	MarketplaceSdkContextType | undefined
>(undefined);

export type MarketplaceSdkProviderProps = {
	config: SdkConfig;
	children: React.ReactNode;
	openConnectModal?: () => void;
};

export function MarketplaceProvider({
	config,
	children,
	openConnectModal,
}: MarketplaceSdkProviderProps) {
	if (config.projectAccessKey === '' || !config.projectAccessKey) {
		throw new InvalidProjectAccessKeyError(config.projectAccessKey);
	}

	return (
		<AnalyticsProvider config={config}>
			{(analytics) => {
				if (openConnectModal) {
					const context: MarketplaceSdkContextType = {
						...config,
						openConnectModal,
						analytics,
					};

					return (
						<MarketplaceSdkContext.Provider value={context}>
							<ThemeProvider>
								<div id={PROVIDER_ID}>{children}</div>
							</ThemeProvider>
						</MarketplaceSdkContext.Provider>
					);
				}

				return (
					<MarketplaceProviderWithSequenceConnect
						config={config}
						analytics={analytics}
					>
						<ThemeProvider>{children}</ThemeProvider>
					</MarketplaceProviderWithSequenceConnect>
				);
			}}
		</AnalyticsProvider>
	);
}

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

function MarketplaceProviderWithSequenceConnect({
	config,
	children,
	analytics,
}: MarketplaceSdkProviderProps & { analytics: DatabeatAnalytics }) {
	const { setOpenConnectModal } = useOpenConnectModal();

	const context: MarketplaceSdkContextType = {
		...config,
		openConnectModal: () => setOpenConnectModal(true),
		analytics,
	};

	return (
		<MarketplaceSdkContext.Provider value={context}>
			<div id={PROVIDER_ID}>{children}</div>
		</MarketplaceSdkContext.Provider>
	);
}
