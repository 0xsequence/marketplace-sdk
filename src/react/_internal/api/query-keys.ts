export const collectableKeys = {
	all: () => ['collectable'] as const,
	lists: () => [...collectableKeys.all(), 'list'] as const,
	floorOrders: () => [...collectableKeys.all(), 'floorOrders'] as const,
	details: () => [...collectableKeys.all(), 'details'] as const,
	userBalances: () =>
		[
			...collectableKeys.all(),
			...collectableKeys.details(),
			'userBalances',
		] as const,
	royaltyPercentage: () =>
		[...collectableKeys.all(), 'royaltyPercentage'] as const,
	highestOffers: () =>
		[
			...collectableKeys.all(),
			...collectableKeys.details(),
			'highestOffers',
		] as const,
	lowestListings: () =>
		[
			...collectableKeys.all(),
			...collectableKeys.details(),
			'lowestListings',
		] as const,
	offers: () => [...collectableKeys.all(), 'offers'] as const,
	filter: () => [...collectableKeys.all(), 'filter'] as const,
};

export const collectionKeys = {
	all: () => ['collections'],
	list: () => [...collectionKeys.all(), 'list'],
	detail: () => [...collectionKeys.all(), 'detail'],
};

export const balanceQueries = {
	all: () => ['balances'],
	lists: () => [...balanceQueries.all(), 'tokenBalances'],
};

export const checkoutKeys = {
	all: () => ['checkouts'],
	options: () => [...checkoutKeys.all(), 'options'],
	cartItems: () => [...checkoutKeys.all(), 'cartItems'],
};

export const currencyKeys = {
	all: () => ['currencies'],
	lists: () => [...currencyKeys.all(), 'list'],
};

export const configKeys = {
	all: () => ['configs'],
	marketplace: () => [...configKeys.all(), 'marketplace'],
};
