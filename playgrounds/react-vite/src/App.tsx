import { Button, Separator, Text } from '@0xsequence/design-system';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router';
import { Navigation, ROUTES, Settings } from 'shared-components';
import type { Address } from 'viem';

function App() {
	const navigate = useNavigate();
	const location = useLocation();
	const { collectionAddress } = useParams<{ collectionAddress: string }>();

	const isShop = location.pathname.startsWith('/shop');
	const isMarket = location.pathname.startsWith('/market');

	return (
		<div style={{ width: '100vw', paddingBlock: '70px' }}>
			<div className="m-auto flex w-[95%] max-w-[800px] flex-col gap-3">
				<Text variant="xlarge">Sequence Marketplace SDK Playground</Text>
				<Settings collectionAddress={collectionAddress as Address} />
				<div className="flex gap-3">
					<div className="mb-2 flex flex-row gap-3 rounded-xl bg-background-raised p-3">
						<Button
							variant={isMarket ? 'secondary' : 'outline'}
							onClick={() => navigate('/market')}
						>
							Market
						</Button>
						<Button
							variant={isShop ? 'secondary' : 'outline'}
							onClick={() => navigate('/shop')}
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
