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
	marketCollectibles: (chainId: number, collectionAddress: string) =>
		`/market/${chainId}/${collectionAddress}`,
	marketCollectible: (
		chainId: number,
		collectionAddress: string,
		tokenId: bigint,
	) => `/market/${chainId}/${collectionAddress}/${tokenId}`,
	shopCollectibles: (
		chainId: number,
		salesAddress: string,
		itemAddress: string,
	) => `/shop/${chainId}/${salesAddress}/${itemAddress}`,
	shopCollectible: (
		chainId: number,
		salesAddress: string,
		itemAddress: string,
		tokenId: bigint,
	) => `/shop/${chainId}/${salesAddress}/${itemAddress}/${tokenId}`,
	inventory: () => '/inventory',
	debug: () => '/debug',
} as const;

export type RouteParams = {
	projectId?: string;
	tokenId?: string;
};

// Get navigation routes (excludes detail routes)
export function getNavigationRoutes() {
	return ROUTES;
}
