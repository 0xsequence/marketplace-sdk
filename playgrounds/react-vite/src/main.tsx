import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './lib/index.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { ROUTES } from 'shared-components';
import App from './App.tsx';
import Providers from './lib/provider';
import { Collectible } from './tabs/Collectable';
import { Collectibles } from './tabs/Collectables';
import { Collections } from './tabs/Collections';
import { Debug } from './tabs/Debug.tsx';
import { Inventory } from './tabs/Inventory';

// biome-ignore lint/style/noNonNullAssertion: root element is guaranteed to exist in index.html
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Providers>
				<Routes>
					<Route path="/" element={<Navigate to={'/'} replace />} />
					<Route path="/*" element={<App />}>
						<Route index element={<Collections />} />
						<Route
							path=":chainId/:collectionAddress"
							element={<Collectibles />}
						/>
						<Route
							path=":chainId/:collectionAddress/:tokenId"
							element={<Collectible />}
						/>
						<Route path={ROUTES.INVENTORY.path} element={<Inventory />} />
						<Route path={ROUTES.DEBUG.path} element={<Debug />} />
					</Route>
				</Routes>
			</Providers>
		</BrowserRouter>
	</StrictMode>,
);
