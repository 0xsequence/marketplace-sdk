'use client';

import { useOpenConnectModal } from '@0xsequence/connect';
import type { Auth } from '@databeat/tracker';
import { QueryClientProvider } from '@tanstack/react-query';
import { createContext, useMemo } from 'react';
import type {
	MarketplaceSdkContext as MarketplaceSdkContextType,
	SdkConfig,
} from '../../types';
import { InvalidProjectAccessKeyError } from '../../utils/_internal/error/config';
import { getQueryClient } from '../_internal/api/get-query-client';
import { DatabeatAnalytics } from '../_internal/databeat';
import { PROVIDER_ID } from '../_internal/get-provider';
import { ThemeProvider } from './theme-provider';

export const MarketplaceSdkContext = createContext(
	{} as MarketplaceSdkContextType,
);

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

	const isWindowDefined = typeof window !== 'undefined';

	const analytics = useMemo(() => {
		const server = 'https://nodes.sequence.app';
		const auth: Auth = {};
		auth.headers = { 'X-Access-Key': config.projectAccessKey };

		return new DatabeatAnalytics(server, auth, {
			defaultEnabled: true,
			initProps: () => {
				return {
					origin: isWindowDefined ? window.location.origin : '',
				};
			},
		});
	}, [config.projectAccessKey, isWindowDefined]);

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
