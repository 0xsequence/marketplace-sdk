// biome-ignore lint/complexity/noStaticOnlyClass: static class provides better organization and type safety for query keys
class CollectableKeys {
	static all = ['collectable'] as const;
	static details = [...CollectableKeys.all, 'details'] as const;
	static lists = [...CollectableKeys.all, 'list'] as const;
	static floorOrders = [...CollectableKeys.all, 'floorOrders'] as const;
	static userBalances = [
		...CollectableKeys.all,
		...CollectableKeys.details,
		'userBalances',
	] as const;
	static royaltyPercentage = [
		...CollectableKeys.all,
		'royaltyPercentage',
	] as const;
	static highestOffers = [
		...CollectableKeys.all,
		...CollectableKeys.details,
		'highestOffers',
	] as const;
	static lowestListings = [
		...CollectableKeys.all,
		...CollectableKeys.details,
		'lowestListings',
	] as const;
	static offers = [...CollectableKeys.all, 'offers'] as const;
	static offersCount = [...CollectableKeys.all, 'offersCount'] as const;
	static listings = [...CollectableKeys.all, 'listings'] as const;
	static listingsCount = [...CollectableKeys.all, 'listingsCount'] as const;
	static filter = [...CollectableKeys.all, 'filter'] as const;
	static counts = [...CollectableKeys.all, 'counts'] as const;
	static collectibleActivities = [
		...CollectableKeys.all,
		'collectibleActivities',
	] as const;
}

// biome-ignore lint/complexity/noStaticOnlyClass: static class provides better organization and type safety for query keys
class CollectionKeys {
	static all = ['collections'] as const;
	static list = [...CollectionKeys.all, 'list'] as const;
	static detail = [...CollectionKeys.all, 'detail'] as const;
	static collectionActivities = [
		...CollectionKeys.all,
		'collectionActivities',
	] as const;
}

// biome-ignore lint/complexity/noStaticOnlyClass: static class provides better organization and type safety for query keys
class BalanceQueries {
	static all = ['balances'] as const;
	static lists = [...BalanceQueries.all, 'tokenBalances'] as const;
	static collectionBalanceDetails = [
		...BalanceQueries.all,
		'collectionBalanceDetails',
	] as const;
}

// biome-ignore lint/complexity/noStaticOnlyClass: static class provides better organization and type safety for query keys
class CheckoutKeys {
	static all = ['checkouts'] as const;
	static options = [...CheckoutKeys.all, 'options'] as const;
	static cartItems = [...CheckoutKeys.all, 'cartItems'] as const;
}

// biome-ignore lint/complexity/noStaticOnlyClass: static class provides better organization and type safety for query keys
class CurrencyKeys {
	static all = ['currencies'] as const;
	static lists = [...CurrencyKeys.all, 'list'] as const;
	static details = [...CurrencyKeys.all, 'details'] as const;
	static conversion = [...CurrencyKeys.all, 'conversion'] as const;
}

// biome-ignore lint/complexity/noStaticOnlyClass: static class provides better organization and type safety for query keys
class ConfigKeys {
	static all = ['configs'] as const;
	static marketplace = [...ConfigKeys.all, 'marketplace'] as const;
}

// biome-ignore lint/complexity/noStaticOnlyClass: static class provides better organization and type safety for query keys
class TokenKeys {
	static all = ['tokens'] as const;
	static metadata = [...TokenKeys.all, 'metadata'] as const;
	static supplies = [...TokenKeys.all, 'supplies'] as const;
}

// biome-ignore lint/complexity/noStaticOnlyClass: static class provides better organization and type safety for query keys
class TokenSuppliesKeys {
	static all = ['tokenSupplies'] as const;
	static maps = [...TokenSuppliesKeys.all, 'map'] as const;
}

// biome-ignore lint/complexity/noStaticOnlyClass: static class provides better organization and type safety for query keys
class InventoryKeys {
	static all = ['inventory'] as const;

	static collection = (collectionAddress: string, chainId: number) =>
		[...InventoryKeys.all, collectionAddress, chainId] as const;

	static user = (
		collectionAddress: string,
		chainId: number,
		accountAddress: string,
	) =>
		[
			...InventoryKeys.collection(collectionAddress, chainId),
			accountAddress,
		] as const;

	// Internal keys - not exported to users
	static _indexer = (
		collectionAddress: string,
		chainId: number,
		accountAddress: string,
	) =>
		[
			...InventoryKeys.user(collectionAddress, chainId, accountAddress),
			'indexer',
		] as const;

	static _marketplace = (
		collectionAddress: string,
		chainId: number,
		accountAddress: string,
	) =>
		[
			...InventoryKeys.user(collectionAddress, chainId, accountAddress),
			'marketplace',
		] as const;
}

export const collectableKeys = CollectableKeys;
export const collectionKeys = CollectionKeys;
export const balanceQueries = BalanceQueries;
export const checkoutKeys = CheckoutKeys;
export const currencyKeys = CurrencyKeys;
export const configKeys = ConfigKeys;
export const tokenKeys = TokenKeys;
export const tokenSuppliesKeys = TokenSuppliesKeys;
export const inventoryKeys = InventoryKeys;
