'use client';

import {
	getQueryClient,
	marketplaceConfigOptions,
} from '@0xsequence/marketplace-sdk/react';
import { useQuery } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { useMarketplace, MarketplaceProviders } from 'shared-components';
import { AppLink } from '../components/ui/AppLink';
import type { State } from 'wagmi';

interface ProvidersProps {
	children: React.ReactNode;
	initialState?: {
		wagmi?: State;
	};
}

export default function Providers({ children, initialState }: ProvidersProps) {
	const { sdkConfig } = useMarketplace();
	const queryClient = getQueryClient();
	const { data: marketplaceConfig, isLoading } = useQuery(
		marketplaceConfigOptions(sdkConfig),
		queryClient,
	);

	if (isLoading) {
		return <div>Loading configuration...</div>;
	}

	if (!marketplaceConfig) {
		return <div>Failed to load marketplace configuration</div>;
	}

	if (!sdkConfig.projectAccessKey || sdkConfig.projectAccessKey === '') {
		return <div>Please set a valid project access key</div>;
	}

	return (
		<MarketplaceProviders
			config={sdkConfig}
			marketplaceConfig={marketplaceConfig}
			initialState={initialState}
			LinkComponent={AppLink}
			NuqsAdapter={NuqsAdapter}
		>
			{children}
		</MarketplaceProviders>
	);
};
