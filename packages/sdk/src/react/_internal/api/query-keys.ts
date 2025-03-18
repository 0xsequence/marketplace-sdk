// biome-ignore lint/complexity/noStaticOnlyClass:
class CollectableKeys {
	static all: readonly string[] = ['collectable'] as const;
	static details: readonly string[] = [
		...CollectableKeys.all,
		'details',
	] as const;
	static lists: readonly string[] = [...CollectableKeys.all, 'list'] as const;
	static floorOrders: readonly string[] = [
		...CollectableKeys.all,
		'floorOrders',
	] as const;
	static userBalances: readonly string[] = [
		...CollectableKeys.all,
		...CollectableKeys.details,
		'userBalances',
	] as const;
	static royaltyPercentage: readonly string[] = [
		...CollectableKeys.all,
		'royaltyPercentage',
	] as const;
	static highestOffers: readonly string[] = [
		...CollectableKeys.all,
		...CollectableKeys.details,
		'highestOffers',
	] as const;
	static lowestListings: readonly string[] = [
		...CollectableKeys.all,
		...CollectableKeys.details,
		'lowestListings',
	] as const;
	static offers: readonly string[] = [
		...CollectableKeys.all,
		'offers',
	] as const;
	static offersCount: readonly string[] = [
		...CollectableKeys.all,
		'offersCount',
	] as const;
	static listings: readonly string[] = [
		...CollectableKeys.all,
		'listings',
	] as const;
	static listingsCount: readonly string[] = [
		...CollectableKeys.all,
		'listingsCount',
	] as const;
	static filter: readonly string[] = [
		...CollectableKeys.all,
		'filter',
	] as const;
	static counts: readonly string[] = [
		...CollectableKeys.all,
		'counts',
	] as const;
	static collectibleActivities: readonly string[] = [
		...CollectableKeys.all,
		'collectibleActivities',
	] as const;
}

// biome-ignore lint/complexity/noStaticOnlyClass:
class CollectionKeys {
	static all: readonly string[] = ['collections'] as const;
	static list: readonly string[] = [...CollectionKeys.all, 'list'] as const;
	static detail: readonly string[] = [...CollectionKeys.all, 'detail'] as const;
	static collectionActivities: readonly string[] = [
		...CollectionKeys.all,
		'collectionActivities',
	] as const;
}

// biome-ignore lint/complexity/noStaticOnlyClass:
class BalanceQueries {
	static all: readonly string[] = ['balances'] as const;
	static lists: readonly string[] = [
		...BalanceQueries.all,
		'tokenBalances',
	] as const;
	static collectionBalanceDetails: readonly string[] = [
		...BalanceQueries.all,
		'collectionBalanceDetails',
	] as const;
}

// biome-ignore lint/complexity/noStaticOnlyClass:
class CheckoutKeys {
	static all: readonly string[] = ['checkouts'] as const;
	static options: readonly string[] = [...CheckoutKeys.all, 'options'] as const;
	static cartItems: readonly string[] = [
		...CheckoutKeys.all,
		'cartItems',
	] as const;
}

// biome-ignore lint/complexity/noStaticOnlyClass:
class CurrencyKeys {
	static all: readonly string[] = ['currencies'] as const;
	static lists: readonly string[] = [...CurrencyKeys.all, 'list'] as const;
	static details: readonly string[] = [...CurrencyKeys.all, 'details'] as const;
	static conversion: readonly string[] = [
		...CurrencyKeys.all,
		'conversion',
	] as const;
}

// biome-ignore lint/complexity/noStaticOnlyClass:
class ConfigKeys {
	static all: readonly string[] = ['configs'] as const;
	static marketplace: readonly string[] = [
		...ConfigKeys.all,
		'marketplace',
	] as const;
}
export const collectableKeys: typeof CollectableKeys = CollectableKeys;
export const collectionKeys: typeof CollectionKeys = CollectionKeys;
export const balanceQueries: typeof BalanceQueries = BalanceQueries;
export const checkoutKeys: typeof CheckoutKeys = CheckoutKeys;
export const currencyKeys: typeof CurrencyKeys = CurrencyKeys;
export const configKeys: typeof ConfigKeys = ConfigKeys;
