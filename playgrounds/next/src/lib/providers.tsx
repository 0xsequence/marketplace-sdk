'use client';

import type { SdkConfig } from '@0xsequence/marketplace-sdk';
import {
	getQueryClient,
	marketplaceConfigOptions,
} from '@0xsequence/marketplace-sdk/react';
import { useQuery } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { MarketplaceProviders, useMarketplace } from 'shared-components';
import type { State } from 'wagmi';
import { AppLink } from '../components/ui/app-link';

const queryClient = getQueryClient();

export default function Providers({
	sdkInitialState,
	sdkConfig,
	children,
}: {
	sdkInitialState?: { wagmi?: State };
	sdkConfig: SdkConfig;
	children: React.ReactNode;
}) {
	const { checkoutModeOverride } = useMarketplace();
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
			initialState={sdkInitialState}
			LinkComponent={AppLink}
			NuqsAdapter={NuqsAdapter}
		>
			{children}
		</MarketplaceProviders>
	);
}
