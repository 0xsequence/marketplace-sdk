import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './lib/index.css';
import App from './App.tsx';
// import '@0xsequence/marketplace-sdk/styles'

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
