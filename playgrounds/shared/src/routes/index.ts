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
	collectibles: (chainId: number, collectionAddress: string) =>
		`/${chainId}/${collectionAddress}`,
	collectible: (
		chainId: number,
		collectionAddress: string,
		collectibleId: bigint,
	) => `/${chainId}/${collectionAddress}/${collectibleId}`,
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
