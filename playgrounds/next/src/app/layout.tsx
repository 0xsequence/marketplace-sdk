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
						className="flex m-auto gap-3 flex-col"
						style={{ width: '700px' }}
					>
						<h1 className="text-2xl font-bold text-gray-100">
							Sequence Marketplace SDK Playground
						</h1>

						<hr className="border-gray-700 my-2" />
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
