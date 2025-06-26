export const ROUTES = {
	COLLECTIONS: {
		path: '',
		label: 'Collections',
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
	return ROUTES;
}
