import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { ConfigProvider } from '../../context/ConfigContext';
import type { SdkConfig } from '../../../types';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			gcTime: 0,
		},
	},
});

const defaultConfig = {
	projectAccessKey: '1',
	baseUrl: 'http://localhost:3000',
	projectId: '1',
} as SdkConfig;

export const TestWrapper = ({ children }: PropsWithChildren) => {
	return (
		<QueryClientProvider client={queryClient}>
			<ConfigProvider value={defaultConfig}>{children}</ConfigProvider>
		</QueryClientProvider>
	);
};
