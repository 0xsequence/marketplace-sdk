import { Separator, Text } from '@0xsequence/design-system';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router';
import { Navigation, ROUTES, Settings } from 'shared-components';
import type { Address } from 'viem';

function App() {
	const navigate = useNavigate();
	const location = useLocation();
	const { collectionAddress } = useParams<{ collectionAddress: string }>();

	return (
		<div style={{ width: '100vw', paddingBlock: '70px' }}>
			<div className="m-auto flex w-[95%] max-w-[800px] flex-col gap-3">
				<Text variant="xlarge">
					Sequence Marketplace SDK wallets playground
				</Text>
				<Settings collectionAddress={collectionAddress as Address} />
				<div className="flex gap-3">
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
