import { Divider, Text } from '@0xsequence/design-system';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { Navigation, Settings } from 'shared-components';
import { ROUTES } from './lib/routes';

function App() {
	const navigate = useNavigate();
	const location = useLocation();

	return (
		<div style={{ width: '100vw', paddingBlock: '70px' }}>
			<div className="m-auto flex flex-col gap-3 w-[95%] max-w-[800px]">
				<Text variant="xlarge">Sequence Marketplace SDK Playground</Text>

				<Settings />
				<Navigation
					routes={ROUTES}
					pathname={location.pathname}
					showDebug={true}
					onNavigate={(path) => navigate(`/${path}`)}
				/>

				<Divider />

				<Outlet />
			</div>
		</div>
	);
}

export default App;
