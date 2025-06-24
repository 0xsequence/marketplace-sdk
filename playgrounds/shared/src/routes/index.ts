export const ROUTES = {
	COLLECTIONS: {
		path: 'collections',
		label: 'Collections',
	},
	COLLECTIBLES: {
		path: 'collectibles',
		label: 'Collectibles',
	},
	COLLECTIBLE: {
		path: 'collectible',
		label: 'Collectible',
	},
	INVENTORY: {
		path: 'inventory',
		label: 'Inventory',
		optional: true,
	},
	DEBUG: {
		path: 'debug',
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

// Get navigation routes (excludes detail routes)
export function getNavigationRoutes() {
	const { COLLECTIBLE: _unused, ...navigationRoutes } = ROUTES;
	return navigationRoutes;
}
