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
import { Marketplace } from './tabs/Marketplace.tsx';
import { Shop } from './tabs/Store.tsx';

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Providers>
				<Routes>
					<Route path="/" element={<Navigate to={DEFAULT_ROUTE} replace />} />
					<Route path="/*" element={<App />}>
						<Route path={ROUTES.COLLECTIONS.path} element={<Collections />} />
						<Route path={ROUTES.MARKETPLACE.path} element={<Marketplace />} />
						<Route path={ROUTES.SHOP.path} element={<Shop />} />
						<Route path={ROUTES.COLLECTIBLE.path} element={<Collectible />} />
						<Route path={ROUTES.INVENTORY.path} element={<Inventory />} />

						<Route path={ROUTES.DEBUG.path} element={<Debug />} />
					</Route>
				</Routes>
			</Providers>
		</BrowserRouter>
	</StrictMode>,
);
