'use server';

import { createSSRClient } from '@0xsequence/marketplace-sdk/react/ssr';
import { QueryClient } from '@tanstack/react-query';
import { headers } from 'next/headers';
import {
	DEFAULT_PROJECT_ACCESS_KEY,
	DEFAULT_PROJECT_ID,
	WAAS_CONFIG_KEY,
} from 'shared-components';

export const ssrClient = async () => {
	const headersList = await headers();
	const cookie = headersList.get('cookie') || '';
	return createSSRClient({
		config: {
			projectAccessKey: DEFAULT_PROJECT_ACCESS_KEY,
			projectId: DEFAULT_PROJECT_ID,
			wallet: {
				embedded: {
					waasConfigKey: WAAS_CONFIG_KEY,
				},
			},
		},
		queryClient: new QueryClient(),
		cookie,
	});
};
