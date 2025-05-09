export const ROUTES = {
	COLLECTIONS: {
		path: 'collections',
		label: 'Collections',
	},
	MARKET: {
		path: 'market',
		label: 'Market',
	},
	SHOP: {
		path: 'shop',
		label: 'Shop',
	},
	COLLECTIBLE: {
		path: 'collectible',
		label: 'Collectible',
	},
	INVENTORY: {
		path: 'inventory',
		label: 'Inventory',
	},

	DEBUG: {
		path: 'debug',
		label: 'Debug',
	},
} as const;

export const DEFAULT_ROUTE = `/${ROUTES.COLLECTIONS.path}`;
