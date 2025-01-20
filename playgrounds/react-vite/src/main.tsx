import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './lib/index.css';
import App from './App.tsx';
import '@0xsequence/marketplace-sdk/styles';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Collections } from './tabs/Collections';
import { Collectibles } from './tabs/Collectables';
import { Collectible } from './tabs/Collectable';
import { Debug } from './tabs/Debug';
import Providers from './lib/provider';
import { ROUTES, DEFAULT_ROUTE } from './lib/routes';

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Providers>
				<Routes>
					<Route path="/" element={<Navigate to={DEFAULT_ROUTE} replace />} />
					<Route path="/*" element={<App />}>
						<Route path={ROUTES.COLLECTIONS.path} element={<Collections />} />
						<Route path={ROUTES.COLLECTIBLES.path} element={<Collectibles />} />
						<Route path={ROUTES.COLLECTIBLE.path} element={<Collectible />} />
						<Route path={ROUTES.DEBUG.path} element={<Debug />} />
					</Route>
				</Routes>
			</Providers>
		</BrowserRouter>
	</StrictMode>,
);
