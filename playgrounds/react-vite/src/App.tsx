import { Button, Divider, Text } from '@0xsequence/design-system';
import { Outlet, useLocation, useNavigate } from 'react-router';
import {
	Navigation,
	ROUTES,
	Settings,
	useMarketplace,
} from 'shared-components';

function App() {
	const navigate = useNavigate();
	const location = useLocation();
	const { marketplaceType, setMarketplaceType } = useMarketplace();

	function handleChangeMarketplaceType(type: 'market' | 'shop') {
		setMarketplaceType(type);
		navigate('/');
	}

	return (
		<div style={{ width: '100vw', paddingBlock: '70px' }}>
			<div className="m-auto flex w-[95%] max-w-[800px] flex-col gap-3">
				<Text variant="xlarge">Sequence Marketplace SDK Playground</Text>
				<Settings />
				<div className="flex gap-3">
					<div className="mb-2 flex flex-row gap-3 rounded-xl bg-background-raised p-3">
						<Button
							variant={marketplaceType === 'market' ? 'glass' : 'ghost'}
							onClick={() => handleChangeMarketplaceType('market')}
						>
							Market
						</Button>
						<Button
							variant={marketplaceType === 'shop' ? 'glass' : 'ghost'}
							onClick={() => handleChangeMarketplaceType('shop')}
						>
							Shop
						</Button>
					</div>

					<Navigation
						routes={ROUTES}
						pathname={location.pathname}
						showDebug={true}
						onNavigate={(path) => {
							navigate(`/${path}`);
						}}
					/>
				</div>

				<Divider />

				<Outlet />
			</div>
		</div>
	);
}

export default App;
