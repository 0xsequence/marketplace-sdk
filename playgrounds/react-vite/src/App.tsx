import { Divider, Text } from '@0xsequence/design-system';
import { Settings } from './lib/Settings';
import { Outlet } from 'react-router';
import { Navigation } from './components/Navigation';

function App() {
	return (
		<div style={{ width: '100vw', paddingBlock: '70px' }}>
			<div className="flex m-auto gap-3 flex-col" style={{ width: '700px' }}>
				<Text variant="xlarge">Sequence Marketplace SDK Playground</Text>

				<Divider />

				<Settings />

				<Navigation />

				<Outlet />
			</div>
		</div>
	);
}

export default App;
