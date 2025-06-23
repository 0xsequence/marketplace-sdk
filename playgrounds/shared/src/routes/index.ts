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
	},
	DEBUG: {
		path: ROUTE_PATHS.DEBUG,
		label: 'Debug',
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
