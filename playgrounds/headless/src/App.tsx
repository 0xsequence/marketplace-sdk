import { Outlet, useLocation, useNavigate } from 'react-router';
import { ConnectButton } from './components/ConnectButton';

function App() {
	const navigate = useNavigate();
	const location = useLocation();

	const isMarketActive = location.pathname.startsWith('/market');
	const isInventoryActive = location.pathname === '/inventory';

	return (
		<div className="min-h-screen bg-gray-900">
			<header className="border-gray-700 border-b bg-gray-800">
				<div className="mx-auto max-w-6xl px-4 py-4">
					<div className="flex items-center justify-between">
						<h1 className="font-bold text-white text-xl">
							Headless Marketplace SDK
						</h1>
						<div className="flex items-center gap-4">
							<nav className="flex gap-2">
								<button
									onClick={() => navigate('/market')}
									className={`rounded px-3 py-2 ${
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
									className={`rounded px-3 py-2 ${
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
