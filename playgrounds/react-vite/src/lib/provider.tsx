'use client';

import {
	getQueryClient,
	marketplaceConfigOptions,
} from '@0xsequence/marketplace-sdk/react';
import { useQuery } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { MarketplaceProviders, useMarketplace } from 'shared-components';
import type { State } from 'wagmi';
import { AppLink } from '../components/ui/AppLink';

interface ProvidersProps {
	children: React.ReactNode;
	initialState?: {
		wagmi?: State;
	};
}

export default function Providers({ children, initialState }: ProvidersProps) {
	const { sdkConfig, checkoutModeOverride } = useMarketplace();
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
			checkoutModeOverride={checkoutModeOverride}
			initialState={initialState}
			LinkComponent={AppLink}
			NuqsAdapter={NuqsAdapter}
		>
			{children}
		</MarketplaceProviders>
	);
}
