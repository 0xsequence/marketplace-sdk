export * from './components';
export * from './consts';
export * from './store';
export * from './store/hook';
export * from './types';
export * from './util';
export * from './lib/di';
// Note: Adapters are not exported from the main index to avoid framework dependency issues
// Import them directly from their specific files when needed:
// - './lib/adapters/nextjs' (for Next.js projects)  
// - './lib/adapters/react-router' (for React Router projects)
export * from './routes';

import './globals.css';
