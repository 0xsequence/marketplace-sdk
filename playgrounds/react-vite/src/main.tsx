import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './lib/index.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import App from './App.tsx';
import Providers from './lib/provider';
import { DEFAULT_ROUTE, ROUTES } from './lib/routes';
import { Collectible } from './tabs/Collectable';
import { Collections } from './tabs/Collections';
import { Debug } from './tabs/Debug.tsx';
import { Inventory } from './tabs/Inventory';
import { Market } from './tabs/Market.tsx';
import { Sale721 } from './tabs/Sale721.tsx';
import { Sale1155 } from './tabs/Sale1155.tsx';
// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Providers>
				<Routes>
					<Route path="/" element={<Navigate to={DEFAULT_ROUTE} replace />} />
					<Route path="/*" element={<App />}>
						<Route path={ROUTES.COLLECTIONS.path} element={<Collections />} />
						<Route path={ROUTES.MARKET.path} element={<Market />} />
						<Route path={ROUTES.SALE_1155.path} element={<Sale1155 />} />
						<Route path={ROUTES.SALE_721.path} element={<Sale721 />} />
						<Route path={ROUTES.COLLECTIBLE.path} element={<Collectible />} />
						<Route path={ROUTES.INVENTORY.path} element={<Inventory />} />

						<Route path={ROUTES.DEBUG.path} element={<Debug />} />
					</Route>
				</Routes>
			</Providers>
		</BrowserRouter>
	</StrictMode>,
);
