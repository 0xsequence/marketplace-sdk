'use client';

import type { SdkConfig } from '@0xsequence/marketplace-sdk';
import {
	getQueryClient,
	marketplaceConfigOptions,
} from '@0xsequence/marketplace-sdk/react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { MarketplaceProviders } from 'shared-components';
import { AppLink } from '../components/ui/AppLink';
import { useQuery } from '@tanstack/react-query';
import type { State } from 'wagmi';

export default function Providers({
	sdkInitialState,
	sdkConfig,
	children,
}: {
	sdkInitialState?: { wagmi?: State };
	sdkConfig: SdkConfig;
	children: React.ReactNode;
}) {
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
			initialState={sdkInitialState}
			LinkComponent={AppLink}
			NuqsAdapter={NuqsAdapter}
		>
			{children}
		</MarketplaceProviders>
	);
};
