'use client';

import type { MarketplaceConfig, SdkConfig } from '@0xsequence/marketplace-sdk';
import {
	getQueryClient,
	MarketplaceProvider,
	marketplaceConfigOptions,
} from '@0xsequence/marketplace-sdk/react';
import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { type ReactNode, useState, useCallback, useMemo } from 'react';
import { WagmiProvider } from 'wagmi';

import { createSdkConfig } from '../config/sdk';
import { createHeadlessWagmiConfig } from '../config/wagmi';
import { ConnectDialog } from '../components/ConnectDialog';
import { ModalContainer } from '../components/modals/ModalContainer';

interface ProvidersProps {
	children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
	const sdkConfig = useMemo(() => createSdkConfig(), []);
	const queryClient = useMemo(() => getQueryClient(), []);

	return (
		<QueryClientProvider client={queryClient}>
			<ConfigLoader sdkConfig={sdkConfig}>{children}</ConfigLoader>
		</QueryClientProvider>
	);
}

function ConfigLoader({
	children,
	sdkConfig,
}: {
	children: ReactNode;
	sdkConfig: SdkConfig;
}) {
	const queryClient = useMemo(() => getQueryClient(), []);

	const {
		data: marketplaceConfig,
		isLoading,
		error,
	} = useQuery(marketplaceConfigOptions(sdkConfig), queryClient);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg text-gray-400">Loading configuration...</div>
			</div>
		);
	}

	if (error || !marketplaceConfig) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg text-red-500">
					Failed to load marketplace configuration
					{error && (
						<pre className="mt-2 text-sm text-gray-400">
							{error instanceof Error ? error.message : String(error)}
						</pre>
					)}
				</div>
			</div>
		);
	}

	return (
		<InnerProviders marketplaceConfig={marketplaceConfig} sdkConfig={sdkConfig}>
			{children}
		</InnerProviders>
	);
}

function InnerProviders({
	children,
	marketplaceConfig,
	sdkConfig,
}: {
	children: ReactNode;
	marketplaceConfig: MarketplaceConfig;
	sdkConfig: SdkConfig;
}) {
	const [wagmiConfig] = useState(() =>
		createHeadlessWagmiConfig(marketplaceConfig, sdkConfig),
	);

	const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);

	const openConnectModal = useCallback(() => {
		setIsConnectDialogOpen(true);
	}, []);

	const closeConnectDialog = useCallback(() => {
		setIsConnectDialogOpen(false);
	}, []);

	return (
		<WagmiProvider config={wagmiConfig}>
			<MarketplaceProvider
				config={sdkConfig}
				openConnectModal={openConnectModal}
			>
				{children}
				<ModalContainer />
				<ConnectDialog
					isOpen={isConnectDialogOpen}
					onClose={closeConnectDialog}
				/>
				<ReactQueryDevtools initialIsOpen={false} />
			</MarketplaceProvider>
		</WagmiProvider>
	);
}
