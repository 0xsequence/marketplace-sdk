import { Box, Divider, Text } from '@0xsequence/design-system';
import { Settings } from './lib/Settings';
import { Outlet } from 'react-router-dom';
import { Navigation } from './components/Navigation';

function App() {
	return (
		<div style={{ width: '100vw', paddingBlock: '70px' }}>
			<Box
				margin="auto"
				gap="3"
				flexDirection="column"
				style={{ width: '700px' }}
			>
				<Text variant="xlarge">Sequence Marketplace SDK Playground</Text>

				<Divider />

				<Settings />

				<Navigation />

				<Outlet />
			</Box>
		</div>
	);
}

export default App;
