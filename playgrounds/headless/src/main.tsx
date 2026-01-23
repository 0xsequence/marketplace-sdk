import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import './styles.css';

import App from './App';
import { Collectible } from './pages/Collectible';
import { Collection } from './pages/Collection';
import { Home } from './pages/Home';
import { Inventory } from './pages/Inventory';
import Providers from './providers/Providers';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Providers>
				<Routes>
					<Route path="/" element={<Navigate to="/market" replace />} />
					<Route path="/*" element={<App />}>
						<Route path="market" element={<Home />} />
						<Route path="inventory" element={<Inventory />} />
						<Route
							path="market/:chainId/:collectionAddress"
							element={<Collection />}
						/>
						<Route
							path="market/:chainId/:collectionAddress/:tokenId"
							element={<Collectible />}
						/>
					</Route>
				</Routes>
			</Providers>
		</BrowserRouter>
	</StrictMode>,
);
