import { ssrClient } from '@/app/marketplace-sdk/ssr';
import type { Metadata } from 'next';

function Layout({ children }: { children: React.ReactNode }) {
	return <div>{children}</div>;
}

export default Layout;

export async function generateMetadata(): Promise<Metadata> {
	const { getMarketplaceConfig } = await ssrClient();
	const marketplaceConfig = await getMarketplaceConfig();
	const { title } = marketplaceConfig;
	const pageTitle = `${title} - Collections`;

	return {
		title: pageTitle,
	};
}
