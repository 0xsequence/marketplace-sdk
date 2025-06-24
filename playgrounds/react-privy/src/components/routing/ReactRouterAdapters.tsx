'use client';

import { Link, useNavigate } from 'react-router';
import type { AppLinkProps } from 'shared-components';
import { ROUTES } from '../../lib/routes';

/**
 * React Router adapter for shared AppLink component
 */
export function ReactRouterLinkAdapter({ href, children, className, onClick }: AppLinkProps) {
	return (
		<Link to={href} className={className} onClick={onClick}>
			{children}
		</Link>
	);
}

/**
 * Navigation callback adapter for shared page controllers
 */
export function useReactRouterNavigation() {
	const navigate = useNavigate();

	return {
		navigateToCollectible: (tokenId: string, collectionAddress?: string) => {
			const path = collectionAddress 
				? `/${ROUTES.COLLECTIBLE.path}/${collectionAddress}/${tokenId}`
				: `/${ROUTES.COLLECTIBLE.path}/${tokenId}`;
			navigate(path);
		},
		navigateToCollection: (address: string) => {
			navigate(`/${ROUTES.COLLECTIONS.path}/${address}`);
		},
		navigateToCollectibles: () => {
			navigate(`/${ROUTES.COLLECTIBLES.path}`);
		},
		navigateToCollections: () => {
			navigate(`/${ROUTES.COLLECTIONS.path}`);
		},
		navigateToInventory: () => {
			navigate(`/${ROUTES.INVENTORY.path}`);
		},
		navigateToDebug: () => {
			navigate(`/${ROUTES.DEBUG.path}`);
		},
		// Generic navigation function
		navigateTo: (path: string) => {
			navigate(path);
		},
	};
}

/**
 * Hook to get current route information
 */
export function useCurrentRoute() {
	const navigate = useNavigate();
	
	return {
		navigate,
		// Helper to check if we're on a specific route
		isRoute: (routePath: string) => {
			return window.location.pathname.includes(routePath);
		},
		// Get current path
		getCurrentPath: () => window.location.pathname,
	};
}