import { Button, Divider, Text } from '@0xsequence/design-system';
import { Outlet, useLocation, useNavigate } from 'react-router';
import {
	Navigation,
	OverridesSettings,
	useMarketplace,
} from 'shared-components';
import { ROUTES } from 'shared-components';

function App() {
	const navigate = useNavigate();
	const location = useLocation();
	const { marketplaceType, setMarketplaceType } = useMarketplace();

	return (
		<div style={{ width: '100vw', paddingBlock: '70px' }}>
			<div className="m-auto flex w-[95%] max-w-[800px] flex-col gap-3">
				<Text variant="xlarge">Sequence Marketplace SDK Playground</Text>
				<OverridesSettings />
				<div className="mb-2 flex flex-row gap-3 rounded-xl bg-background-raised p-3">
					<Button
						variant={marketplaceType === 'market' ? 'primary' : 'base'}
						onClick={() => setMarketplaceType('market')}
					>
						Market
					</Button>
					<Button
						variant={marketplaceType === 'shop' ? 'primary' : 'base'}
						onClick={() => setMarketplaceType('shop')}
					>
						Shop
					</Button>
				</div>

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
