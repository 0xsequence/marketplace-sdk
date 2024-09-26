export const collectableKeys = {
  all: () => ['collectable'] as const,
  lists: () => [...collectableKeys.all(), 'list'] as const,
  detail: () => [...collectableKeys.all(), 'detail'] as const,
  topOffer: () =>
    [
      ...collectableKeys.all(),
      ...collectableKeys.detail(),
      'topOffer',
    ] as const,
  useLowestListing: () =>
    [
      ...collectableKeys.all(),
      ...collectableKeys.detail(),
      'lowestListing',
    ] as const,
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
