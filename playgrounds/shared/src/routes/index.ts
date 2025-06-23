export const ROUTE_PATHS = {
	COLLECTIONS: 'collections',
	COLLECTIBLES: 'collectibles',
	COLLECTIBLE: 'collectible',
	INVENTORY: 'inventory',
	DEBUG: 'debug',
} as const;

export const ROUTES = {
	COLLECTIONS: {
		path: ROUTE_PATHS.COLLECTIONS,
		label: 'Collections',
	},
	COLLECTIBLES: {
		path: ROUTE_PATHS.COLLECTIBLES,
		label: 'Collectibles',
	},
	COLLECTIBLE: {
		path: ROUTE_PATHS.COLLECTIBLE,
		label: 'Collectible',
	},
	INVENTORY: {
		path: ROUTE_PATHS.INVENTORY,
		label: 'Inventory',
		optional: true,
	},
	DEBUG: {
		path: ROUTE_PATHS.DEBUG,
		label: 'Debug',
		optional: true,
	},
} as const;

export const DEFAULT_ROUTE = `/${ROUTES.COLLECTIONS.path}`;

export const createRoute = {
	collections: () => '/',
	collectibles: (projectId: string) => `/collections/${projectId}`,
	collectible: (projectId: string, collectibleId: string) =>
		`/collections/${projectId}/collectible/${collectibleId}`,
	inventory: () => '/inventory',
	debug: () => '/debug',
} as const;

export type RouteParams = {
	projectId?: string;
	collectibleId?: string;
};

export type PlaygroundType = 'next' | 'react-vite';

// Helper to filter routes by playground type
export function getRoutes(playground: PlaygroundType) {
	const result: Record<string, (typeof ROUTES)[keyof typeof ROUTES]> = {};
	for (const [key, route] of Object.entries(ROUTES)) {
		// Include all routes for both playgrounds now that features are shared
		result[key] = route;
	}
	return result as typeof ROUTES;
}

// Helper to get navigation routes (excludes detail routes)
export function getNavigationRoutes(playground: PlaygroundType) {
	const routes = getRoutes(playground);
	// Exclude COLLECTIBLE as it's not a navigation route
	const { COLLECTIBLE: _unused, ...navigationRoutes } = routes;
	return navigationRoutes;
}
