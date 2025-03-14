import { Divider, Text } from '@0xsequence/design-system';
import { Outlet } from 'react-router';
import { Settings } from 'shared-components';
import { Navigation } from './components/Navigation';

function App() {
	return (
		<div style={{ width: '100vw', paddingBlock: '70px' }}>
			<div className="m-auto flex flex-col gap-3" style={{ width: '700px' }}>
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
