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
	static listings = [...CollectableKeys.all, 'listings'] as const;
	static filter = [...CollectableKeys.all, 'filter'] as const;
	static counts = [...CollectableKeys.all, 'counts'] as const;
}

class CollectionKeys {
	static all = ['collections'] as const;
	static list = [...CollectionKeys.all, 'list'] as const;
	static detail = [...CollectionKeys.all, 'detail'] as const;
}

class BalanceQueries {
	static all = ['balances'] as const;
	static lists = [...BalanceQueries.all, 'tokenBalances'] as const;
}

class CheckoutKeys {
	static all = ['checkouts'] as const;
	static options = [...CheckoutKeys.all, 'options'] as const;
	static cartItems = [...CheckoutKeys.all, 'cartItems'] as const;
}

class CurrencyKeys {
	static all = ['currencies'] as const;
	static lists = [...CurrencyKeys.all, 'list'] as const;
}

class ConfigKeys {
	static all = ['configs'] as const;
	static marketplace = [...ConfigKeys.all, 'marketplace'] as const;
}
export const collectableKeys = CollectableKeys;
export const collectionKeys = CollectionKeys;
export const balanceQueries = BalanceQueries;
export const checkoutKeys = CheckoutKeys;
export const currencyKeys = CurrencyKeys;
export const configKeys = ConfigKeys;
