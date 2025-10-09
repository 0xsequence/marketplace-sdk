import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Providers } from './providers.tsx';

createRoot(document.getElementById('root') as HTMLElement).render(
	<StrictMode>
		<Providers>
			<App />
		</Providers>
	</StrictMode>,
);
