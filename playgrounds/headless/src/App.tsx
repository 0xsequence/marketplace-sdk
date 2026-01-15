import { Outlet, useNavigate, useLocation } from 'react-router';
import { ConnectButton } from './components/ConnectButton';

function App() {
	const navigate = useNavigate();
	const location = useLocation();

	const isMarketActive = location.pathname.startsWith('/market');
	const isInventoryActive = location.pathname === '/inventory';

	return (
		<div className="min-h-screen bg-gray-900">
			<header className="border-b border-gray-700 bg-gray-800">
				<div className="mx-auto max-w-6xl px-4 py-4">
					<div className="flex items-center justify-between">
						<h1 className="text-xl font-bold text-white">
							Headless Marketplace SDK
						</h1>
						<div className="flex items-center gap-4">
							<nav className="flex gap-2">
								<button
									onClick={() => navigate('/market')}
									className={`px-3 py-2 rounded ${
										isMarketActive
											? 'bg-blue-600 text-white'
											: 'text-gray-300 hover:bg-gray-700'
									}`}
									type="button"
								>
									Market
								</button>
								<button
									onClick={() => navigate('/inventory')}
									className={`px-3 py-2 rounded ${
										isInventoryActive
											? 'bg-blue-600 text-white'
											: 'text-gray-300 hover:bg-gray-700'
									}`}
									type="button"
								>
									Inventory
								</button>
							</nav>
							<ConnectButton />
						</div>
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-6xl px-4 py-6">
				<Outlet />
			</main>
		</div>
	);
}

export default App;
