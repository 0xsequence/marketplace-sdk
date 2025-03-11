import { Navigation } from '@/components/Navigation';
import { Settings } from '@/components/Settings';
import Providers from '@/lib/providers';
import type { Metadata } from 'next';
import { ssrClient } from './marketplace-sdk/ssr';
import './globals.css';

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { getInitialState, config } = await ssrClient();
	const initialState = await getInitialState();
	const { getMarketplaceConfig } = await ssrClient();
	const marketplaceConfig = await getMarketplaceConfig();
	const { fontUrl, faviconUrl } = marketplaceConfig;

	return (
		<html lang="en" className="dark">
			<head>
				<meta name="mobile-web-app-capable" content="yes" />
				<link rel="icon" href={faviconUrl} />
				<link rel="shortcut icon" href={faviconUrl} />
				{fontUrl ? <link href={fontUrl} rel="stylesheet" /> : null}
			</head>
			<body className="bg-gray-900 text-gray-100">
				<div className="w-full py-[70px]">
					<div
						className="m-auto flex flex-col gap-3"
						style={{ width: '700px' }}
					>
						<h1 className="font-bold text-2xl text-gray-100">
							Sequence Marketplace SDK Playground
						</h1>

						<hr className="my-2 border-gray-700" />
						<Providers sdkInitialState={initialState} sdkConfig={config}>
							<Settings />

							<Navigation />

							{children}
						</Providers>
					</div>
				</div>
			</body>
		</html>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	const { getMarketplaceConfig } = await ssrClient();
	const marketplaceConfig = await getMarketplaceConfig();
	const { title } = marketplaceConfig;

	return {
		title,
	};
}
