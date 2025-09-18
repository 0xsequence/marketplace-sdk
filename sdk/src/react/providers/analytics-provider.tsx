'use client';

import type { Auth } from '@databeat/tracker';
import { useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import type { SdkConfig } from '../../types';
import { DatabeatAnalytics } from '../_internal/databeat';

interface AnalyticsProviderProps {
	config: SdkConfig;
	children: (analytics: DatabeatAnalytics) => React.ReactNode;
}

export function AnalyticsProvider({
	config,
	children,
}: AnalyticsProviderProps) {
	const { address, isConnected } = useAccount();
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

	useEffect(() => {
		if (!isConnected || !address) {
			analytics?.reset();
			return;
		}
		analytics?.identify(address.toLowerCase());
	}, [analytics, address, isConnected]);

	return <>{children(analytics)}</>;
}
