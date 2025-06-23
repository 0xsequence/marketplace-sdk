'use server';

import { createSSRClient } from '@0xsequence/marketplace-sdk/react/ssr';
import { headers } from 'next/headers';
import {
	DEFAULT_PROJECT_ACCESS_KEY,
	DEFAULT_PROJECT_ID,
} from 'shared-components/src/consts';

export const ssrClient = async () => {
	const headersList = await headers();
	const cookie = headersList.get('cookie') || '';
	return createSSRClient({
		config: {
			projectAccessKey: DEFAULT_PROJECT_ACCESS_KEY,
			projectId: DEFAULT_PROJECT_ID,
		},
		cookie,
	});
};
