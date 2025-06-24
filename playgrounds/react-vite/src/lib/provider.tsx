'use client';

import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { MarketplaceProvidersWithConfig } from 'shared-components';
import type { State } from 'wagmi';
import { AppLink } from '../components/ui/AppLink';

interface ProvidersProps {
	children: React.ReactNode;
	initialState?: {
		wagmi?: State;
	};
}

export default function Providers({ children, initialState }: ProvidersProps) {
	return (
		<MarketplaceProvidersWithConfig
			initialState={initialState}
			LinkComponent={AppLink}
			NuqsAdapter={NuqsAdapter}
		>
			{children}
		</MarketplaceProvidersWithConfig>
	);
}
