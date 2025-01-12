import { Box, Divider, Tabs, Text } from '@0xsequence/design-system';
import { type Tab, useMarketplace } from './lib/MarketplaceContext';
import { Settings } from './lib/Settings';
import Providers from './lib/provider';
import { Collectible } from './tabs/Collectable';
import { Collectibles } from './tabs/Collectables';
import { Collections } from './tabs/Collections';
import { Debug } from './tabs/Debug';

function App() {
	return (
		<Providers>
			<div style={{ width: '100vw', paddingBlock: '70px' }}>
				<InnerApp />
			</div>
		</Providers>
	);
}

function InnerApp() {
	const { setActiveTab, activeTab } = useMarketplace();

	return (
		<Box
			margin="auto"
			gap="3"
			flexDirection="column"
			style={{ width: '700px' }}
		>
			<Text variant="xlarge">Sequence Marketplace SDK Playground</Text>
			<Divider />
			<Settings />
			<Tabs
				defaultValue="collections"
				value={activeTab}
				onValueChange={(tab) => setActiveTab(tab as Tab)}
				tabs={
					[
						{
							label: 'Collections',
							value: 'collections',
							content: <Collections />,
						},
						{
							label: 'Collectibles',
							value: 'collectibles',
							content: <Collectibles />,
						},
						{
							label: 'Collectible',
							value: 'collectible',
							content: <Collectible />,
						},
						{
							label: 'Debug',
							value: 'debug',
							content: <Debug />,
						},
					] as const
				}
			/>
		</Box>
	);
}

export default App;
