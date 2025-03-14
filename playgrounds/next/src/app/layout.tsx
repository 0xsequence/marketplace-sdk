import { Settings } from 'shared-components';
import { ssrClient } from './marketplace-sdk/ssr';
import '@0xsequence/design-system/index.css';
import './globals.css';
import { ClientNavigation } from '@/components/ClientNavigation';
import Providers from '@/lib/providers';

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
			<body className="bg-black/96 text-gray-100">
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
							<ClientNavigation />
							{children}
						</Providers>
					</div>
				</div>
			</body>
		</html>
	);
}
