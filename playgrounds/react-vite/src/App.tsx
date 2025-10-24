import { Button, Separator, Text } from '@0xsequence/design-system';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router';
import {
	Navigation,
	ROUTES,
	Settings,
	useMarketplace,
} from 'shared-components';
import type { Address } from 'viem';

function App() {
	const navigate = useNavigate();
	const location = useLocation();
	const { cardType, setCardType } = useMarketplace();
	const { collectionAddress } = useParams<{ collectionAddress: string }>();

	function handleChangeMarketplaceType(type: 'market' | 'shop') {
		setCardType(type);
		navigate('/');
	}

	return (
		<div style={{ width: '100vw', paddingBlock: '70px' }}>
			<div className="m-auto flex w-[95%] max-w-[800px] flex-col gap-3">
				<Text variant="xlarge">Sequence Marketplace SDK Playground</Text>
				<Settings collectionAddress={collectionAddress as Address} />
				<div className="flex gap-3">
					<div className="mb-2 flex flex-row gap-3 rounded-xl bg-background-raised p-3">
						<Button
							variant={cardType === 'market' ? 'secondary' : 'outline'}
							onClick={() => handleChangeMarketplaceType('market')}
						>
							Market
						</Button>
						<Button
							variant={cardType === 'shop' ? 'secondary' : 'outline'}
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

				<Separator />

				<Outlet />
			</div>
		</div>
	);
}

export default App;
