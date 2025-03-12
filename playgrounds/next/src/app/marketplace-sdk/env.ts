import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	server: {
		NODE_ENV: z.enum(['development', 'test', 'production']),
		BUILDER_API_KEY_DEV: z.string(),
		BUILDER_API_KEY_PROD: z.string(),
	},

	client: {
		NEXT_PUBLIC_SEQUENCE_PROJECT_ID: z.string(),
		NEXT_PUBLIC_ENV: z.string().optional(), // z.enum(['development', 'next', 'production']).optional(),
		NEXT_PUBLIC_WALLETCONNECT_ID: z.string().optional(),
		NEXT_PUBLIC_SEQUENCE_ACCESS_KEY: z.string(),
		NEXT_PUBLIC_SEQUENCE_DEV_ACCESS_KEY: z.string(),
	},

	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		BUILDER_API_KEY_DEV: process.env.BUILDER_API_KEY_DEV,
		BUILDER_API_KEY_PROD: process.env.BUILDER_API_KEY_PROD,
		NEXT_PUBLIC_SEQUENCE_PROJECT_ID:
			process.env.NEXT_PUBLIC_SEQUENCE_PROJECT_ID,
		NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
		NEXT_PUBLIC_WALLETCONNECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_ID,
		NEXT_PUBLIC_SEQUENCE_ACCESS_KEY:
			process.env.NEXT_PUBLIC_SEQUENCE_ACCESS_KEY,
		NEXT_PUBLIC_SEQUENCE_DEV_ACCESS_KEY:
			process.env.NEXT_PUBLIC_SEQUENCE_DEV_ACCESS_KEY,
	},
	emptyStringAsUndefined: true,
});
