import { Divider, Text } from '@0xsequence/design-system';
import { Outlet, useLocation, useNavigate } from 'react-router';
import {
	MarketTypeToggle,
	Navigation,
	useMarketplace,
} from 'shared-components';
import { PrivyOverridesSettings } from './components/PrivyOverridesSettings';
import { ROUTES } from './lib/routes';

function App() {
	const navigate = useNavigate();
	const location = useLocation();
	const { marketplaceType, setMarketplaceType } = useMarketplace();

	return (
		<div style={{ width: '100vw', paddingBlock: '70px' }}>
			<div className="m-auto flex w-[95%] max-w-[800px] flex-col gap-3">
				<Text variant="xlarge">
					Sequence Marketplace SDK Playground (Privy Edition)
				</Text>
				<PrivyOverridesSettings />
				<div className="mb-2 flex flex-row gap-3 rounded-xl bg-background-raised p-3">
					<MarketTypeToggle
						marketType={marketplaceType as 'market' | 'shop'}
						onMarketTypeChange={(type) =>
							setMarketplaceType(type as 'market' | 'shop')
						}
						showTitle={false}
						variant="toggle"
					/>
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
