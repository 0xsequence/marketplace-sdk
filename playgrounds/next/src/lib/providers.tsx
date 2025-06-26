'use client';

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { MarketplaceProvidersWithConfig } from 'shared-components';
import type { State } from 'wagmi';
import { AppLink } from '../components/ui/app-link';

export default function Providers({
	sdkInitialState,
	children,
}: {
	sdkInitialState?: { wagmi?: State };
	children: React.ReactNode;
}) {
	return (
		<MarketplaceProvidersWithConfig
			initialState={sdkInitialState}
			LinkComponent={AppLink}
			NuqsAdapter={NuqsAdapter}
		>
			{children}
		</MarketplaceProvidersWithConfig>
	);
}
