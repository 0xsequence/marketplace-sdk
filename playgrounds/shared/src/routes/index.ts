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
	collectibles: (collectionAddress: string) => `/${collectionAddress}`,
	collectible: (collectionAddress: string, collectibleId: string) =>
		`/${collectionAddress}/${collectibleId}`,
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
